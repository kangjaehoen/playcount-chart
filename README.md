# Playcount Chart

Soundat Playcount 프론트엔드 과제용 곡 차트 페이지입니다. Next.js App Router 기반으로 일간 차트 화면을 중심으로 구성되어 있으며, 루트 경로 접속 시 `/charts/daily`로 이동합니다.

## 실행 방법

### 1. 의존성 설치

```bash
npm install
```

이 프로젝트는 Next.js 16을 사용하므로 Node.js `20.9.0` 이상 환경에서 실행하는 것을 권장합니다.

### 2. 개발 서버 실행

```bash
npm run dev
```

개발 서버 기본 주소는 `http://localhost:3000`입니다.

- 메인 진입 경로: `http://localhost:3000`
- 일간 차트 페이지: `http://localhost:3000/charts/daily`

### 3. 프로덕션 빌드 및 실행

```bash
npm run build
npm run start
```

## 사용 가능한 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버를 실행합니다. |
| `npm run build` | 프로덕션 빌드를 생성합니다. |
| `npm run start` | 생성된 프로덕션 빌드를 실행합니다. |
| `npm run lint` | ESLint로 코드 품질을 검사합니다. |
| `npm run typecheck` | TypeScript 타입 검사를 실행합니다. |
| `npm run format` | Prettier로 전체 코드를 포맷합니다. |
| `npm run format:check` | Prettier 포맷 적용 여부를 검사합니다. |

## 주요 라이브러리

| 라이브러리 | 용도 |
| --- | --- |
| Next.js | App Router 기반 라우팅과 React 애플리케이션 프레임워크 |
| React / React DOM | UI 컴포넌트 구성 |
| TypeScript | 정적 타입 기반 개발 |
| MUI / MUI Icons | 화면 레이아웃, 컴포넌트, 아이콘 구성 |
| Emotion | MUI 스타일 엔진 및 스타일링 |
| Recharts | 차트 시각화 |
| Zustand | 차트 화면 상태 관리 |
| Pretendard | 전역 폰트 |
| ESLint | 코드 품질 검사 |
| Prettier | 코드 포맷팅 |

## 현재 구현 범위

- App Router 기반 라우팅
- 루트 경로에서 `/charts/daily`로 리다이렉트
- 좌측 사이드바와 곡 차트 일간/주간/월간/분기별 메뉴
- 일간 차트 페이지의 상단 필터, 차트 선택 메뉴, 테이블, 페이지네이션, FAB
- MUI theme 및 전역 스타일
- Zustand 기반 화면 상태 초안
- API 명세 기반 타입과 mock API 교체 지점 초안
- Dumbbell 차트 프리뷰

## 주요 폴더 구조

```text
src/
  app/                 Next.js App Router 페이지와 전역 레이아웃
  components/          공통 레이아웃 및 차트 컴포넌트
  features/            화면 단위 기능 컴포넌트
  lib/                 API 타입, mock API, 차트 데이터 가공 로직
  store/               Zustand 상태 관리
  theme/               MUI theme 설정
```
