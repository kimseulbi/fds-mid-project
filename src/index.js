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
  cartList: document.querySelector("#cart-list").content,
  cartItem: document.querySelector("#cart-item").content
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
      alert("장바구니");
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
    frag.querySelector(".member-cart").addEventListener("click", e => {
      alert("장바구니");
    });
    frag.querySelector(".member-mypage").addEventListener("click", e => {
      alert("마이페이지");
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
  console.log("메인페이지 상품데이터: ",list);
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
  // 3. 필요한 데이터 불러오기
  const { data: item } = await api.get(`/products/${productId}`, {
    params: {
      _embed: "options"
    }
  });
  // 4. 내용 채우기
  productTitleEl.textContent = item.title;
  productImgEl.setAttribute("src", item.mainImgUrl);
  productImgEl.setAttribute("alt", item.title);
  productBeforePriceEl.textContent = item.options[0].beforePrice;
  productPriceEl.textContent = item.options[0].price.toLocaleString();
  productmanufacturerEl.textContent = item.manufacturer;
  // 5. 이벤트 리스너 등록하기
  cartFromEl.addEventListener("submit", e => {
    e.preventDefault();
    // 지금 선택되어 있는 option 요소 객체의 value 어트리뷰트에 지정되어있는 값이 읽어와진다.
    const quantity = parseInt(e.target.elements.quantity.value);
    console.log("quantity", quantity);


  // 장바구니 호출
    drawCartPage(quantity);
  });
  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = "";
  rootEl.appendChild(frag);
}

// 장바구니
async function drawCartPage() {
  // 1. 템플릿 복사
  const listFrag = document.importNode(templates.cartList, true);
  // 2. 요소 선택
  const cartlistEl = listFrag.querySelector(".cart-list");
  // 3. 필요한 데이터 불러오기
  // 장바구니에 담지 않은 물건 불러오기
  const { data: cartlist } = await api.get("/cartItems", {
    params: {
      _embed: "options",
      // orderId: -1
    }
  });

  // 장바구니에 어떻게 담냐고!!!
  // 해당 아이템을 장바구니에 어떻게 넣냐고!!!

  cartlist.forEach(cartItem => {
    // 1. 템플릿 복사
    const frag = document.importNode(templates.cartItem, true);
    // 2. 요소 선택
    const productTitleEl = frag.querySelector(".item-title");
    const productImgEl = frag.querySelector(".item-img");
    const productPriceEl = frag.querySelector(".item-price");

    productTitleEl.textContent = cartItem.title;
    productImgEl.setAttribute("src", cartItem.mainImgUrl);
    productImgEl.setAttribute("alt", cartItem.title);
    productPriceEl.textContent = cartItem.options[0].price.toLocaleString();

    // 6. 템플릿을 문서에 삽입
    cartlistEl.appendChild(frag);
  });
  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = "";
  rootEl.appendChild(listFrag);
}

if (localStorage.getItem("token")) {
  login(localStorage.getItem("token"));
}

drawindexPage();
