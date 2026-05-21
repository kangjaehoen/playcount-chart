# Playcount Chart 작업 로그

## 현재 진행 상태

현재 프로젝트는 초기 세팅과 UI 뼈대를 지나, 과제 핵심인 mock API 기반 데이터 파이프라인까지 연결한 상태입니다.

실제 서버 API는 연결하지 않고, 과제 명세의 API 구조를 흉내 내는 mock 함수들을 기준으로 데이터를 생성하고 조합합니다.

## GitHub 확인

- GitHub 저장소: `https://github.com/kangjaehoen/playcount-chart`
- 저장소 공개 상태: Public 확인
- README 노출: 확인
- 과제 관련 내부 문서 미노출 확인:
  - `ASSIGNMENT_REQUIREMENTS.md`
  - `ASSIGNMENT_SUMMARY.md`
  - `PROJECT_10_DAY_PLAN.md`
  - `PROJECT_STRUCTURE.md`

위 4개 문서는 로컬에는 있지만 GitHub 원격 저장소에는 올라가지 않은 상태가 정상입니다.

## 이전까지 완료된 기반 작업

- Next.js App Router 기반 프로젝트 구성
- TypeScript 설정
- MUI Theme 설정
- Zustand 기반 화면 상태 store 구성
- 좌측 사이드바 레이아웃 구현
- `/charts/daily`, `/charts/weekly`, `/charts/monthly`, `/charts/quarterly` 라우트 구성
- 일간 차트 페이지 기본 UI 구현
  - 날짜 선택
  - 차트 선택 메뉴
  - 표시 방식 토글
  - 테이블 뼈대
  - 페이지네이션
  - 우하단 FAB
  - Skeleton UI 준비

## 이번에 구현한 작업

작업 목표는 `feat: implement mock chart data pipeline` 범위입니다.

### 1. Mock API 강화

수정 파일:

- `src/lib/api/mockApi.ts`

구현 내용:

- `getDailyChart`
  - 날짜, 차트 타입, seed 값을 기준으로 순위가 달라지는 mock 차트 데이터 생성
  - 차트별 최대 순위 반영
  - FAB 클릭 시 seed 변경으로 랜덤 데이터 갱신 가능

- `getSongInfo`
  - 곡 ID 목록을 받아 곡명, 아티스트, 앨범 ID, 발매일, MV 여부 반환

- `getAlbumInfo`
  - 앨범 ID 목록을 받아 앨범명, 앨범 타입, 회사 정보, 커버 이미지 반환
  - 외부 이미지 서버 의존을 줄이기 위해 data URI 기반 SVG 커버 생성

- `getSongStats`
  - 곡 ID, platform, 날짜를 기준으로 통계 배열 반환
  - `platform: "all"` 요청 시 6개 통계 플랫폼 데이터를 한 번에 반환
  - 재생수와 댓글수 플랫폼을 실제 API 응답처럼 분리

### 2. 타입 보강

수정 파일:

- `src/lib/api/types.ts`

추가한 주요 타입:

- `RankChange`
- `NormalizedSongStats`
- `ChartRankPoint`
- `DailyChartTableRow`

추가한 플랫폼 상수:

- `STATS_PLATFORMS`
- `PLAY_COUNT_PLATFORMS`
- `COMMENT_PLATFORMS`

## 3. 데이터 정규화 및 계산 유틸 추가

신규 파일:

- `src/lib/charts/dailyChartRows.ts`

구현 내용:

- stats 배열을 곡 ID 기준으로 정규화
- 총 재생수 계산
  - `melon_playcnt + genie_playcnt + ytmusic_playcnt + spotify_playcnt`
- 총 댓글수 계산
  - `melon_cmt + ytmusic_cmt`
- 인게이지먼트 계산
  - `총 재생수 / 총 댓글수`
- 전일 대비 재생수 증감량 계산
- 전일 대비 재생수 증감률 계산
- 전일 차트와 비교한 순위 변화량 계산
  - 신규 진입: `NEW`
  - 상승: `▲`
  - 하락: `▼`
  - 동일: `-`
- 선택된 차트별 순위 정보를 Dumbbell 차트용 point 데이터로 변환
- 지니와 멜론 플랫폼 순위 계산

## 4. 테이블에 실제 mock 데이터 연결

수정 파일:

- `src/features/charts/DailyChartSetupPage.tsx`

변경 내용:

- 기존 하드코딩 데이터인 `previewRows` 제거
- `buildDailyChartRows`를 통해 생성된 row 데이터 렌더링
- 날짜 변경, 차트 선택 변경, FAB 클릭 시 데이터 재생성
- 로딩 중 Skeleton row 표시
- 페이지네이션을 실제 row 개수 기준으로 동작하도록 변경
- 재생수 표시 토글 구현
  - `전체 숫자`: 총 재생수 표시
  - `증감량 기준`: 전일 대비 증감량 표시
- 인게이지먼트와 댓글 수 표시
- G / M 플랫폼 순위 표시
- 곡 정보 영역에 앨범 커버, 곡명, 아티스트, 발매일, 앨범 타입, MV 여부 표시

## 5. Dumbbell 차트 개선

수정 파일:

- `src/components/charts/DumbbellPreview.tsx`

변경 내용:

- 단순 미리보기 점이 아니라 선택된 차트별 실제 순위 값을 반영
- 순위가 없는 차트는 흐린 점으로 표시
- SVG title로 차트명과 순위 확인 가능
- 차트별 색상 유지

## 검증 결과

실행한 검증:

```bash
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

결과:

- TypeScript 타입체크 통과
- ESLint 통과
- Next.js production build 통과
- `/charts/daily` 페이지 HTTP 200 응답 확인

추가 확인:

```bash
npx.cmd prettier --check src/components/charts/DumbbellPreview.tsx src/features/charts/DailyChartSetupPage.tsx src/lib/api/mockApi.ts src/lib/api/types.ts src/lib/charts/dailyChartRows.ts
```

결과:

- 이번 작업으로 수정한 파일들은 Prettier 포맷 체크 통과

참고:

- 전체 `npm.cmd run format:check`는 기존 파일인 `src/theme/theme.ts`, `tsconfig.json` 포맷 때문에 실패합니다.
- 이번 작업 범위의 기능 파일들은 포맷 문제가 없습니다.

## 현재 변경된 파일

- `src/lib/api/mockApi.ts`
- `src/lib/api/types.ts`
- `src/lib/charts/dailyChartRows.ts`
- `src/features/charts/DailyChartSetupPage.tsx`
- `src/components/charts/DumbbellPreview.tsx`

## 다음 추천 작업

다음 단계는 기능 완성도와 제출 준비를 높이는 작업입니다.

1. 화면 디테일 보정
2. 빈 상태와 에러 상태 UI 보강
3. Dumbbell 차트 시각적 완성도 개선
4. `TECHNICAL.md` 작성
5. README 최종 보강
6. Vercel 배포
7. GitHub Public 링크와 Vercel URL 제출 준비

## 추천 커밋 메시지

```bash
feat: implement mock chart data pipeline
```
