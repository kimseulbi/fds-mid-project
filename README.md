# FDS 중간 프로젝트 템플릿

이 저장소를 중간 프로젝트에서 템플릿으로 사용할 수 있습니다. 빌드 도구로 [Parcel](https://parceljs.org/)을 사용하고 있으며, [create-react-app](https://github.com/facebook/create-react-app)에서 사용하는 [Babel](http://babeljs.io/) 프리셋인 [babel-preset-react-app](https://github.com/facebook/create-react-app/tree/master/packages/babel-preset-react-app)을 통해 여러 최신 문법을 사용할 수 있도록 설정되어 있습니다.

개발을 시작하기 전, [개발 가이드](./guide.md)를 읽어보세요.

## 기획
 > 배민 문방구

### 목표
  - 최소요구사항 구현
    * 사용자는 로그인을 할 수 있습니다.
    * 사용자는 카테고리별 상품 목록 페이지를 이용할 수 있습니다.
    * 사용자는 상품 페이지를 통해 상품에 대한 자세한 정보를 확인할 수 있습니다.
    * 사용자는 장바구니에 상품을 담거나 장바구니에서 상품을 제거할 수 있습니다.
    * 사용자는 장바구니에 담긴 항목 전체를 주문할 수 있습니다.
    * 사용자는 주문 내역을 확인할 수 있습니다.

### 일정
  - 11월 07일 (수)
    * 메인화면, 로그인

  - 11월 08일 (목) ~ 11월 09일 (금)
    * 상품페이지, 장바구니, 주문내역확인

  - 11월 10일 (토) ~ 11월 11일 (일)
    * +a

## npm 명령

- `npm install` - 프로젝트 실행에 필요한 파일을 설치하는 명령. 프로젝틑 최초 실행 시 반드시 실행해주어야 합니다.
- `npm start` - 개발용 서버를 실행시키는 명령
- `npm run build` - Netlify 등의 호스팅 서비스에서 사용할 수 있는 HTML, CSS, JS 파일을 생성해주는 명령. `dist` 폴더에 파일이 생성됩니다.

## 저장소 복사하기

**Github의 fork 기능으로는 계정 당 저장소 하나밖에 복사하지 못합니다.** Fork 기능을 사용하지 않고 프로젝트를 복사하려면, 아래의 절차대로 해 주세요.

1. 복사하고 싶은 저장소를 `git clone` 명령을 사용해 내려받는다.
1. 내려받은 폴더로 이동한 후, `rm -rf .git` 명령을 실행한다.
1. `git init`, `git add .`, `git commit -m "..."` 명령을 차례로 실행한다. (저장소 초기화)
1. Github에서 새 저장소를 만든 후, 위에서 초기화한 저장소를 푸시한다.
