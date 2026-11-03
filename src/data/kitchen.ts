export type IngredientId =
  | "tomato"
  | "egg"
  | "scallion"
  | "tofu"
  | "mushroom"
  | "rice"
  | "noodles"
  | "chicken"
  | "garlic"
  | "chili"
  | "basil"
  | "greens";

export type Ingredient = {
  id: IngredientId;
  en: string;
  name: string;
  note: string;
};

export const INGREDIENTS: Ingredient[] = [
  { id: "tomato", en: "Tomato", name: "番茄", note: "酸甜的底氣" },
  { id: "egg", en: "Egg", name: "雞蛋", note: "什麼都接得住" },
  { id: "scallion", en: "Scallion", name: "青蔥", note: "最後一把香" },
  { id: "tofu", en: "Tofu", name: "豆腐", note: "安靜吸滿味道" },
  { id: "mushroom", en: "Shiitake", name: "香菇", note: "山裡的鮮" },
  { id: "rice", en: "Rice", name: "白米飯", note: "隔夜的最好" },
  { id: "noodles", en: "Noodles", name: "麵條", note: "一口氣吸完" },
  { id: "chicken", en: "Chicken Thigh", name: "雞腿肉", note: "帶皮才夠味" },
  { id: "garlic", en: "Garlic", name: "蒜頭", note: "廚房的開場白" },
  { id: "chili", en: "Chili", name: "辣椒", note: "一點點脾氣" },
  { id: "basil", en: "Thai Basil", name: "九層塔", note: "起鍋前才放" },
  { id: "greens", en: "Bok Choy", name: "青江菜", note: "脆脆的良心" },
];

export const INGREDIENT_BY_ID = Object.fromEntries(
  INGREDIENTS.map((item) => [item.id, item]),
) as Record<IngredientId, Ingredient>;

export type GameStep =
  | { game: "chop"; ingredient: IngredientId; title: string; text: string }
  | { game: "stir"; title: string; text: string }
  | { game: "heat"; title: string; text: string }
  | { game: "pour"; liquid: string; title: string; text: string };

export type Recipe = {
  id: string;
  name: string;
  blurb: string;
  ingredients: IngredientId[];
  steps: GameStep[];
};

export const RECIPES: Recipe[] = [
  {
    id: "tomato-egg",
    name: "番茄炒蛋",
    blurb: "每個家都有自己的版本。酸甜裹著滑蛋，配什麼都對。",
    ingredients: ["tomato", "egg", "scallion"],
    steps: [
      { game: "chop", ingredient: "tomato", title: "切番茄", text: "切成大小差不多的滾刀塊，熟得才會一樣快。" },
      { game: "stir", title: "打蛋下鍋", text: "蛋液入鍋後順著畫圈，推出大片滑嫩的蛋。" },
      { game: "pour", liquid: "番茄醬汁", title: "下番茄與調味", text: "番茄炒到出汁，再補一點鹽和糖，加到刻度線。" },
      { game: "heat", title: "收汁起鍋", text: "蛋回鍋、撒蔥花，在最香的那一刻起鍋。" },
    ],
  },
  {
    id: "egg-rice",
    name: "蔥花蛋炒飯",
    blurb: "隔夜飯的第二人生。粒粒分明，是熱鍋給的勳章。",
    ingredients: ["rice", "egg", "scallion"],
    steps: [
      { game: "chop", ingredient: "scallion", title: "切蔥花", text: "蔥白先爆香，蔥綠留到最後。" },
      { game: "stir", title: "拌炒米飯", text: "蛋炒到半熟就下飯，大火翻拌，把結塊的飯撥散。" },
      { game: "pour", liquid: "醬油", title: "鍋邊嗆醬油", text: "沿著鍋邊淋一圈，讓醬油先燒出焦香。" },
      { game: "heat", title: "鑊氣起鍋", text: "撒上蔥綠，趁鍋氣最足時起鍋。" },
    ],
  },
  {
    id: "three-cup-chicken",
    name: "三杯雞",
    blurb: "麻油、米酒、醬油各一杯的台式記憶，九層塔一下，整條巷子都香。",
    ingredients: ["chicken", "basil", "garlic", "chili"],
    steps: [
      { game: "chop", ingredient: "chicken", title: "切雞腿塊", text: "順著關節下刀，切成一口大小。" },
      { game: "heat", title: "麻油煸香", text: "蒜與雞皮面朝下，煎到金黃就是時候。" },
      { game: "pour", liquid: "三杯醬汁", title: "下三杯", text: "麻油、米酒、醬油依序入鍋，加到刻度線。" },
      { game: "stir", title: "翻炒收汁", text: "持續翻動讓每塊雞都上色，最後拌入九層塔。" },
    ],
  },
  {
    id: "mapo-tofu",
    name: "麻婆豆腐",
    blurb: "嫩、燙、麻、辣。用湯匙吃，再多添一碗飯。",
    ingredients: ["tofu", "chili", "garlic", "scallion"],
    steps: [
      { game: "chop", ingredient: "tofu", title: "切豆腐", text: "切成方正小丁，下刀要輕。" },
      { game: "heat", title: "炒出紅油", text: "蒜、辣椒與豆瓣小火慢炒，油色轉紅就對了。" },
      { game: "pour", liquid: "高湯", title: "加湯燒豆腐", text: "倒入高湯到刻度線，豆腐滑入鍋裡。" },
      { game: "stir", title: "輕推勾芡", text: "用鍋鏟背輕輕推，別把豆腐弄碎了。" },
    ],
  },
  {
    id: "mushroom-chicken-soup",
    name: "香菇雞湯",
    blurb: "把一整個下午熬進碗裡，適合下雨天和想家的時候。",
    ingredients: ["chicken", "mushroom", "scallion"],
    steps: [
      { game: "chop", ingredient: "mushroom", title: "切香菇", text: "劃上十字花，香氣和湯都更容易滲進去。" },
      { game: "heat", title: "煎香雞肉", text: "雞肉先煎出油脂，湯才會有底味。" },
      { game: "pour", liquid: "清水", title: "加水慢燉", text: "加水蓋過食材，到刻度線就好。" },
      { game: "stir", title: "撇去浮沫", text: "小火慢慢攪，撈掉浮沫，湯色才清亮。" },
    ],
  },
  {
    id: "tomato-egg-noodles",
    name: "番茄雞蛋麵",
    blurb: "深夜的溫柔。一鍋裡有湯、有麵，也有一點點青菜的良心。",
    ingredients: ["noodles", "tomato", "egg", "greens"],
    steps: [
      { game: "chop", ingredient: "tomato", title: "切番茄", text: "切小塊一點，才容易煮化成湯。" },
      { game: "heat", title: "炒出茄紅", text: "番茄炒到軟爛出紅油，湯色就成了。" },
      { game: "pour", liquid: "熱水", title: "加水煮麵", text: "倒入熱水到刻度線，水滾下麵。" },
      { game: "stir", title: "攪入蛋花", text: "蛋液繞圈淋下，輕輕攪成雲朵，再放青江菜。" },
    ],
  },
  {
    id: "garlic-chili-noodles",
    name: "蒜香辣椒麵",
    blurb: "冰箱快空時的救星。材料很少，香氣很大聲。",
    ingredients: ["noodles", "garlic", "chili", "basil"],
    steps: [
      { game: "chop", ingredient: "garlic", title: "切蒜片", text: "薄薄切片，才會均勻地變成金黃色。" },
      { game: "heat", title: "冷油煸蒜", text: "蒜片微金就關火，餘溫會把它帶到剛好。" },
      { game: "pour", liquid: "煮麵水", title: "加煮麵水", text: "一勺帶澱粉的煮麵水，是醬汁乳化的祕密。" },
      { game: "stir", title: "拌麵", text: "快速翻拌讓醬汁掛上麵條，撒九層塔。" },
    ],
  },
  {
    id: "mushroom-tofu-pot",
    name: "香菇豆腐煲",
    blurb: "砂鍋上桌還在冒泡，豆腐吸飽了香菇的鮮味。",
    ingredients: ["tofu", "mushroom", "garlic"],
    steps: [
      { game: "chop", ingredient: "mushroom", title: "切香菇", text: "切成厚片，留住嚼勁。" },
      { game: "heat", title: "煎豆腐", text: "兩面煎到金黃，燉煮時才不會散。" },
      { game: "pour", liquid: "醬汁", title: "淋上醬汁", text: "醬油、蠔油和一點水，加到刻度線。" },
      { game: "stir", title: "小火燜煮", text: "輕輕翻動，讓味道走進豆腐裡。" },
    ],
  },
  {
    id: "garlic-greens",
    name: "蒜炒青菜",
    blurb: "看起來最簡單，卻最考驗火候。快，才保得住那抹綠。",
    ingredients: ["greens", "garlic"],
    steps: [
      { game: "chop", ingredient: "greens", title: "切青江菜", text: "菜梗和菜葉分開，因為它們熟的速度不同。" },
      { game: "stir", title: "大火快炒", text: "蒜爆香後下菜梗，再下菜葉，手不要停。" },
      { game: "heat", title: "斷生起鍋", text: "顏色最亮的那一刻就起鍋。" },
    ],
  },
  {
    id: "chicken-greens-congee",
    name: "雞絲青菜粥",
    blurb: "把米煮到開花，是給累了的人最好的一句話。",
    ingredients: ["rice", "chicken", "greens"],
    steps: [
      { game: "chop", ingredient: "greens", title: "切青菜", text: "切細一點，最後才下鍋。" },
      { game: "pour", liquid: "高湯", title: "加高湯", text: "米飯加入高湯到刻度線，開小火。" },
      { game: "stir", title: "慢慢熬煮", text: "順著同一個方向攪，米粒才會慢慢開花。" },
      { game: "heat", title: "關火時機", text: "放入雞絲與青菜，滾一下就關火。" },
    ],
  },
];

export const MAX_PICK = Math.max(...RECIPES.map((recipe) => recipe.ingredients.length));

const isSubsetOf = (items: IngredientId[], recipe: Recipe) =>
  items.every((id) => recipe.ingredients.includes(id));

/** 只有加進去後還做得出某道菜的食材才能選，籃子裡永遠不會有多餘的東西。 */
export function canAdd(selected: IngredientId[], id: IngredientId) {
  return RECIPES.some((recipe) => isSubsetOf([...selected, id], recipe));
}

/** 籃子食材剛好湊齊的那道菜；還沒湊齊時回傳 undefined。 */
export function findRecipe(selected: IngredientId[]) {
  return RECIPES.find(
    (recipe) =>
      selected.length === recipe.ingredients.length && isSubsetOf(selected, recipe),
  );
}

/** 目前籃子還能走向哪些菜，以及各自還差哪些食材（差得少的排前面）。 */
export function completions(selected: IngredientId[]) {
  return RECIPES.filter((recipe) => isSubsetOf(selected, recipe))
    .map((recipe) => ({
      recipe,
      missing: recipe.ingredients.filter((id) => !selected.includes(id)),
    }))
    .sort((a, b) => a.missing.length - b.missing.length);
}

export function starsFor(average: number): 1 | 2 | 3 {
  if (average >= 0.85) return 3;
  if (average >= 0.55) return 2;
  return 1;
}

export const STAR_NOTES: Record<1 | 2 | 3, string> = {
  1: "有點手忙腳亂，但自己煮的飯，還是最香的。",
  2: "味道到位了。再熟練一點，就能端上週末的餐桌。",
  3: "火候、調味都剛剛好。今天的你，是這間廚房的主廚。",
};
