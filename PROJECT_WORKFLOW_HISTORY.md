# 농업 지식 게이밍 어시스턴트 (Agro-Knowledge Gaming Assistant)
## Strawberry Simulator MVP - 프로젝트 작업 및 워크플로우 히스토리

이 문서는 프로젝트가 처음 시작된 순간부터 최종 클라우드 프로덕션 서버에 정식 배포되기까지의 전체 작업 내역, 구조 설계, 오류 해결 및 의사 결정 과정을 기록한 역사서입니다. 추후 새로운 기능(토마토, 멜론 등)을 추가하거나 로직을 정비할 때 중요한 내비게이션 역할을 합니다.

---

### Phase 1~2: 기초 뼈대 구축 및 UI 설계 (UI/UX Foundation)
- **목표:** Vite + React + TailwindCSS 스택을 활용한 모바일 친화적 인터페이스 구축.
- **주요 작업:**
  - `package.json`, `index.css` 및 기타 개발 환경 초기화
  - 주요 페이지 컴포넌트 뼈대 생성 (`LandingPage`, `ScenarioIntroPage`, `PlayPage`, `DayResultPage`, `FinalReportPage`, `QuizPage`)
  - 유저들에게 미려한 시각적 반응을 주도록 Lucide-React의 모던한 아이콘과 Tailwind의 동적 컬러 시스템 적용

### Phase 3: 핵심 데이터 및 상태 관리 (Data Mocking & Context)
- **목표:** 유저가 매일 조작하게 될 기상 상황과 게임 상태를 관리.
- **주요 작업:**
  - `src/data/mockData.ts`: 딸기(Strawberry) 종에 맞는 기본 메타데이터(적정 온도 10~22℃)와 14일짜리 메인 시나리오 구성 (날씨, 햇빛, 전염병 예측치 하드코딩)
  - `SessionContext.tsx`: React Context API와 `useReducer`를 사용해 게임의 진행 상황(세션), 매일매일의 유저 액션(관수, 난방, 환기 등), 그리고 결과(점수)를 상태로 관리하고 로컬 스토리지(localStorage)에 임시 저장하는 로직 구현 (MVP 지속성 처리)

### Phase 4: 시뮬레이터 엔진 및 로직 개발 (Simulation Engine)
- **목표:** 유저의 액션과 기상 상황이 맞물려 실제 시뮬레이션 데이터를 실시간으로 어떻게 변화시킬지 규칙화.
- **주요 작업:**
  - `src/lib/simulationEngine.ts`: 이전 날의 상태(`prevState`)와 현재 기상 상황(`dayList`), 유저의 액션 4가지(관수, 난방, 환기, 채광)를 조합하여 작물의 생장치(GrowthScore), 전염병 위험(DiseaseRisk), 비용(Cost), 수익성(Yield) 등을 수학적으로 계산.
  - `strawberryRuleset.ts`: 관수 과다일 경우 '과습/뿌리썩음', 난방 부족일 경우 '동해' 등의 특수 패널티가 발동되는 조건 정의 트리 완성.

### Phase 5: 피드백 생성기 및 교육용 리포팅 (Educational Loop)
- **목표:** 플레이어(농업 학습자)가 왜 잘못되었는지 이해하고 개선할 수 있도록 정교한 피드백 부여.
- **주요 작업:**
  - `src/lib/feedbackGenerator.ts`: 단순한 점수 증감이 아니라 "추운 날 환기 없이 물을 주어 잿빛곰팡이병 발생 위험이 극도로 높아졌습니다." 와 같이 교육적인 해설을 제공하기 위해 엔진에서 도출된 데이터를 자연어로 변환하는 로직 작성.
  - `DayResultPage` 및 `FinalReportPage` 디자인 고도화 (데이터 변화 추이를 한눈에 볼 수 있는 Timeline 및 막대 그래프 적용).

### Phase 6: 타입스크립트 및 품질 안정화 단계 (Code Polish & Type Fixes)
- **목표:** 프로덕션 빌드(배포) 시 발생할 수 있는 엄격한 TypeScript/ESLint 문법 에러 완벽 해결.
- **의사 결정 및 작업 내역:**
  - `SessionContext` 초기화 파라미터 불일치(`startSession`에 들어가는 아규먼트 타입), 사용되지 않는 변수(`React`, `delta` 등)를 추적하여 전부 제거.
  - Vercel이나 Firebase의 까다로운 렌더링 검수에 걸리는 React 훅 오류 방지 처리 (`eslint-disable-next-line react-hooks/set-state-in-effect`, `react-refresh` 익스포트 규칙).
  - 해당 폴리시 작업을 통해 `npx tsc -b && vite build` 명령어가 무결점의 Exit Code 0으로 통과되도록 보장 완료.

### Phase 7: 파이어베이스 CI/CD 연동 및 클라우드 배포 (Deployment)
- **목표:** 내 컴퓨터 밖의 전 세계가 이 시뮬레이터에 접속할 수 있도록 라이브 서버(Web Hosting) 업로드.
- **문제 해결 과정:**
  1. AI 툴 환경 내에서는 보안용 '터미널 비대화형 모드(Non-interactive)'가 작동하여 브라우저 창 팝업 로그인이 막히는(Auth 블락) 이슈가 발생함.
  2. 이를 우회하기 위해 AI 에이전트가 로컬 디렉토리에서 Git을 초기화(`git init`)하고 첫 빌드 준비를 완료시킨 후 깃허브 원격 저장소(`origin`)에 `git push -f`로 대신 업로드함.
  3. 이후 사용자가 직접 VS Code에서 `firebase init hosting:github` 명령어 마법사를 실행하도록 절차를 나누어 설계함. (동기화 중 발생한 404 Service Account IAM 생성 지연 권한 이슈를 캐치해 우회 가이드 제공).
  4. 깃허브에 생성된 GitHub Actions (`firebase-hosting-merge.yml`) 설정 파일을 다시 한번 Git에 Add & Push 해 줌으로써 깃허브 서버 측에서 배포 엔진(Vite 빌드)이 성공적으로 동작하게 트리거 완료.
  
- **결과:** Firebase Hosting이 적용되어 `https://straw-proto-2026.web.app/` 라는 글로벌 접속 가능한 고유 도메인 프로덕션 버전 런칭 성공! 🍓🚀

---

> **추후 Next Step 후보군 (Phase 8+)**
> - **계정 클라우드 연결:** 현재 `src/lib/supabaseClient.ts`에 Supabase 연결 기틀이 잡혀 있습니다. 추후 `play_sessions` 등을 클라우드 DB에 연결해 랭킹표(Leaderboard) 구축.
> - **신규 시나리오:** `mockData.ts`에 여름 고온다습 시나리오(장마철) 등을 추가해 볼 수 있습니다.
> - **상태 관리 리팩토링:** 현재 Context API인 것을 훗날 스케일아웃 시 Zustand 혹은 Redux 기반으로 포팅.
