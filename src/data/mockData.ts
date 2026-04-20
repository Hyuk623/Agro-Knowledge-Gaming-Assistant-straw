import type { Scenario, ScenarioDay, QuizItem } from '../types';

export const MOCK_CROP = {
  id: "crop-1",
  name: "Strawberry",
  name_ko: "딸기",
  optimum_temp_day: 22,
  optimum_temp_night: 10,
  water_demand_category: "high"
};

export const MOCK_SCENARIO_TUTORIAL_1: Scenario = {
  id: "tutorial-1",
  crop_id: MOCK_CROP.id,
  title: "Tutorial 1: Irrigation Basics",
  title_ko: "튜토리얼 1: 기본 관수",
  description: "Learn to manage crop moisture levels.",
  description_ko: "작물의 수분 상태를 관리하는 방법을 배웁니다.",
  duration_days: 3,
  difficulty: "tutorial",
  learning_goal: "Understand drought vs waterlogging.",
  learning_goal_ko: "가뭄과 과습의 차이를 이해하세요.",
  allowed_controls: ['irrigation'],
  is_active: true,
  created_at: new Date().toISOString()
};

export const MOCK_SCENARIO_TUTORIAL_2: Scenario = {
  id: "tutorial-2",
  crop_id: MOCK_CROP.id,
  title: "Tutorial 2: Heating & Temperature",
  title_ko: "튜토리얼 2: 난방과 온도",
  description: "Manage moisture and temperature together.",
  description_ko: "수분과 온도를 함께 관리하세요.",
  duration_days: 3,
  difficulty: "tutorial",
  learning_goal: "Keep the roots from freezing.",
  learning_goal_ko: "뿌리가 동해를 입지 않도록 하세요.",
  allowed_controls: ['irrigation', 'heating'],
  is_active: true,
  created_at: new Date().toISOString()
};

export const MOCK_SCENARIO_TUTORIAL_3: Scenario = {
  id: "tutorial-3",
  crop_id: MOCK_CROP.id,
  title: "Tutorial 3: Ventilation & Disease",
  title_ko: "튜토리얼 3: 환기와 질병",
  description: "Introduction to humidity and gray mold risk.",
  description_ko: "습도와 잿빛곰팡이병 위험에 대해 알아봅니다.",
  duration_days: 3,
  difficulty: "tutorial",
  learning_goal: "Use ventilation to reduce fungal growth.",
  learning_goal_ko: "환기를 통해 곰팡이 증식을 억제하세요.",
  allowed_controls: ['irrigation', 'heating', 'ventilation'],
  is_active: true,
  created_at: new Date().toISOString()
};

export const MOCK_SCENARIO_MAIN: Scenario = {
  id: "scenario-winter-1",
  crop_id: MOCK_CROP.id,
  title: "Winter Peak Output",
  title_ko: "겨울철 최대 수확",
  description: "Mid-winter greenhouse cultivation. High heating costs, low light, and persistent disease pressure.",
  description_ko: "한겨울 온실 재배입니다. 늘어나는 난방비, 부족한 채광, 그리고 지속적인 질병 압력을 견뎌내세요.",
  duration_days: 14,
  difficulty: "intermediate",
  allowed_controls: ['irrigation', 'heating', 'ventilation', 'lighting'],
  is_active: true,
  created_at: new Date().toISOString()
};

// Data for Day 1~14 in main
const mainDays: ScenarioDay[] = [
  {
    id: "sc-day-1",
    scenario_id: MOCK_SCENARIO_MAIN.id,
    day_number: 1,
    outside_temp_level: "low",
    sunlight_level: "normal",
    disease_pressure_level: "low",
    daily_objective_ko: "추운 날씨입니다. 작물이 얼지 않게 난방을 조절하세요.",
    daily_objective: "Cold night expected. Adjust heating to protect the crop."
  },
  {
    id: "sc-day-2",
    scenario_id: MOCK_SCENARIO_MAIN.id,
    day_number: 2,
    outside_temp_level: "low",
    sunlight_level: "low",
    disease_pressure_level: "normal",
    daily_objective_ko: "햇빛이 부족합니다. 보광 조명을 점검하세요.",
    daily_objective: "Low sunlight day. Ensure adequate lighting."
  },
  {
    id: "sc-day-3",
    scenario_id: MOCK_SCENARIO_MAIN.id,
    day_number: 3,
    outside_temp_level: "normal",
    sunlight_level: "low",
    disease_pressure_level: "high",
    daily_objective_ko: "습도가 높아질 위험이 큽니다. 환기를 고려하세요.",
    daily_objective: "High humidity risk. Consider applying ventilation.",
    event_card: {
      title: "Cloud Cover", title_ko: "짙은 구름",
      description: "A string of cloudy days is promoting fungal growth.",
      description_ko: "구름 낀 흐린 날씨가 지속되며 곰팡이 포자가 늘고 있습니다.",
      type: "weather"
    }
  },
  { id: "sc-day-4", scenario_id: MOCK_SCENARIO_MAIN.id, day_number: 4, outside_temp_level: "normal", sunlight_level: "normal", disease_pressure_level: "high" },
  { id: "sc-day-5", scenario_id: MOCK_SCENARIO_MAIN.id, day_number: 5, outside_temp_level: "high", sunlight_level: "high", disease_pressure_level: "normal" },
  { id: "sc-day-6", scenario_id: MOCK_SCENARIO_MAIN.id, day_number: 6, outside_temp_level: "high", sunlight_level: "normal", disease_pressure_level: "low" },
  {
    id: "sc-day-7",
    scenario_id: MOCK_SCENARIO_MAIN.id,
    day_number: 7,
    outside_temp_level: "low",
    sunlight_level: "high",
    disease_pressure_level: "normal",
    event_card: {
      title: "Sudden Cold Snap", title_ko: "갑작스런 한파",
      description: "Temperatures will drop sharply tonight.",
      description_ko: "오늘 밤 기온이 급격히 떨어집니다. 뿌리 보온이 필수입니다.",
      type: "weather"
    }
  },
  { id: "sc-day-8", scenario_id: MOCK_SCENARIO_MAIN.id, day_number: 8, outside_temp_level: "low", sunlight_level: "low", disease_pressure_level: "high" },
  { id: "sc-day-9", scenario_id: MOCK_SCENARIO_MAIN.id, day_number: 9, outside_temp_level: "normal", sunlight_level: "low", disease_pressure_level: "high" },
  { id: "sc-day-10", scenario_id: MOCK_SCENARIO_MAIN.id, day_number: 10, outside_temp_level: "normal", sunlight_level: "normal", disease_pressure_level: "normal" },
  {
    id: "sc-day-11",
    scenario_id: MOCK_SCENARIO_MAIN.id,
    day_number: 11,
    outside_temp_level: "low",
    sunlight_level: "normal",
    disease_pressure_level: "normal",
    event_card: {
      title: "Peak Flowering Phase",
      title_ko: "꽃 피는 시기",
      description: "Maintain optimal temperatures for the best fruit set.",
      description_ko: "열매를 맺는 중요한 시기입니다. 적정 온도를 반드시 유지하세요.",
      type: "growth"
    }
  },
  { id: "sc-day-12", scenario_id: MOCK_SCENARIO_MAIN.id, day_number: 12, outside_temp_level: "normal", sunlight_level: "high", disease_pressure_level: "normal" },
  { id: "sc-day-13", scenario_id: MOCK_SCENARIO_MAIN.id, day_number: 13, outside_temp_level: "low", sunlight_level: "normal", disease_pressure_level: "high" },
  { id: "sc-day-14", scenario_id: MOCK_SCENARIO_MAIN.id, day_number: 14, outside_temp_level: "normal", sunlight_level: "normal", disease_pressure_level: "low" }
];

export const MOCK_SCENARIOS = [
  MOCK_SCENARIO_TUTORIAL_1,
  MOCK_SCENARIO_TUTORIAL_2,
  MOCK_SCENARIO_TUTORIAL_3,
  MOCK_SCENARIO_MAIN
];

export const MOCK_SCENARIO_DAYS: ScenarioDay[] = [
  // Tut 1 Days
  { id: "t1-1", scenario_id: MOCK_SCENARIO_TUTORIAL_1.id, day_number: 1, outside_temp_level: "normal", sunlight_level: "normal", disease_pressure_level: "low", daily_objective_ko: "관수(물주기)를 '보통'으로 설정하세요.", daily_objective: "Set irrigation to 'normal'." },
  { id: "t1-2", scenario_id: MOCK_SCENARIO_TUTORIAL_1.id, day_number: 2, outside_temp_level: "high", sunlight_level: "high", disease_pressure_level: "low", daily_objective_ko: "더운 날입니다. 작물이 마를 수 있으니 관수를 늘려보세요.", daily_objective: "Hot day. Increase irrigation so the crop doesn't dry out." },
  { id: "t1-3", scenario_id: MOCK_SCENARIO_TUTORIAL_1.id, day_number: 3, outside_temp_level: "normal", sunlight_level: "normal", disease_pressure_level: "low", daily_objective_ko: "관수량을 판단하여 최종 결과를 확인하세요.", daily_objective: "Decide irrigation level to finish tutorial." },
  // Tut 2 Days
  { id: "t2-1", scenario_id: MOCK_SCENARIO_TUTORIAL_2.id, day_number: 1, outside_temp_level: "low", sunlight_level: "normal", disease_pressure_level: "low", daily_objective_ko: "날씨가 춥습니다. 난방(Heating)을 올려보세요.", daily_objective: "Cold weather. Turn up the heating." },
  { id: "t2-2", scenario_id: MOCK_SCENARIO_TUTORIAL_2.id, day_number: 2, outside_temp_level: "high", sunlight_level: "normal", disease_pressure_level: "low", daily_objective_ko: "더운 날입니다. 난방을 줄이지 않으면 에너지가 낭비됩니다.", daily_objective: "Hot weather. Lower heating to avoid energy waste." },
  { id: "t2-3", scenario_id: MOCK_SCENARIO_TUTORIAL_2.id, day_number: 3, outside_temp_level: "normal", sunlight_level: "normal", disease_pressure_level: "low" },
  // Tut 3 Days
  { id: "t3-1", scenario_id: MOCK_SCENARIO_TUTORIAL_3.id, day_number: 1, outside_temp_level: "normal", sunlight_level: "normal", disease_pressure_level: "high", daily_objective_ko: "질병(곰팡이) 위험이 높습니다. 환기(Ventilation)를 올려 온실 내부 습도를 날려버리세요.", daily_objective: "High disease risk. Maximize ventilation to flush humidity." },
  { id: "t3-2", scenario_id: MOCK_SCENARIO_TUTORIAL_3.id, day_number: 2, outside_temp_level: "low", sunlight_level: "normal", disease_pressure_level: "high", daily_objective_ko: "여전히 공기에 포자가 많지만, 동시에 추운 날씨입니다. 난방과 환기 사이에서 균형을 찾아야 합니다.", daily_objective: "Cold and high disease risk. Balance heating and ventilation trickily." },
  { id: "t3-3", scenario_id: MOCK_SCENARIO_TUTORIAL_3.id, day_number: 3, outside_temp_level: "normal", sunlight_level: "normal", disease_pressure_level: "normal" },
  // Main Days
  ...mainDays
];

export function getScenarioFlow(current_scenario_id?: string): Scenario {
  if (!current_scenario_id) return MOCK_SCENARIO_TUTORIAL_1;
  const idx = MOCK_SCENARIOS.findIndex(s => s.id === current_scenario_id);
  if (idx < 0 || idx === MOCK_SCENARIOS.length - 1) return MOCK_SCENARIO_MAIN; // Loop main or stay on main
  return MOCK_SCENARIOS[idx + 1];
}

export function getCurrentScenario(id: string): Scenario {
  return MOCK_SCENARIOS.find(s => s.id === id) || MOCK_SCENARIO_MAIN;
}

export const MOCK_QUIZ_ITEMS: QuizItem[] = [
  {
    id: "quiz-sd-1",
    scenario_id: MOCK_SCENARIO_MAIN.id,
    question: "White powdery spots have appeared on both sides of the strawberry leaves. The leaf edges are curling upward. What disease is this?",
    question_ko: "딸기 잎 양면에 하얀 가루 반점이 생겼고, 잎 가장자리가 위로 말려 올라갑니다. 무슨 병일까요?",
    image_url: "https://images.unsplash.com/photo-1594917416327-0cf70de5dc03?auto=format&fit=crop&q=80&w=600",
    type: "multiple_choice",
    options: ["Botrytis (Gray Mold)", "Powdery Mildew", "Anthracnose", "Fusarium Wilt"],
    options_ko: ["잿빛곰팡이병", "흰가루병", "탄저병", "시들음병"],
    correct_index: 1,
    explanation: "Powdery mildew typically presents as white powdery patches on leaves and causes upward leaf curling. It thrives in high humidity and poor ventilation.",
    explanation_ko: "흰가루병은 잎에 하얀 분말 형태의 패치를 형성하고 잎을 말려 올라가게 합니다. 높은 습도와 불량한 환기로 인해 발생합니다.",
    difficulty: "easy",
    tags: ["disease", "leaves", "mildew"],
    created_at: new Date().toISOString(),
  },
  {
    id: "quiz-sd-2",
    scenario_id: MOCK_SCENARIO_MAIN.id,
    question: "You notice a fuzzy gray mold spreading rapidly on ripe strawberries, especially in dense fruit clusters after a heavy watering. What is the cause?",
    question_ko: "물을 많이 준 뒤 촘촘하게 열린 딸기 열매에 북슬북슬한 회색 곰팡이가 빠르게 퍼지고 있습니다. 원인은 무엇일까요?",
    image_url: "https://images.unsplash.com/photo-1518174543597-2bb6da417277?auto=format&fit=crop&q=80&w=600",
    type: "multiple_choice",
    options: ["Botrytis (Gray Mold)", "Powdery Mildew", "Spider Mites", "Root Rot"],
    options_ko: ["잿빛곰팡이병", "흰가루병", "응애", "뿌리썩음병"],
    correct_index: 0,
    explanation: "Botrytis cinerea, or Gray Mold, is the most common pre- and post-harvest disease, flourishing in excessive moisture and cool temperatures.",
    explanation_ko: "보트리티스(잿빛곰팡이병)는 수확 전후로 가장 흔한 질병으로, 과도한 습기와 서늘한 온도에서 번성합니다.",
    difficulty: "easy",
    tags: ["disease", "fruit", "botrytis"],
    created_at: new Date().toISOString(),
  },
  {
    id: "quiz-sd-3",
    scenario_id: MOCK_SCENARIO_MAIN.id,
    question: "Fine webbing is visible on the underside of the leaves, and the foliage looks stippled (tiny yellow dots). What pest is likely responsible?",
    question_ko: "잎 뒷면에 미세한 거미줄이 보이고 잎에 수많은 노란점 무늬가 나타납니다. 어떤 해충일까요?",
    image_url: "https://images.unsplash.com/photo-1445445290350-18a3b86e0b5b?auto=format&fit=crop&q=80&w=600",
    type: "multiple_choice",
    options: ["Thrips", "Aphids", "Two-Spotted Spider Mites", "Whiteflies"],
    options_ko: ["총채벌레", "진딧물", "점박이응애", "가루이"],
    correct_index: 2,
    explanation: "Two-spotted spider mites cause stippled leaves and produce fine silk webs. They thrive in hot, dry conditions.",
    explanation_ko: "점박이응애는 잎에 황색 반점을 만들고 미세한 실을 칩니다. 고온 건조한 조건에서 잘 번식합니다.",
    difficulty: "medium",
    tags: ["pest", "leaves", "mites"],
    created_at: new Date().toISOString(),
  },
  {
    id: "quiz-sd-4",
    scenario_id: MOCK_SCENARIO_MAIN.id,
    question: "Dark, sunken, water-soaked lesions appear on the strawberry runners and fruit. The fruit eventually becomes covered in salmon-pink spore masses. What is the diagnosis?",
    question_ko: "런너와 열매에 검고 움푹 패인 수침상 병반이 나타나더니, 열매가 점차 연어색(분홍빛) 포자로 덮이기 시작했습니다. 병명은?",
    image_url: "https://images.unsplash.com/photo-1543158054-ff101a03a73c?auto=format&fit=crop&q=80&w=600",
    type: "multiple_choice",
    options: ["Angular Leaf Spot", "Verticillium Wilt", "Anthracnose", "Phytophthora Crown Rot"],
    options_ko: ["세균성점무늬병", "버티실리움 시들음병", "탄저병", "역병"],
    correct_index: 2,
    explanation: "Anthracnose causes very characteristic dark sunken lesions and salmon-pink spores, devastating crowns, runners, and fruit in warm, wet weather.",
    explanation_ko: "탄저병은 움푹 패인 검은 병반과 연어색 포자를 발생시키며, 따뜻하고 습한 날씨에 치명적입니다.",
    difficulty: "hard",
    tags: ["disease", "crown", "fruit", "anthracnose"],
    created_at: new Date().toISOString(),
  },
  {
    id: "quiz-sd-5",
    scenario_id: MOCK_SCENARIO_MAIN.id,
    question: "The newer leaves are distorted, stunted, and tinged with yellow. You also notice a sticky residue (honeydew) and some black sooty mold on the lower leaves.",
    question_ko: "새잎이 기형적으로 꼬이고 누렇게 변했습니다. 아래쪽 잎에서는 끈적한 배설물(감로)과 검은 그을음음음이 보입니다. 원인은?",
    image_url: "https://images.unsplash.com/photo-1550828555-46fd6cf4971c?auto=format&fit=crop&q=80&w=600",
    type: "multiple_choice",
    options: ["Strawberry Aphids", "Leafrollers", "Tarnished Plant Bug", "Slugs"],
    options_ko: ["딸기 진딧물", "잎말이나방", "노린재", "민달팽이"],
    correct_index: 0,
    explanation: "Aphids suck plant sap causing distortion, and excrete honeydew which leads to sooty mold. They also transmit harmful strawberry viruses.",
    explanation_ko: "진딧물은 수액을 빨아 생장을 억제시키고 감로를 배설해 그을음병을 유발합니다. 또한 식물 바이러스를 매개합니다.",
    difficulty: "medium",
    tags: ["pest", "viruses", "aphids"],
    created_at: new Date().toISOString(),
  },
  {
    id: "quiz-sd-6",
    scenario_id: MOCK_SCENARIO_MAIN.id,
    question: "Plants in low-lying, wet areas of the field suddenly collapse in late spring. Upon digging them up, the inner core of the roots (stele) is reddish-brown instead of white.",
    question_ko: "배수가 불량한 습한 구역의 작물들이 갑자기 시들어 고사했습니다. 파보니 뿌리의 중심 부위(무심총)가 하얗지 않고 붉은 갈색을 띕니다.",
    image_url: "https://images.unsplash.com/photo-1590680625345-42eff0a6b72a?auto=format&fit=crop&q=80&w=600",
    type: "multiple_choice",
    options: ["Red Stele Root Rot", "Nematodes", "Drought Stress", "Fertilizer Burn"],
    options_ko: ["붉은뿌리썩음병 (역병)", "선충", "가뭄 스트레스", "비료 피해(과량)"],
    correct_index: 0,
    explanation: "Red Stele is caused by Phytophthora fragariae and is identifiable by the distinctive red center (stele) of the root. It requires heavy, waterlogged soils to spread.",
    explanation_ko: "붉은뿌리썩음병은 뿌리를 붉게 물들이며 물 빠짐이 나쁜 토양에서 물을 타고 퍼집니다.",
    difficulty: "hard",
    tags: ["disease", "roots"],
    created_at: new Date().toISOString(),
  },
  {
    id: "quiz-sd-7",
    scenario_id: MOCK_SCENARIO_MAIN.id,
    question: "The tips of the strawberry leaves are turning brown and crispy. The soil is dry, and the greenhouse has been exceptionally hot over the past week.",
    question_ko: "지난 일주일간 온실이 몹시 더웠고 흙이 건조했습니다. 딸기 잎의 가장자리가 갈색으로 타고 바삭해졌습니다.",
    image_url: "https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?auto=format&fit=crop&q=80&w=600",
    type: "multiple_choice",
    options: ["Calcium Deficiency", "Heat/Drought Stress", "Angular Leaf Spot", "Botrytis"],
    options_ko: ["칼슘 결핍", "고온/가뭄 스트레스", "세균성점무늬병", "잿빛곰팡이병"],
    correct_index: 1,
    explanation: "Crispy brown leaf tips (tipburn) along with dry soil and high temperatures are classic signs of drought and heat stress, not an infectious disease.",
    explanation_ko: "건조한 토양과 고온이 결합되어 나타나는 잎 가장자리 타율(팁번)은 병균이 아닌 전형적인 가뭄/고온 스트레스 증상입니다.",
    difficulty: "easy",
    tags: ["stress", "abiotic", "leaves"],
    created_at: new Date().toISOString(),
  },
  {
    id: "quiz-sd-8",
    scenario_id: MOCK_SCENARIO_MAIN.id,
    question: "Strawberries are developing hard, 'cat-faced' or severely deformed shapes. Instead of a conical berry, it looks shriveled at the tip with densely packed seeds.",
    question_ko: "원추형이 아니라 끝부분이 쭈그러지고 씨앗이 빽빽하게 뭉치며, 기형적이고 단단한 '기형과'가 발생하고 있습니다.",
    image_url: "https://images.unsplash.com/photo-1610819777174-88aa77df2728?auto=format&fit=crop&q=80&w=600",
    type: "multiple_choice",
    options: ["Poor Pollination / Lygus Bug Damage", "Over-fertilization", "Sunscald", "Root Rot"],
    options_ko: ["수정 불량 또는 노린재 피해", "비료 과다", "일소(일광화상)", "뿌리썩음병"],
    correct_index: 0,
    explanation: "Cat-facing or apical deformation is most often caused by incomplete pollination (due to poor weather or lack of bees) or feeding damage by the Lygus bug (Tarnished Plant Bug) during early flower development.",
    explanation_ko: "개화기 불완전한 수정(벌 부족)이나 노린재의 흡즙으로 인해 심각한 기형과가 발생합니다.",
    difficulty: "medium",
    tags: ["fruit", "deformation", "pest"],
    created_at: new Date().toISOString(),
  },
  {
    id: "quiz-sd-9",
    scenario_id: MOCK_SCENARIO_MAIN.id,
    question: "To prevent Botrytis (Gray Mold) in a winter greenhouse, which cultural action is the most effective?",
    question_ko: "겨울철 온실에서 잿빛곰팡이병 예방에 가장 효과적인 환경조절 방안은 무엇일까요?",
    image_url: "https://images.unsplash.com/photo-1592842065882-df77ccda2f50?auto=format&fit=crop&q=80&w=600",
    type: "multiple_choice",
    options: ["Increasing irrigation and lowering heating", "Increasing planting density to retain warmth", "Optimizing ventilation to reduce humidity", "Turning off the supplemental lighting completely"],
    options_ko: ["관수를 팍팍 늘리고 난방을 줄인다", "따뜻하게 체온을 유지하도록 밀식 재배한다", "적절한 환기를 통해 습도를 획기적으로 낮춘다", "보광(조명)을 영구적으로 끈다"],
    correct_index: 2,
    explanation: "Botrytis fungi require high humidity to infect living tissue. Lowering humidity through proper ventilation and air circulation is the primary cultural control method.",
    explanation_ko: "잿빛곰팡이병은 높은 습도가 핵심 감염 조건입니다. 과도한 물방울 맺힘을 차단하기 위한 적극적인 환기가 핵심 통제법입니다.",
    difficulty: "easy",
    tags: ["management", "ventilation"],
    created_at: new Date().toISOString(),
  },
  {
    id: "quiz-sd-10",
    scenario_id: MOCK_SCENARIO_MAIN.id,
    question: "What is the consequence of applying 'High Irrigation' when the 'Outside Temperature is Low' and 'Ventilation is Low'?",
    question_ko: "비닐하우스 밖이 춥고 환기도 하지 않는 날에 '관수 가득(물 많이 주기)'을 선택하면 어떤 일이 벌어질까요?",
    image_url: "https://images.unsplash.com/photo-1456154875099-9742a0b17163?auto=format&fit=crop&q=80&w=600",
    type: "multiple_choice",
    options: ["Rapid vegetative growth.", "Prolonged soil wetness increasing disease risk.", "Water easily drains out and has no effect.", "Photosynthesis automatically compensates."],
    options_ko: ["오히려 영양생장이 촉진된다.", "토양 수분이 마르지 않아 치명적인 질병 폭발로 이어진다.", "자연스레 배수되므로 큰 영향이 없다.", "딸기가 자체적으로 광합성하여 타격이 없다."],
    correct_index: 1,
    explanation: "In cool conditions with no ventilation, soil stays soggy and canopy humidity stays near 100%. This is the perfect environment for root rot and leaf blights.",
    explanation_ko: "추운 날 환기 없이 물을 많이 주면 결로현상이 심해지고 토양 과습으로 인해 뿌리가 썩거나 역병이 크게 번지게 됩니다.",
    difficulty: "medium",
    tags: ["management", "irrigation"],
    created_at: new Date().toISOString(),
  }
];
