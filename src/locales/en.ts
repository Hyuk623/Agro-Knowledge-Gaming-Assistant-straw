export default {
  common: {
    backToHome: "Back to Home",
    startOver: "Start Over",
    submit: "Submit",
    next: "Next",
    playAgain: "Play Again",
    day: "Day {{day}}",
    score: "Score",
    level: {
      low: "Low",
      normal: "Normal",
      high: "High",
      off: "Off",
      auto: "Auto",
      on: "On"
    }
  },
  landing: {
    badge: "Agro-Knowledge MVP · Strawberry Edition",
    title: "Strawberry",
    subtitle: "Greenhouse Simulator",
    description: "Master 14 days of winter greenhouse cultivation. Make smart daily decisions and grow the perfect strawberry crop.",
    stats: {
      days: "14 Days",
      scenario: "Winter Scenario",
      score: "Score & Grade"
    },
    actions: {
      resume: "Resume Day {{day}}",
      viewReport: "View Final Report",
      startNew: "Start Growing",
      quiz: "Disease Quiz Challenge",
      guestMode: "No sign-up required · Auto-saves locally",
      difficulty: "{{difficulty}} difficulty"
    }
  },
  quiz: {
    title: "Strawberry Disease",
    subtitle: "Visual Quiz",
    description: "Test your knowledge against 10 visual disease scenarios common in winter greenhouses.",
    start: "Start Quiz",
    retry: "Retry Quiz",
    questionPos: "Question {{current}} / {{total}}",
    correct: "Correct!",
    incorrect: "Incorrect",
    nextQuestion: "Next Question",
    viewResults: "View Results",
    completed: "Quiz Complete!",
    excellent: "Excellent Diagnostic Skills! 🏆",
    good: "Good Effort! Keep Studying 🌱",
    needsPractice: "Needs More Practice 📚",
    accuracy: "You accurately diagnosed {{percentage}}% of the field scenarios."
  },
  advisor: {
    title: "AI Consultant",
    highDisease: "Disease pressure is critically high today! Fungal spores thrive in stagnant air, so prioritize ventilation.",
    coldDark: "It's very cold and cloudy outside. Make sure to keep the greenhouse warm and turn on the lights to maintain photosynthesis.",
    cold: "The temperature has dropped. Adequate heating is required to avoid root freezing, but be careful with over-watering.",
    hot: "It's a hot day outside. High temperatures can stress the crop—consider increasing ventilation to cool it down.",
    sunny: "Great sunlight today! The crop will grow rapidly, just make sure moisture levels are sufficient.",
    neutral: "Conditions are fairly average today. Maintain a steady, balanced climate for optimal growth.",
    tradeoff: {
      highIrrig: "High irrigation improves moisture but may increase humidity and disease risk.",
      lowIrrig: "Low irrigation prevents waterlogging but risks drought stress.",
      highVent: "High ventilation removes humidity but can rapidly drop temperatures on cold days.",
      lowVent: "Low ventilation retains heat but allows fungal spores to multiply quickly.",
      highHeat: "High heating protects against cold but increases energy expenses.",
      lightOn: "Supplemental lighting boosts photosynthesis but increases energy costs."
    }
  },
  play: {
    actionsTitle: "Daily Actions",
    submitDay: "End Day & See Results",
    irrigation: "Irrigation",
    heating: "Heating",
    ventilation: "Ventilation",
    lighting: "Lighting",
    healthSummary: "Crop Health Overview",
    currentStage: "Growth Stage",
    healthScore: "Overall Health",
    stresses: "Environmental Stresses",
    waterStress: "Water Stress",
    tempStress: "Temp. Stress",
    diseaseRisk: "Disease Risk",
    dailyFeedback: "Daily Feedback",
    pointsEarned: "{{points}} pts earned",
    pointsLost: "{{points}} pts lost",
    nextDay: "Proceed to Next Day",
    finish: "View Final Report",
    environment: "Greenhouse Environment",
    objective: "Today's Objective",
    hintsTitle: "Trade-offs and Considerations",
    eventTitle: "Unexpected Event!",
    eventConfirm: "Got it",
    resultWhat: "What changed today",
    resultWhy: "Why it happened",
    resultWhyDetail: "Deep Dive (Why?)",
    resultTomorrow: "What to consider tomorrow",
    status: {
      stable: "Stable",
      caution: "Caution",
      risky: "Risky"
    },
    conditions: {
      temp: "Outside Temp",
      sun: "Sunlight",
      disease: "Disease Press."
    }
  },
  report: {
    title: "Final Report",
    subtitle: "14-Day Challenge Complete",
    compositeScore: "Composite score",
    yield: "Yield",
    disease: "Disease",
    cost: "Cost",
    breakdown: "Final State Breakdown",
    yieldPotential: "Yield Potential",
    diseaseControl: "Disease Control",
    growthScore: "Growth Score",
    lightScore: "Light Score",
    rootMoisture: "Root Moisture",
    costEfficiency: "Cost Efficiency",
    timeline: "Health Timeline",
    bestDecisions: "🌟 Best Decisions",
    biggestMistakes: "⚠ Biggest Mistakes",
    totalScore: "Total Score",
    daysPlayed: "Days Played",
    takeQuiz: "Take Knowledge Quiz",
    grades: {
      S: "Master Grower 🏆",
      A: "Expert Farmer 🥇",
      B: "Skilled Grower 🥈",
      C: "Apprentice 🌱",
      F: "Needs Practice 📚"
    },
    labels: {
      yield: {
        exc: "🍓 Excellent Yield",
        good: "🍓 Good Yield",
        avg: "🫐 Average Yield",
        poor: "⚠ Poor Yield",
        fail: "❌ Crop Failure"
      },
      cost: {
        v_eff: "💰 Very Efficient",
        eff: "✅ Efficient",
        over: "⚠ Over-Budget",
        costly: "❌ Costly"
      },
      disease: {
        ctrl: "✅ Fully Controlled",
        mng: "🟡 Manageable",
        high: "🔴 High Risk",
        unctrl: "💀 Uncontrolled"
      }
    },
    retryTip: {
      default: "Try experimenting with different action combinations on Day 1 to set a strong foundation.",
      disease: "For your next run, focus heavily on ventilation when disease pressure is high.",
      cost: "For your next run, try lowering heating and lighting selectively to save costs.",
      growth: "For your next run, maintain consistent heating and watering to boost early growth.",
      title: "Strategy for Next Play"
    },
    badges: {
      disease_control: "🛡️ Infection Control",
      low_cost: "💰 Resource Efficient",
      stable_streak: "🎯 Stable Environment",
      yield_master: "🍓 Bumper Harvest",
      title: "Badges Earned"
    },
    compare: {
      title: "Replay Comparison",
      better: "Improved",
      worse: "Declined",
      same: "Equal"
    }
  },
  engine: {
    summary: {
      exc: "Day {{day}}: Excellent management — crop conditions improved significantly.",
      good: "Day {{day}}: Good day, modest improvements across the board.",
      mixed: "Day {{day}}: Mixed results — no major gains or losses today.",
      diff: "Day {{day}}: Difficult day — crop experienced notable stress.",
      crit: "Day {{day}}: Critical setbacks — multiple stress factors hit at once."
    },
    cause: {
      rootRot: "Root rot is developing — soil is severely waterlogged. Cut irrigation immediately.",
      drought: "The roots are under drought stress. Increase irrigation before permanent damage occurs.",
      sevDisease: "Disease is at a critical level. This is causing direct yield losses every day.",
      coldLowHeat: "Low heating on a cold day was the main problem — roots stayed too cold.",
      disLowVent: "High disease pressure combined with low ventilation sharply raised infection risk.",
      wetStill: "High irrigation with no ventilation is creating a humid, fungus-friendly environment.",
      darkNoLight: "No supplemental lighting on a dark day severely limited photosynthesis.",
      hotHighHeat: "Heating was set too high for the warm day — heat stress reduced growth.",
      coldHighHeat: "High heating on a cold day kept the crop warm and supported strong growth.",
      darkFullLight: "Supplemental lighting on a cloudy day was the key positive action today.",
      disHighVent: "Strong ventilation actively pushed back against the high disease pressure.",
      neutral: "Today's conditions were largely neutral — no single factor dominated.",
      biggestGain: "{{label}} improved the most today (+{{val}} pts).",
      biggestLoss: "{{label}} was the biggest drag today ({{val}} pts).",
      labels: {
        growth: "Crop growth",
        disease: "Disease risk change",
        moisture: "Soil moisture",
        light: "Light score",
        cost: "Cost efficiency"
      }
    },
    rec: {
      final: "This is the final day — well done for completing the challenge!",
      ventHigh: "Tomorrow: raise ventilation to High — disease risk is critical and must come down.",
      irrigNormal: "Tomorrow: increase irrigation to at least Normal — roots are severely dry.",
      irrigDownVentUp: "Tomorrow: reduce irrigation and raise ventilation to dry out the soil.",
      ventUp: "Tomorrow: increase ventilation to reduce humidity and slow disease spread.",
      lightOn: "Tomorrow: turn supplemental lighting On if sunlight is low.",
      checkHeat: "Tomorrow: double-check heating and avoid any condition that adds further growth stress.",
      reduceCost: "Tomorrow: look for ways to reduce energy use — lighting efficiency or lower heating if warm.",
      stable: "Tomorrow: maintain your current balance — conditions are relatively stable."
    },
    status: {
      drought: "⚠ Drought stress — increase irrigation.",
      waterlogger: "⚠ Waterlogged roots — reduce irrigation.",
      disCrit: "🍄 Disease risk critical — improve ventilation.",
      disWarn: "⚡ Disease pressure building — monitor closely.",
      lightDef: "🌑 Light deficiency — use supplemental lighting.",
      growthExc: "🌱 Excellent growth conditions maintained!",
      healthy: "✅ Crop is healthy today."
    },
    report: {
      notes: {
        lowHeat: "Day {{day}}: Low heating on a cold day stressed the roots ({{pts}} pts).",
        wetSoil: "Day {{day}}: Wet soil + no ventilation created a disease spike ({{pts}} pts).",
        noLight: "Day {{day}}: No lighting on a dark day cut photosynthesis ({{pts}} pts).",
        badGen: "Day {{day}}: Poor decisions cost {{pts}} pts.",
        highHeat: "Day {{day}}: High heating on a cold day protected the crop (+{{pts}} pts).",
        highVent: "Day {{day}}: Strong ventilation fought off disease pressure (+{{pts}} pts).",
        goodLight: "Day {{day}}: Supplemental lighting saved a dark day (+{{pts}} pts).",
        goodGen: "Day {{day}}: Good decisions earned +{{pts}} pts.",
        relay: "Day {{day}}: {{msg}}"
      },
      summary: {
        s1: {
          good: "You successfully managed the 14-day winter greenhouse challenge with a composite score of {{score}}/100.",
          ok: "You completed the challenge with room to improve — composite score {{score}}/100.",
          bad: "The crop faced significant difficulties — composite score {{score}}/100. Review the tips and try again."
        },
        s2: {
          disease: "Disease control was the weakest area — high disease pressure eroded yield potential in the final days.",
          cost: "Energy costs ran high throughout the game — better lighting and heating management could improve efficiency.",
          yield: "Strong yield potential of {{yield}} was achieved through consistent crop management.",
          growth: "Growth was inconsistent — temperature and moisture management need more attention."
        },
        s3: {
          win: "You accumulated {{pts}} points across 14 days. Take the quiz to reinforce what you learned!",
          loss: "You lost {{pts}} points across 14 days. Study the mistake list and replay to improve!"
        }
      }
    }
  }
};
