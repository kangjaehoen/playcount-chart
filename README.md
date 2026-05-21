# Playcount Chart

Soundat Playcount 프론트엔드 과제용 일간 곡 차트 페이지입니다.

## 실행

```bash
npm install
npm run dev
```

개발 서버 기본 주소는 `http://localhost:3000`입니다. 현재 루트 경로는 `/charts/daily`로 이동합니다.

## 주요 스택

- Next.js
- TypeScript
- MUI
- Zustand
- Recharts

## 현재 세팅 범위

- App Router 기반 라우팅
- 좌측 사이드바와 곡 차트 일간/주간/월간/분기별 메뉴
- 일간 차트 페이지의 상단 필터, 차트 선택 메뉴, 테이블 뼈대, 페이지네이션, FAB
- MUI theme 및 전역 스타일
- Zustand 화면 상태 초안
- API 명세 기반 타입과 mock API 교체 지점 초안

## 다음 구현 순서

1. 랜덤 mock 데이터 생성기 구현
2. chart -> song info -> album info -> stats 조합 로직 구현
3. stats 배열 정규화와 계산 유틸 분리
4. 실제 row view model을 테이블에 연결
5. Dumbbell 차트와 플랫폼별 순위 완성
