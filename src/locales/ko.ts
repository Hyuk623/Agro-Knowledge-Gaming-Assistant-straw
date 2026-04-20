export default {
  common: {
    backToHome: "홈으로 돌아가기",
    startOver: "처음부터 다시하기",
    submit: "결정하기",
    next: "다음",
    playAgain: "다시 플레이",
    day: "{{day}}일차",
    score: "점수",
    level: {
      low: "낮음",
      normal: "보통",
      high: "높음",
      off: "꺼짐",
      auto: "자동",
      on: "켜짐"
    }
  },
  landing: {
    badge: "농업 지식 게이밍 MVP · 딸기 에디션",
    title: "딸기",
    subtitle: "온실 재배 시뮬레이터",
    description: "14일간의 겨울 온실 재배를 완수하세요. 매일 현명한 결정을 내려 완벽한 딸기를 재배하세요.",
    stats: {
      days: "14일 시나리오",
      scenario: "겨울철 환경",
      score: "점수 및 랭크"
    },
    actions: {
      resume: "{{day}}일차 이어서 하기",
      viewReport: "최종 보고서 보기",
      startNew: "재배 시작하기",
      quiz: "딸기 병해충 퀴즈 도전",
      guestMode: "회원가입 필요 없음 · 진행 상황 자동 저장",
      difficulty: "{{difficulty}} 난이도"
    }
  },
  quiz: {
    title: "딸기 병해충",
    subtitle: "이미지 퀴즈",
    description: "겨울철 온실에서 흔히 발생하는 10가지 병해충 시나리오를 통해 지식을 테스트하세요.",
    start: "퀴즈 시작",
    retry: "다시 풀기",
    questionPos: "문제 {{current}} / {{total}}",
    correct: "정답입니다!",
    incorrect: "오답",
    nextQuestion: "다음 문제",
    viewResults: "결과 확인",
    completed: "퀴즈 완료!",
    excellent: "완벽한 진단 실력입니다! 🏆",
    good: "좋습니다! 계속해서 공부해보세요 🌱",
    needsPractice: "더 많은 연습이 필요해요 📚",
    accuracy: "총 {{percentage}}%의 시나리오를 정확히 진단했습니다."
  },
  advisor: {
    title: "AI 컨설턴트",
    highDisease: "오늘은 질병 압력이 매우 높습니다! 곰팡이성 포자는 공기가 정체될 때 빠르게 번식하므로, 환기에 각별히 신경 쓰세요.",
    coldDark: "밖이 매우 춥고 흐립니다. 온실 내부 온도를 정상적으로 유지하고 보광 시스템을 켜 광합성량을 확보해야 합니다.",
    cold: "기온이 크게 떨어졌습니다. 뿌리가 상하지 않도록 난방을 가동해야 하지만, 추운 날일수록 과도한 물주기(과습)는 피하세요.",
    hot: "외부 기온이 높습니다. 갑작스런 열 스트레스를 받을 수 있으니, 환기를 늘려 온실 내부 열기를 식혀주는 것이 좋습니다.",
    sunny: "일조량이 아주 좋은 날입니다! 작물이 빠르게 성장할 수 있으니 수분 스트레스가 생기지 않도록 관리해 주세요.",
    neutral: "오늘은 특별히 좋거나 나쁜 요인이 없는 무난한 한 주입니다. 현재의 안정적인 밸런스를 유지하세요.",
    tradeoff: {
      highIrrig: "💦 물을 많이 주면 가뭄을 예방하지만, 습도가 높아져 병해충 위험이 커질 수 있습니다.",
      lowIrrig: "🐪 물을 아끼면 과습을 막지만, 가뭄 스트레스를 유발할 수 있습니다.",
      highVent: "🌬 환기를 강하게 하면 습기를 날리지만, 추운 날에는 내부 온도까지 급격히 떨어질 수 있습니다.",
      lowVent: "🚪 환기를 줄이면 열을 보존하지만, 곰팡이 포자가 빠르게 증식할 수 있습니다.",
      highHeat: "🔥 난방을 강하게 하면 냉해를 막지만, 에너지 비용이 급증합니다.",
      lightOn: "💡 보광(조명)은 광합성을 돕지만 유지 비용이 발생합니다."
    }
  },
  play: {
    actionsTitle: "오늘의 작업 설정",
    submitDay: "결정 적용 및 결과 보기",
    irrigation: "관수 (물주기)",
    heating: "난방 (온도유지)",
    ventilation: "환기 (습도조절)",
    lighting: "보광 (빛추가)",
    healthSummary: "작물 건강 요약",
    currentStage: "현재 생육 단계",
    healthScore: "종합 건강도",
    stresses: "환경 스트레스 현황",
    waterStress: "수분 스트레스",
    tempStress: "온도 스트레스",
    diseaseRisk: "질병 발생 위험",
    dailyFeedback: "일일 피드백",
    pointsEarned: "+{{points}}점 획득",
    pointsLost: "{{points}}점 감점",
    nextDay: "다음 날로 이동",
    finish: "최종 보고서 보기",
    environment: "외부 환경 지표",
    objective: "오늘의 학습 목표",
    hintsTitle: "기대 효과 및 주의점",
    eventTitle: "돌발 이벤트 발생!",
    eventConfirm: "확인했습니다",
    resultWhat: "오늘 작물에 일어난 변화",
    resultWhy: "무엇이 원인이었을까요?",
    resultWhyDetail: "자세히 알아보기 (Why?)",
    resultTomorrow: "내일을 위한 조언",
    status: {
      stable: "안정적",
      caution: "주의 요망",
      risky: "위험"
    },
    conditions: {
      temp: "외부 온도",
      sun: "일조량",
      disease: "질병 압력"
    }
  },
  report: {
    title: "최종 보고서",
    subtitle: "14일 재배 챌린지 완료",
    compositeScore: "종합 점수",
    yield: "수확량",
    disease: "질병",
    cost: "비용",
    breakdown: "최종 상태 상세 분석",
    yieldPotential: "수확 잠재력",
    diseaseControl: "질병 통제력",
    growthScore: "생육 점수",
    lightScore: "일조량 점수",
    rootMoisture: "뿌리 수분량",
    costEfficiency: "비용 효율성",
    timeline: "건강도 변화 타임라인",
    bestDecisions: "🌟 최고의 결정들",
    biggestMistakes: "⚠ 가장 아쉬운 결정들",
    totalScore: "합산 점수",
    daysPlayed: "진행 일수",
    takeQuiz: "병해충 지식 퀴즈 풀기",
    grades: {
      S: "마스터 농부 🏆",
      A: "전문가 🥇",
      B: "숙련된 재배자 🥈",
      C: "견습생 🌱",
      F: "연습 필요 📚"
    },
    labels: {
      yield: {
        exc: "🍓 최고의 수확량",
        good: "🍓 좋은 수확량",
        avg: "🫐 평균 수확량",
        poor: "⚠ 수확량 부족",
        fail: "❌ 농사 실패"
      },
      cost: {
        v_eff: "💰 매우 효율적",
        eff: "✅ 무난함",
        over: "⚠ 예산 초과",
        costly: "❌ 비경제적"
      },
      disease: {
        ctrl: "✅ 완벽히 통제됨",
        mng: "🟡 관리 가능 수준",
        high: "🔴 심각한 위험",
        unctrl: "💀 통제 불능"
      }
    },
    retryTip: {
      default: "다음 플레이에서는 첫날에 다른 환경 조합을 시도하여 더 탄탄한 기반을 다져보세요.",
      disease: "다음 번엔 질병 압력이 치솟을 때 주저하지 말고 환기를 강하게 유지해 보세요.",
      cost: "다음 번엔 에너지 절감을 위해 온도가 덜 추운 날 난방을 적극적으로 한 단계 낮춰보세요.",
      growth: "다음 번엔 초기 식물 생장을 극대화하기 위해 온도와 물주기의 균형을 중점적으로 맞춰보세요.",
      title: "다음 도전을 위한 추천 전략"
    },
    badges: {
      disease_control: "🛡️ 감염 통제관",
      low_cost: "💰 효율의 달인",
      stable_streak: "🎯 강심장 (환경 유지)",
      yield_master: "🍓 풍요의 수확자",
      title: "획득한 배지"
    },
    compare: {
      title: "이전 플레이와 비교",
      better: "성장함",
      worse: "하락함",
      same: "유지"
    }
  },
  engine: {
    summary: {
      exc: "{{day}}일차: 훌륭한 관리 — 작물의 상태가 눈에 띄게 좋아졌습니다.",
      good: "{{day}}일차: 무난한 하루 — 전반적으로 상태가 조금씩 개선되었습니다.",
      mixed: "{{day}}일차: 엇갈린 결과 — 큰 손실도 이득도 없는 하루였습니다.",
      diff: "{{day}}일차: 힘든 하루 — 작물이 눈에 띄게 스트레스를 받았습니다.",
      crit: "{{day}}일차: 치명적인 타격 — 열악한 환경 요소들이 동시에 작물을 덮쳤습니다."
    },
    cause: {
      rootRot: "뿌리가 썩어가고 있습니다 — 토양이 심각하게 과습상태입니다. 관수를 당장 줄이세요.",
      drought: "뿌리가 극심한 가뭄 스트레스를 받고 있습니다. 영구적인 손상이 오기 전에 관수를 늘리세요.",
      sevDisease: "질병이 걷잡을 수 없는 수준입니다. 매일 심각한 수확량 손실이 발생하고 있습니다.",
      coldLowHeat: "추운 날 낮은 난방으로 인해 뿌리가 너무 차갑게 얼어붙은 것이 가장 큰 문제였습니다.",
      disLowVent: "질병 위험이 높은데 환기마저 부족해 감염 위험이 기하급수적으로 치솟았습니다.",
      wetStill: "관수량은 많은데 환기가 없어 곰팡이가 번식하기 완벽한 환경이 만들어졌습니다.",
      darkNoLight: "일조량이 부족한 날 보광마저 하지 않아 광합성이 심각하게 저해되었습니다.",
      hotHighHeat: "더운 날 난방을 너무 세게 틀었습니다 — 열 스트레스가 생장을 방해했습니다.",
      coldHighHeat: "추운 날씨에도 불구하고 난방을 충분히 가동하여 작물을 보호하고 성장을 촉진했습니다.",
      darkFullLight: "흐린 날씨를 훌륭하게 보완한 적절한 보광이 오늘 최고의 결정이었습니다.",
      disHighVent: "적극적인 환기를 통해 온실 내의 심각한 질병 요인들을 효과적으로 몰아냈습니다.",
      neutral: "오늘은 특별히 좋거나 나쁜 요인이 없이 평범하게 유지되었습니다.",
      biggestGain: "오늘 가장 많이 개선된 부분은 {{label}}입니다 (+{{val}}점).",
      biggestLoss: "오늘 가장 큰 손해를 본 부분은 {{label}}입니다 ({{val}}점).",
      labels: {
        growth: "작물 생육",
        disease: "질병 억제",
        moisture: "토양 수분",
        light: "빛 충분도",
        cost: "비용 효율"
      }
    },
    rec: {
      final: "마지막 일차가 끝났습니다 — 14일 챌린지를 완수하신 것을 축하합니다!",
      ventHigh: "내일의 팁: 환기를 '높음'으로 올리세요 — 질병 수치가 너무 높아 당장 떨어뜨려야 합니다.",
      irrigNormal: "내일의 팁: 관수를 '보통' 이상으로 늘리세요 — 뿌리가 심각하게 말라 있습니다.",
      irrigDownVentUp: "내일의 팁: 관수를 줄이고 환기를 늘려 물에 잠긴 토양을 빨리 말려야 합니다.",
      ventUp: "내일의 팁: 습도를 낮추고 질병 확산을 막기 위해 환기를 조금 더 늘려보세요.",
      lightOn: "내일의 팁: 채광 시스템을 확인하고, 일조량이 낮다면 보광을 '켜짐'으로 두세요.",
      checkHeat: "내일의 팁: 온도 관리에 실패하고 있습니다. 생육을 더 늦추지 않도록 난방 조절에 유의하세요.",
      reduceCost: "내일의 팁: 에너지를 너무 많이 쓰고 있습니다. 외부 온도가 적당할 때는 난방을 줄이거나 불필요한 보광을 끄세요.",
      stable: "내일의 팁: 현재의 균형을 유지하세요 — 비교적 안정적인 상태입니다."
    },
    status: {
      drought: "⚠ 가뭄 스트레스 — 관수량을 늘리세요.",
      waterlogger: "⚠ 과습 상태 — 뿌리 썩음을 주의하시고 관수를 줄이세요.",
      disCrit: "🍄 질병 위험이 치명적입니다 — 당장 환기를 시키세요.",
      disWarn: "⚡ 질병 압력이 높아지고 있습니다 — 환기에 유의하세요.",
      lightDef: "🌑 일조량 부족 — 보광(조명)을 켜주세요.",
      growthExc: "🌱 완벽한 생육 환경이 유지 중입니다!",
      healthy: "✅ 작물이 매우 건강합니다."
    },
    report: {
      notes: {
        lowHeat: "{{day}}일차: 추운 날 너무 낮은 난방 온도로 작물에 큰 스트레스를 주었습니다 ({{pts}}점).",
        wetSoil: "{{day}}일차: 높은 습도와 부족한 환기로 질병이 크게 확산되었습니다 ({{pts}}점).",
        noLight: "{{day}}일차: 어두운 날 조명을 켜지 않아 광합성량이 크게 떨어졌습니다 ({{pts}}점).",
        badGen: "{{day}}일차: 전반적으로 작물에 해로운 결정을 내렸습니다 ({{pts}}점).",
        highHeat: "{{day}}일차: 추운 날 적절하고 높은 수준의 난방으로 빙해를 막아냈습니다 (+{{pts}}점).",
        highVent: "{{day}}일차: 강력한 환기로 질병의 확산을 성공적으로 차단했습니다 (+{{pts}}점).",
        goodLight: "{{day}}일차: 과감한 보광 결정으로 어두운 날씨를 극복했습니다 (+{{pts}}점).",
        goodGen: "{{day}}일차: 환경에 대처하는 탁월한 결정들을 내렸습니다 (+{{pts}}점).",
        relay: "{{day}}일차: {{msg}}"
      },
      summary: {
        s1: {
          good: "14일간의 겨울 온실 챌린지를 매우 성공적으로 완수했습니다. 종합 점수는 {{score}}/100점 입니다.",
          ok: "무사히 14일 챌린지를 마쳤지만 아쉬운 부분도 있었습니다. 종합 점수는 {{score}}/100점 입니다.",
          bad: "작물들이 혹독한 환경에서 심각한 피해를 입었습니다. 종합 점수는 {{score}}/100점 입니다. 결과 분석 가이드를 깊게 읽어보세요."
        },
        s2: {
          disease: "질병 관리가 가장 취약했습니다 — 후반부의 과도한 질병 압력으로 인해 수확량이 크게 감소했습니다.",
          cost: "시뮬레이션 내내 너무 많은 유지보수 비용을 낭비했습니다 — 날씨에 맞춰 난방과 보광을 더 영리하게 조절해보세요.",
          yield: "일관되고 세심한 관리를 통해 무려 {{yield}}에 달하는 매우 훌륭한 수확 잠재력을 달성했습니다.",
          growth: "작물의 생육 속도가 매우 불규칙했습니다 — 온도와 수분 밸런스에 집중하는 것이 좋습니다."
        },
        s3: {
          win: "14일 동안 총 {{pts}}점의 심사 점수를 누적했습니다. 이제 딸기 병해충 퀴즈를 풀며 지식을 확장해보세요!",
          loss: "14일 동안 총 {{pts}}점의 큰 감점을 받았습니다. 실수 목록(Mistakes)을 면밀히 검토한 뒤 다시 도전해보세요!"
        }
      }
    }
  }
};
