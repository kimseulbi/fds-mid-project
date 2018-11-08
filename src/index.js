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
  productItem: document.querySelector("#product-item").content
};

const rootEl = document.querySelector(".container");
const memberEl = document.querySelector(".member");
const logoEl = document.querySelector('.logo');

// 페이지 그리는 함수 작성 순서
// 1. 템플릿 복사
// 2. 요소 선택
// 3. 필요한 데이터 불러오기
// 4. 내용 채우기
// 5. 이벤트 리스너 등록하기
// 6. 템플릿을 문서에 삽입

// 로고를 누르면 첫페이지로 이동
logoEl.addEventListener('click', e => {
  e.preventDefault();
  drawindexPage();
});

// 인덱스페이지
async function drawindexPage() {
  drawmemberInfo();
  drawcontentPage();
}

// login을 누르면
function login(token) {
  localStorage.setItem("token", token);
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
  memberEl.classList.add("authed");
}

// logout을 누르면
function logout() {
  localStorage.removeItem("token");
  delete api.defaults.headers["Authorization"];
  memberEl.classList.remove("authed");
}

// 헤더 member메뉴
async function drawmemberInfo() {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.member, true);
  if (memberEl.classList.contains("authed")) {
    frag.querySelector(".member-logout").addEventListener("click", e => {
      e.preventDefault();
      logout();
      drawcontentPage();
    });
    frag.querySelector(".member-cart").addEventListener("click", e => {
      e.preventDefault();
      alert("장바구니");
    });
    frag.querySelector(".member-mypage").addEventListener("click", e => {
      e.preventDefault();
      alert("마이페이지");
    });
  } else {
    frag.querySelector(".member-login").addEventListener("click", e => {
      e.preventDefault();
      drawLoginForm();
    });
    frag.querySelector(".member-join").addEventListener("click", e => {
      e.preventDefault();
      alert("회원가입");
    });
    frag.querySelector(".member-cart").addEventListener("click", e => {
      e.preventDefault();
      alert("장바구니");
    });
    frag.querySelector(".member-mypage").addEventListener("click", e => {
      e.preventDefault();
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
    drawcontentPage();
  });
  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = "";
  rootEl.appendChild(frag);
}

// 메인페이지 상품 목록
async function drawcontentPage() {
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
  console.log(list);
  list.forEach(productItem => {
    // 1. 템플릿 복사
    const frag = document.importNode(templates.productItem, true);
    // 2. 요소 선택
    const productTitleEl = frag.querySelector(".product-item-title");
    const productImgEl = frag.querySelector(".product-item-img");
    const productPriceEl = frag.querySelector(".product-item-price");
    console.log(frag);
    productTitleEl.textContent = productItem.title;
    productImgEl.setAttribute("src", productItem.mainImgUrl);
    productImgEl.setAttribute("alt", productItem.title);
    productPriceEl.textContent = productItem.options[0].price.toLocaleString();
    listEl.appendChild(frag);
  });
  rootEl.textContent = "";
  rootEl.appendChild(listFrag);
}

if (localStorage.getItem("token")) {
  login(localStorage.getItem("token"));
}

drawindexPage();
