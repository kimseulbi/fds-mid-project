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
  member: document.querySelector("#member").content
};

const rootEl = document.querySelector(".container");
const memberEl = document.querySelector(".member");

// 페이지 그리는 함수 작성 순서
// 1. 템플릿 복사
// 2. 요소 선택
// 3. 필요한 데이터 불러오기
// 4. 내용 채우기
// 5. 이벤트 리스너 등록하기
// 6. 템플릿을 문서에 삽입

// 인덱스페이지
async function drawindexPage() {
  drawmemberInfo();
  drawcontentPage();
}

// login일때
function login(token) {
  localStorage.setItem("token", token);
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
  memberEl.classList.add("authed");
}

// logout일때
function logout() {
  localStorage.removeItem("token");
  delete api.defaults.headers["Authorization"];
  memberEl.classList.remove("authed");
}

// 헤더 member메뉴
async function drawmemberInfo() {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.member, true);
  if (memberEl.classList.contains('authed')) {
    frag.querySelector(".member-logout").addEventListener("click", e => {
      logout();
      drawcontentPage();
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
  console.log('나와라')
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

// 메인페이지
async function drawcontentPage() {
  alert('메인페이지')
}

if (localStorage.getItem("token")) {
  login(localStorage.getItem("token"));
}

drawindexPage();
// 페이지 로드 시 그릴 화면 설정
// if (localStorage.getItem('token')) {
//   drawPostList()
// } else {
//   drawLoginForm()
// }
