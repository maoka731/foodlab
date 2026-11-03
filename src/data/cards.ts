import type { IngredientId } from "@/data/kitchen";

/**
 * 料理營養卡的文案（Phase 1 草稿，待審）。
 * 「還缺什麼」由 groupsOf() 依實際食材計算，這裡只放需要人寫的部分。
 */
export type CardCopy = {
  highlights: { label: string; ingredientIds: IngredientId[]; note: string }[];
  /** 已涵蓋全部食物類別時的補充建議；缺類別時改用自動產生的提示。 */
  pairingTip: string;
  eatingOutTip: string;
  reviewStatus: "draft" | "reviewed";
};

export const CARD_COPY: Record<string, CardCopy> = {
  "tomato-egg": {
    highlights: [
      { label: "蛋白質", ingredientIds: ["egg"], note: "雞蛋是這盤的蛋白質主力。" },
      { label: "茄紅素", ingredientIds: ["tomato"], note: "番茄和油一起炒，茄紅素更好吸收。" },
    ],
    pairingTip: "想多點蔬菜，可以再配一份燙青菜。",
    eatingOutTip: "自助餐很常見。醬汁偏甜偏鹹時，不用整勺淋在飯上。",
    reviewStatus: "draft",
  },
  "egg-rice": {
    highlights: [
      { label: "碳水化合物", ingredientIds: ["rice"], note: "白飯是主要的能量來源。" },
      { label: "蛋白質", ingredientIds: ["egg"], note: "雞蛋補上一些蛋白質。" },
    ],
    pairingTip: "炒飯油量通常不小，同一餐其他菜可以選清爽一點的。",
    eatingOutTip: "點炒飯時加一碗蔬菜湯或燙青菜，蔬菜就補上了。",
    reviewStatus: "draft",
  },
  "three-cup-chicken": {
    highlights: [
      { label: "蛋白質", ingredientIds: ["chicken"], note: "雞腿肉提供大部分的蛋白質。" },
      { label: "辛香料", ingredientIds: ["basil", "garlic", "chili"], note: "九層塔、蒜和辣椒負責香氣，用量少，營養貢獻有限。" },
    ],
    pairingTip: "醬汁濃郁，配白飯和一盤炒青菜剛好。",
    eatingOutTip: "熱炒店的經典下飯菜，幾個人一起點，再加一道青菜分著吃。",
    reviewStatus: "draft",
  },
  "mapo-tofu": {
    highlights: [
      { label: "植物性蛋白", ingredientIds: ["tofu"], note: "豆腐是這道菜的蛋白質來源。" },
      { label: "辛香料", ingredientIds: ["chili", "garlic", "scallion"], note: "辣椒、蒜和蔥帶出香辣，用量不多。" },
    ],
    pairingTip: "本站版本沒有絞肉；配飯時再加一份蔬菜會更完整。",
    eatingOutTip: "醬汁很下飯，飯量容易不自覺變多，可以多點一道蔬菜。",
    reviewStatus: "draft",
  },
  "mushroom-chicken-soup": {
    highlights: [
      { label: "蛋白質", ingredientIds: ["chicken"], note: "雞肉讓這碗湯也能當蛋白質來源。" },
      { label: "膳食纖維", ingredientIds: ["mushroom"], note: "香菇帶來膳食纖維和鮮味。" },
    ],
    pairingTip: "再配一碗飯或麵，就是完整的一餐。",
    eatingOutTip: "雞湯常是便當店的附湯，記得湯裡的料也一起吃。",
    reviewStatus: "draft",
  },
  "tomato-egg-noodles": {
    highlights: [
      { label: "碳水化合物", ingredientIds: ["noodles"], note: "麵條是主要的能量來源。" },
      { label: "蛋白質", ingredientIds: ["egg"], note: "蛋花補上蛋白質。" },
      { label: "蔬菜", ingredientIds: ["tomato", "greens"], note: "番茄和青江菜讓這碗麵有了蔬菜。" },
    ],
    pairingTip: "主食、蛋白質、蔬菜都有了。想再豐富，可以加一塊豆腐。",
    eatingOutTip: "麵店點湯麵時，加一份燙青菜是很簡單的搭配。",
    reviewStatus: "draft",
  },
  "garlic-chili-noodles": {
    highlights: [
      { label: "碳水化合物", ingredientIds: ["noodles"], note: "麵條幾乎是這盤的全部份量。" },
      { label: "辛香料", ingredientIds: ["garlic", "chili", "basil"], note: "香氣很足，但營養貢獻有限。" },
    ],
    pairingTip: "配料很少，可以加一顆荷包蛋和一份沙拉或燙青菜。",
    eatingOutTip: "義大利麵店的蒜辣麵配料常偏少，可以加點雞肉或蛋，再點一份沙拉。",
    reviewStatus: "draft",
  },
  "mushroom-tofu-pot": {
    highlights: [
      { label: "植物性蛋白", ingredientIds: ["tofu"], note: "豆腐提供植物性蛋白。" },
      { label: "膳食纖維", ingredientIds: ["mushroom"], note: "香菇帶來膳食纖維和鮮味。" },
    ],
    pairingTip: "配一碗飯，主食就齊了。",
    eatingOutTip: "素食或想少吃肉的時候，豆腐煲是熱炒店不錯的選擇。",
    reviewStatus: "draft",
  },
  "garlic-greens": {
    highlights: [
      { label: "膳食纖維", ingredientIds: ["greens"], note: "青江菜是這盤的主角。" },
      { label: "辛香料", ingredientIds: ["garlic"], note: "蒜頭負責香氣。" },
    ],
    pairingTip: "它是很好的配角：搭一道蛋白質主菜和一碗飯。",
    eatingOutTip: "便當店或熱炒店都能點，蔬菜量不夠時加點一盤最快。",
    reviewStatus: "draft",
  },
  "chicken-greens-congee": {
    highlights: [
      { label: "碳水化合物", ingredientIds: ["rice"], note: "米粒熬開後是主要的能量來源。" },
      { label: "蛋白質", ingredientIds: ["chicken"], note: "雞絲補上蛋白質。" },
      { label: "蔬菜", ingredientIds: ["greens"], note: "青菜讓整碗更完整。" },
    ],
    pairingTip: "三類都有了。粥水分多，容易餓的話可以再加一顆蛋。",
    eatingOutTip: "清粥小菜店可以挑一道蛋或豆製品，再配一盤青菜。",
    reviewStatus: "draft",
  },
};
