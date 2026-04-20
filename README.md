# 🍓 Agro-Knowledge Gaming Assistant (Strawberry Simulator)

농업 지식 게이밍 어시스턴트는 예비 농업인과 학생들이 실제 딸기 재배 과정에서 겪을 수 있는 다양한 환경적 제약과 식물 생육 알고리즘을 모의(Simulation)해 볼 수 있는 **교육용 웹 시뮬레이터 MVP**입니다. 

사용자는 매일 제공되는 기상 요건을 파악하고 *관수, 난방, 환기, 채광* 등의 액션을 취하며 가장 안전하고 높은 수익성을 가진 딸기를 수확하기 위해 고민해야 합니다.

## 🚀 Live Demo
- [🍓 Play Strawberry Simulator](https://straw-proto-2026.web.app/)

---

## ✨ 핵심 기능 (Key Features)

- **정교한 생육 엔진 (Simulation Engine) :**
  기본적인 작물의 하드코딩된 상태가 아니라 전날의 상태 데이터(이전 성장치)와 유저의 오늘 액션을 조합하여 성장률, 병해충 전염도, 피로도 등을 동적으로 계산합니다.
  *(예: 기온이 높을 때 환기가 없으면 곰팡이병 발생 확률 급증)*
  
- **교육용 피드백 제공 (Pedagogical Feedback) :**
  잘못된 선택으로 인한 Game Over를 막기 위해 행동 결과의 인과 관계("왜 이렇게 되었는가?")를 친절한 자연어 피드백으로 생성해 보여줍니다.
  
- **세션 유지 기술 로직 (Persistence State) :**
  단순한 React View가 아니라 로컬 스토리지 기반의 `SessionContext`를 통해 유저가 14일간 연속적인 시나리오를 끊기지 않게 플레이할 수 있도록 관리합니다.

- **모던 UI 및 반응형 웹 디자인 :**
  휴대폰, 태블릿, 데스크탑 어디에서나 미려한 인터페이스를 유지하는 모바일 퍼스트(Mobile-first) 디자인과 유려한 결과 요약 그래프를 제공합니다.

---

## 🛠 기술 스택 (Tech Stack)

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide-React
- **Database (구축 예정):** Supabase (PostgreSQL)
- **Deployment & CI/CD:** Firebase Hosting, GitHub Actions

---

## 💻 로컬 실행 방법 (Quick Start)

본 프로젝트를 로컬로 가져와 개발 환경을 구축하려면 다음 절차를 따르세요.

1. **저장소 클론 및 패키지 설치**
   ```bash
   git clone https://github.com/Hyuk623/Agro-Knowledge-Gaming-Assistant-straw.git
   cd Agro-Knowledge-Gaming-Assistant-straw
   npm install
   ```

2. **환경 변수 세팅 (선택사항)**
   추후 Supabase DB 기능을 활성화하려면 `.env.local` 파일을 생성하여 아래 값을 넣어주세요. (현재 MVP는 로컬 스토리지를 이용하므로 생략 가능합니다.)
   ```bash
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

---

## 📖 문서 및 역사 (Documentation)

- 프로젝트가 설계되고 에러를 해결하며 만들어진 **전체 워크플로우 역사**가 궁금하시다면 루트 디렉토리에 있는 [`PROJECT_WORKFLOW_HISTORY.md`](./PROJECT_WORKFLOW_HISTORY.md)를 참고해 주시기 바랍니다.

## 📄 License
MIT License
