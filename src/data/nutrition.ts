import { INGREDIENT_BY_ID } from "@/data/kitchen";
import type { IngredientId, Recipe } from "@/data/kitchen";

/** 每 100 公克的概略值：熱量 kcal，其餘單位為公克。 */
type Per100g = { kcal: number; carbs: number; protein: number; fat: number; fiber: number };

const INGREDIENT_NUTRITION: Record<IngredientId, Per100g & { fact: string }> = {
  tomato: { kcal: 18, carbs: 3.9, protein: 0.9, fat: 0.2, fiber: 1.2, fact: "含維生素 C 與茄紅素。茄紅素是脂溶性的，和油一起炒更好吸收。" },
  egg: { kcal: 143, carbs: 0.7, protein: 12.6, fat: 9.5, fiber: 0, fact: "優質完全蛋白，蛋黃還有膽鹼和維生素 D。" },
  scallion: { kcal: 32, carbs: 7.3, protein: 1.8, fat: 0.2, fiber: 2.6, fact: "用量不多，負責香氣，順便補一點維生素 K。" },
  tofu: { kcal: 76, carbs: 1.9, protein: 8.1, fat: 4.8, fiber: 0.3, fact: "植物性蛋白的好來源，用鈣鹽凝固的豆腐也含鈣。" },
  mushroom: { kcal: 34, carbs: 6.8, protein: 2.2, fat: 0.5, fiber: 2.5, fact: "低熱量，有膳食纖維與 B 群，鮮味來自天然的麩胺酸。" },
  rice: { kcal: 130, carbs: 28.2, protein: 2.7, fat: 0.3, fiber: 0.4, fact: "主要提供碳水化合物，是身體最直接的能量來源。" },
  noodles: { kcal: 138, carbs: 25.2, protein: 4.5, fat: 2.1, fiber: 1.2, fact: "碳水為主，小麥麵條也帶一些蛋白質。" },
  chicken: { kcal: 221, carbs: 0, protein: 17, fat: 16, fiber: 0, fact: "提供蛋白質與菸鹼酸；香氣和脂肪多半來自那層雞皮。" },
  garlic: { kcal: 149, carbs: 33, protein: 6.4, fat: 0.5, fiber: 2.1, fact: "切開後會產生蒜素，也就是那股強烈香氣的來源。" },
  chili: { kcal: 40, carbs: 8.8, protein: 1.9, fat: 0.4, fiber: 1.5, fact: "辣味來自辣椒素，新鮮辣椒的維生素 C 也不少。" },
  basil: { kcal: 23, carbs: 2.7, protein: 3.2, fat: 0.6, fiber: 1.6, fact: "含維生素 K 與多種香氣精油，久煮香氣會跑掉。" },
  greens: { kcal: 13, carbs: 2.2, protein: 1.5, fat: 0.2, fiber: 1, fact: "熱量很低，有維生素 A、C、K，還有一些鈣。" },
};

type PantryId = "oil" | "sesameOil" | "sugar" | "soy";

const PANTRY: Record<PantryId, Per100g & { name: string }> = {
  oil: { name: "食用油", kcal: 884, carbs: 0, protein: 0, fat: 100, fiber: 0 },
  sesameOil: { name: "麻油", kcal: 884, carbs: 0, protein: 0, fat: 100, fiber: 0 },
  sugar: { name: "砂糖", kcal: 387, carbs: 100, protein: 0, fat: 0, fiber: 0 },
  soy: { name: "醬油", kcal: 53, carbs: 4.9, protein: 8.1, fat: 0.6, fiber: 0.8 },
};

type Anatomy = {
  en: string;
  quip: string;
  /** 一人份用量（公克），順序即解剖圖由上而下的順序。 */
  amounts: Partial<Record<IngredientId, number>>;
  prep: Partial<Record<IngredientId, string>>;
  pantry: Partial<Record<PantryId, number>>;
};

const ANATOMY: Record<string, Anatomy> = {
  "tomato-egg": {
    en: "Stir-Fried Tomato & Egg",
    quip: "先放蛋還是先放番茄？這題足以拆散一個家庭，本實驗室不予置評。",
    amounts: { tomato: 150, egg: 100, scallion: 10 },
    prep: { tomato: "切滾刀塊", egg: "打散", scallion: "切蔥花" },
    pantry: { oil: 10, sugar: 5 },
  },
  "egg-rice": {
    en: "Scallion Egg Fried Rice",
    quip: "解剖發現：本體其實是昨天吃不完的白飯，只是它現在過得很好。",
    amounts: { rice: 200, egg: 50, scallion: 10 },
    prep: { rice: "撥散隔夜飯", egg: "打散", scallion: "蔥白蔥綠分開" },
    pantry: { oil: 10, soy: 5 },
  },
  "three-cup-chicken": {
    en: "Three-Cup Chicken",
    quip: "名字叫三杯，請不要真的倒三杯。胃會感謝你。",
    amounts: { chicken: 180, garlic: 10, chili: 5, basil: 10 },
    prep: { chicken: "切一口大小", garlic: "整粒拍扁", chili: "斜切片", basil: "摘葉備用" },
    pantry: { sesameOil: 15, soy: 15, sugar: 5 },
  },
  "mapo-tofu": {
    en: "Mapo Tofu",
    quip: "警告：本品會讓白飯以異常的速度消失。",
    amounts: { tofu: 200, garlic: 5, chili: 5, scallion: 5 },
    prep: { tofu: "切方丁", garlic: "切末", chili: "切碎", scallion: "切蔥花" },
    pantry: { oil: 10, soy: 8 },
  },
  "mushroom-chicken-soup": {
    en: "Shiitake Chicken Soup",
    quip: "主成分是雞、香菇，以及有人在等你回家吃飯的感覺。後者無法量測。",
    amounts: { chicken: 150, mushroom: 40, scallion: 5 },
    prep: { chicken: "切塊", mushroom: "劃十字花", scallion: "切段" },
    pantry: {},
  },
  "tomato-egg-noodles": {
    en: "Tomato Egg Noodle Soup",
    quip: "半夜十一點的良心成分：青江菜 50 公克。",
    amounts: { noodles: 200, tomato: 100, egg: 50, greens: 50 },
    prep: { noodles: "滾水下麵", tomato: "切小塊", egg: "打成蛋液", greens: "洗淨切段" },
    pantry: { oil: 5 },
  },
  "garlic-chili-noodles": {
    en: "Garlic Chili Noodles",
    quip: "配料表短到像是冰箱在求救，但香氣完全沒在客氣。",
    amounts: { noodles: 200, garlic: 15, chili: 5, basil: 5 },
    prep: { noodles: "煮到略帶咬勁", garlic: "切薄片", chili: "切圈", basil: "撕碎" },
    pantry: { oil: 15 },
  },
  "mushroom-tofu-pot": {
    en: "Shiitake Tofu Hot Pot",
    quip: "豆腐的人生哲學：自己沒什麼味道，但很會吸收別人的優點。",
    amounts: { tofu: 150, mushroom: 60, garlic: 5 },
    prep: { tofu: "切厚片", mushroom: "切片", garlic: "切末" },
    pantry: { oil: 10, soy: 10 },
  },
  "garlic-greens": {
    en: "Garlic Bok Choy",
    quip: "全實驗室最短的解剖報告。菜會扁，但絕不是因為你炒太久。應該吧。",
    amounts: { greens: 200, garlic: 8 },
    prep: { greens: "梗葉分開", garlic: "拍碎" },
    pantry: { oil: 8 },
  },
  "chicken-greens-congee": {
    en: "Chicken & Greens Congee",
    quip: "本品的主要功效，是讓人覺得今天其實沒有那麼糟。",
    amounts: { rice: 150, chicken: 60, greens: 40 },
    prep: { rice: "加湯熬開", chicken: "煮熟撕絲", greens: "切細" },
    pantry: {},
  },
};

const scale = (values: Per100g, grams: number): Per100g => ({
  kcal: (values.kcal * grams) / 100,
  carbs: (values.carbs * grams) / 100,
  protein: (values.protein * grams) / 100,
  fat: (values.fat * grams) / 100,
  fiber: (values.fiber * grams) / 100,
});

/** 三大營養素換算成熱量的佔比（碳水、蛋白質 4 kcal/g，脂肪 9 kcal/g）。 */
export function macroShares({ carbs, protein, fat }: Pick<Per100g, "carbs" | "protein" | "fat">) {
  const energy = { carbs: carbs * 4, protein: protein * 4, fat: fat * 9 };
  const total = energy.carbs + energy.protein + energy.fat || 1;
  return {
    carbs: energy.carbs / total,
    protein: energy.protein / total,
    fat: energy.fat / total,
  };
}

export function dissect(recipe: Recipe) {
  const anatomy = ANATOMY[recipe.id];
  const ingredients = (Object.entries(anatomy.amounts) as [IngredientId, number][]).map(([id, grams]) => ({
    ...INGREDIENT_BY_ID[id],
    grams,
    prep: anatomy.prep[id] ?? "",
    fact: INGREDIENT_NUTRITION[id].fact,
    nutrition: scale(INGREDIENT_NUTRITION[id], grams),
  }));
  const pantry = (Object.entries(anatomy.pantry) as [PantryId, number][]).map(([id, grams]) => ({
    name: PANTRY[id].name,
    grams,
    nutrition: scale(PANTRY[id], grams),
  }));
  const parts = [...ingredients, ...pantry];
  const sum = (key: keyof Per100g) => parts.reduce((total, part) => total + part.nutrition[key], 0);

  return {
    en: anatomy.en,
    quip: anatomy.quip,
    ingredients,
    pantry,
    grams: parts.reduce((total, part) => total + part.grams, 0),
    total: {
      kcal: sum("kcal"),
      carbs: sum("carbs"),
      protein: sum("protein"),
      fat: sum("fat"),
      fiber: sum("fiber"),
    },
  };
}
