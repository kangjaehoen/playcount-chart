# Playcount Chart

Soundat Playcount 프론트엔드 과제용 곡 차트 페이지입니다. Next.js App Router 기반으로 일간 차트 화면을 중심으로 구성되어 있으며, 루트 경로 접속 시 `/charts/daily`로 이동합니다.

## 배포 주소

- 일간 차트 페이지: https://playcount-chart.vercel.app/charts/daily

## 프로젝트 실행 방법

### 1. 의존성 설치

npm install


### 2. 개발 서버 실행

npm run dev


개발 서버 기본 주소는 `http://localhost:3000`입니다.

- 메인 진입 경로: `http://localhost:3000`
- 일간 차트 페이지: `http://localhost:3000/charts/daily`

### 3. 프로덕션 빌드 및 실행

npm run build
npm run start


## 주요 라이브러리 및 도구

 프레임워크 :  Next.js 16.2.6 
 UI  : React / React DOM 19.2.6 
 UI 컴포넌트 :  MUI Material / MUI Icons  9.0.1
 스타일링 :  Emotion  cache 11.14.0, react 11.14.0, styled 11.14.1 
 차트 : Recharts  3.8.1 차트 시각화 
 상태 관리 : Zustand 5.0.13` 
 폰트 : Pretendard 1.3.9`
 타입 검사 : TypeScript 6.0.3` 
 코드 검사 : ESLint / eslint-config-next  9.39.4, 16.2.6
 포맷팅 : Prettier 3.8.3

