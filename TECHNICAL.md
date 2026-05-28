# Playcount Chart 기술 문서


## 아키텍처 설명

### 디렉토리 구조

src/
  app/                 Next.js App Router 라우트와 전역 레이아웃
  components/          여러 화면에서 재사용 가능한 컴포넌트
  features/            화면 단위 기능 컴포넌트
  lib/api/             API 타입과 mock API
  lib/charts/          차트 데이터 가공 로직
  store/               Zustand 화면 상태 관리
  theme/               MUI theme 설정


`/` 경로는 `/charts/daily`로 이동하고, 일간 차트 화면은 `DailyChartSetupPage`에서 렌더링합니다. 주간, 월간, 분기별 차트는 라우트와 placeholder 화면만 연결했습니다.

### 컴포넌트 분리 기준

- `AppShell`: 좌측 사이드바와 공통 레이아웃을 담당합니다.
- `DailyChartSetupPage`: 일간 차트 화면의 필터, 테이블, 페이지네이션, 로딩 상태를 담당합니다.
- `DumbbellPreview`: 차트별 순위 비교 그래프만 담당합니다.
- `PlaceholderChartPage`: 아직 구현되지 않은 차트 화면의 공통 placeholder입니다.

화면 전체 흐름을 담당하는 컴포넌트는 `features`에 두고, 여러 화면에서 재사용 가능하거나 역할이 독립적인 컴포넌트는 `components`에 분리했습니다.

### 데이터 fetching 레이어

현재는 실제 API 서버 대신 `src/lib/api/mockApi.ts`에서 API 함수 형태의 mock 데이터를 제공합니다. 화면에서는 mock API를 직접 조합하지 않고, `src/lib/charts/dailyChartRows.ts`의 `buildDailyChartRows`에서 데이터를 테이블용 row로 변환합니다.

DailyChartSetupPage
  -> buildDailyChartRows
    -> getDailyChart
    -> getSongInfo
    -> getSongStats
    -> getAlbumInfo
  -> DailyChartTableRow[]

Zustand store에는 선택 날짜, 선택 차트, 페이지 같은 화면 상태만 저장했습니다. API 응답과 계산 결과는 store에 넣지 않고 유틸리티 레이어에서 처리했습니다.



## 기술 질문 응답

### Q1. `/api/song/stats` 배열 응답을 어떻게 가공했는가?

`getSongStats` 응답은 곡, 플랫폼, 날짜 기준의 배열 데이터입니다. `normalizeSongStats`에서 이 배열을 `songId` 기준 `Map`으로 변환했습니다.

- 플랫폼별 재생수와 댓글 수를 곡별로 묶습니다.
- 멜론, 지니, 유튜브 뮤직, 스포티파이 재생수를 합산합니다.
- 댓글 수를 합산합니다.
- 총 재생수와 댓글 수로 engagement 값을 계산합니다.
- 전일 데이터와 비교해 재생수 증감량과 증감률을 계산합니다.

이 로직은 컴포넌트나 store가 아니라 `src/lib/charts/dailyChartRows.ts`에 배치했습니다. 화면 컴포넌트는 렌더링에 집중하고, store는 화면 상태만 관리하도록 분리하기 위해서입니다.


### Q2. 실제 API 호출로 교체할 때 변경 범위는?

가장 먼저 바꿀 파일은 `src/lib/api/mockApi.ts`입니다. 현재 함수 시그니처를 유지한 상태에서 내부 mock 생성 로직만 실제 `fetch` 호출로 교체하면 됩니다.

- `getDailyChart`: 일간 차트 순위 API 호출
- `getSongInfo`: 곡 정보 API 호출
- `getAlbumInfo`: 앨범 정보 API 호출
- `getSongStats`: 곡 통계 API 호출

실제 응답 필드가 현재 타입과 다르면 `src/lib/api/types.ts`를 수정하고, 필요한 경우 `src/lib/charts/dailyChartRows.ts`의 변환 로직을 조정합니다. 화면 컴포넌트인 `DailyChartSetupPage`는 에러 메시지나 재시도 UI를 추가하는 정도의 변경만 필요하도록 설계했습니다.


### Q3. Dumbbell 차트 구현 방식과 성능 고려 사항은?

Dumbbell 차트는 `src/components/charts/DumbbellPreview.tsx`에서 SVG로 직접 구현했습니다. 행마다 작은 차트를 반복 렌더링해야 해서, 범용 차트 라이브러리를 여러 번 생성하는 것보다 SVG 요소를 직접 그리는 방식이 더 단순하고 가볍다고 판단했습니다.

- 선택 차트는 최대 3개까지 표시합니다.
- 각 차트의 최대 순위를 기준으로 x 좌표를 계산합니다.
- `line`, `circle`, `path` 같은 SVG 기본 요소만 사용합니다.
- 100행이 표시되어도 각 행의 렌더링 요소가 적어 부담을 줄일 수 있습니다.


### Q4. AI 코드 생성 도구 사용과 검증 방식은?

AI 코드 생성 도구는 요구사항 정리, UI 코드 초안 작성, 문서 초안 작성에 보조적으로 사용했습니다. 생성된 코드는 그대로 사용하지 않고 직접 수정했습니다.

검증은 다음 방식으로 진행했습니다.

- API 타입과 화면 row 타입이 맞는지 확인했습니다.
- 순위 변화량, 재생수 합산, engagement 계산 로직을 직접 검토했습니다.
- Figma 요구사항에 맞게 레이아웃과 스타일을 조정했습니다.
- `npm run typecheck`, `npm run lint`, `npm run build`로 타입, 린트, 빌드 가능 여부를 확인했습니다.




## 개선 사항

- Dumbbell 차트의 색상과 점이 의미하는 순위를 사용자가 더 직관적으로 파악할 수 있도록 개선.
- 날짜 선택 UI를 date picker로 개선.
