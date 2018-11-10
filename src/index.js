import "@babel/polyfill"; // 이 라인을 지우지 말아주세요!

import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_URL
});

api.interceptors.request.use(function(config) {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = "Bearer " + token;
  }
  return config;
});

const templates = {
  loginForm: document.querySelector("#login").content,
  member: document.querySelector("#member").content,
  productList: document.querySelector("#product-list").content,
  productItem: document.querySelector("#product-item").content,
  productDetails: document.querySelector("#product-details").content,
  cartListTemp: document.querySelector("#cart-list").content,
  cartItemTemp: document.querySelector("#cart-item").content
};

const rootEl = document.querySelector(".container");
const memberEl = document.querySelector(".member");
const logoEl = document.querySelector(".logo");

// 페이지 그리는 함수 작성 순서
// 1. 템플릿 복사
// 2. 요소 선택
// 3. 필요한 데이터 불러오기
// 4. 내용 채우기
// 5. 이벤트 리스너 등록하기
// 6. 템플릿을 문서에 삽입

// 로고를 누르면 첫페이지로 이동
logoEl.addEventListener("click", e => {
  e.preventDefault();
  drawindexPage();
});

// 인덱스페이지
async function drawindexPage() {
  drawmemberInfo();
  drawMainPage();
}

// login을 누르면
function login(token) {
  localStorage.setItem("token", token);
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
  document.body.classList.add("authed");
}

// logout을 누르면
function logout() {
  localStorage.removeItem("token");
  document.body.classList.remove("authed");
}

// 헤더 member메뉴
async function drawmemberInfo() {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.member, true);
  if (document.body.classList.contains("authed")) {
    frag.querySelector(".member-logout").addEventListener("click", e => {
      logout();
      drawMainPage();
    });
    frag.querySelector(".member-cart").addEventListener("click", e => {
      drawCartPage();
    });
    frag.querySelector(".member-mypage").addEventListener("click", e => {
      alert("마이페이지");
    });
  } else {
    frag.querySelector(".member-login").addEventListener("click", e => {
      drawLoginForm();
    });
    frag.querySelector(".member-join").addEventListener("click", e => {
      alert("회원가입");
    });
  }
  // 6. 템플릿을 문서에 삽입
  memberEl.textContent = "";
  memberEl.appendChild(frag);
}

// 로그인화면
async function drawLoginForm() {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.loginForm, true);
  // 2. 요소 선택
  const formEl = frag.querySelector(".login-form");
  // 3. 필요한 데이터 불러오기
  // 4. 내용 채우기
  // 5. 이벤트 리스너 등록하기
  formEl.addEventListener("submit", async e => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;

    const res = await api.post("/users/login", {
      username,
      password
    });
    localStorage.setItem("token", res.data.token);
    document.body.classList.add("authed");
    drawMainPage();
  });
  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = "";
  rootEl.appendChild(frag);
}

// 메인페이지 상품 목록
async function drawMainPage() {
  // 1. 템플릿 복사
  const listFrag = document.importNode(templates.productList, true);
  // 2. 요소 선택
  const listEl = listFrag.querySelector(".product-list");
  // 3. 필요한 데이터 불러오기
  const { data: list } = await api.get("/products", {
    params: {
      _embed: "options"
    }
  });
  // const res = await api.get('/products')
  // const list = res.data
  console.log("메인페이지 상품데이터: ", list);
  list.forEach(productItem => {
    // 1. 템플릿 복사
    const frag = document.importNode(templates.productItem, true);
    // 2. 요소 선택
    const productTitleEl = frag.querySelector(".item-title");
    const productImgEl = frag.querySelector(".item-img");
    const productPriceEl = frag.querySelector(".item-price");
    const productBeforePriceEl = frag.querySelector(".item-before-price");

    productTitleEl.textContent = productItem.title;
    productImgEl.setAttribute("src", productItem.mainImgUrl);
    productImgEl.setAttribute("alt", productItem.title);
    productPriceEl.textContent = productItem.options[0].price.toLocaleString();
    productBeforePriceEl.textContent = productItem.options[0].beforePrice;
    // 6. 템플릿을 문서에 삽입
    listEl.appendChild(frag);
    // 5. 이벤트 리스너 등록하기
    productImgEl.addEventListener("click", e => {
      drawProductDetailsPage(productItem.id);
    });
    productTitleEl.addEventListener("click", e => {
      drawProductDetailsPage(productItem.id);
    });
    productPriceEl.addEventListener("click", e => {
      drawProductDetailsPage(productItem.id);
    });
  });
  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = "";
  rootEl.appendChild(listFrag);
}

// 상품 상세 페이지
async function drawProductDetailsPage(productId) {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.productDetails, true);
  // 2. 요소 선택
  const productImgEl = frag.querySelector(".details-img");
  const productTitleEl = frag.querySelector(".details-title");
  const productBeforePriceEl = frag.querySelector(".details-before-price");
  const productPriceEl = frag.querySelector(".details-price");
  const productmanufacturerEl = frag.querySelector(".details-manufacturer");
  const cartFromEl = frag.querySelector(".cart-form");
  const optionSelectEl = frag.querySelector(".options > option");
  const quantityEl = frag.querySelector(".quantity");
  const productTotalPriceEl = frag.querySelector(".details-total-price");

  // 3. 필요한 데이터 불러오기
  const { data: item } = await api.get(`/products/${productId}`, {
    params: {
      _embed: "options"
    }
  });
  console.log("제품정보", item.options);

  // 4. 내용 채우기
  productTitleEl.textContent = item.title;
  productImgEl.setAttribute("src", item.mainImgUrl);
  productImgEl.setAttribute("alt", item.title);
  productBeforePriceEl.textContent = item.options[0].beforePrice;
  productPriceEl.textContent = item.options[0].price.toLocaleString() + "원";
  productmanufacturerEl.textContent = item.manufacturer;
  optionSelectEl.textContent = item.options[0].title;
  optionSelectEl.setAttribute("value", item.options[0].id);

  // 5. 이벤트 리스너 등록하기
  // 수량 이벤트
  quantityEl.addEventListener("input", async e => {
    const value = parseInt(e.target.value);
    const price = parseInt(productPriceEl.textContent.split(",").join(""));

    if (!Number.isNaN(value) && value > 0) {
      console.log("수량/가격: ", value, price);
      productTotalPriceEl.textContent = (value * price).toLocaleString();
      console.log("제품 토탈 가격: ", productTotalPriceEl.textContent);
    } else {
      alert("구매수량은 숫자만 가능합니다");
    }
  });

  // 장바구니 이벤트
  cartFromEl.addEventListener("submit", async e => {
    e.preventDefault();

    // 지금 선택되어 있는 option 요소 객체의 value 어트리뷰트에 지정되어있는 값이 읽어와진다.
    const quantity = parseInt(e.target.elements.quantity.value);
    const option = parseInt(e.target.elements.option.value);

    if (localStorage.getItem("token")) {
      await api.post("/cartItems", {
        ordered: false,
        quantity: quantity,
        optionId: option
      });
      // 장바구니 호출
      drawCartPage();
    } else {
      // 로그인화면 호출
      drawLoginForm();
    }
  });

  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = "";
  rootEl.appendChild(frag);
}

// 장바구니
async function drawCartPage() {
  // 1. 템플릿 복사
  const listFrag = document.importNode(templates.cartListTemp, true);
  // 2. 요소 선택
  const cartlistEl = listFrag.querySelector(".cart-list");
  const backEl = listFrag.querySelector(".back");
  const allDeleteEl = listFrag.querySelector(".all-delete");
  const goProductList = listFrag.querySelector(".go-product-list");
  const orderEl = listFrag.querySelector(".order");
  const listTotalPrice = listFrag.querySelector(".list-total-price");
  // 3. 필요한 데이터 불러오기
  // 장바구니에 담지 않은 물건 불러오기
  const { data: cartlist } = await api.get("/cartItems", {
    params: {
      ordered: false,
      _expand: "option"
    }
  });
  console.log("장바구니데이터", cartlist);

  const params = new URLSearchParams();
  cartlist.forEach(c => params.append("id", c.option.productId));

  const { data: options } = await api.get("/products", {
    params
  });

  console.log("장바구니 데이터 + 옵션데이터", options);

  cartlist.forEach(cartItem => {
    // 1. 템플릿 복사
    const frag = document.importNode(templates.cartItemTemp, true);
    // 2. 요소 선택
    const productTitleEl = frag.querySelector(".item-title");
    const productImgEl = frag.querySelector(".item-img");
    const productPriceEl = frag.querySelector(".item-price");
    const productdeleteEl = frag.querySelector(".item-delete");

    // 4. 내용 채우기
    const product = options.find(item => item.id === cartItem.option.productId);

    productTitleEl.textContent = product.title;
    productImgEl.setAttribute("src", product.mainImgUrl);
    productImgEl.setAttribute("alt", product.title);
    productPriceEl.textContent = (
      cartItem.option.price * cartItem.quantity
    ).toLocaleString();

    // 5. 이벤트 리스너 등록하기
    productdeleteEl.addEventListener('click', async e =>{
      await api.delete(`/cartItems/${cartItem.id}`);
      drawCartPage();
    });


    // 6. 템플릿을 문서에 삽입
    cartlistEl.appendChild(frag);
  });

  // 5. 이벤트 리스너 등록하기
  // backEl.addEventListener("click", async e => {
  //   window.history.back();
  // });

  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = "";
  rootEl.appendChild(listFrag);
}

if (localStorage.getItem("token")) {
  login(localStorage.getItem("token"));
}

drawindexPage();
