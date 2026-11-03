import Link from "next/link";
import { DishArt, IngredientArt } from "@/components/illustrations";
import { Parallax } from "@/components/Parallax";
import { INGREDIENT_BY_ID, INGREDIENTS, RECIPES } from "@/data/kitchen";
import type { IngredientId } from "@/data/kitchen";

const HOW_TO = [
  { title: "挑食材", text: "從籃子裡選兩到五樣今天想吃的東西。" },
  { title: "配一道菜", text: "依你選的食材，找出做得出來的菜，和它的營養卡。" },
  { title: "玩一局，或直接看", text: "切、炒、調味、抓火候；趕時間也能跳過，直接看營養卡。" },
];

const HERO_INGREDIENTS: { id: IngredientId; className: string; speed: number; spin: number }[] = [
  { id: "tomato", className: "top-[2%] left-[4%] w-[26%] rotate-[-12deg]", speed: -0.28, spin: -0.02 },
  { id: "basil", className: "top-[0%] right-[12%] w-[22%] rotate-[14deg]", speed: -0.16, spin: 0.03 },
  { id: "garlic", className: "bottom-[6%] left-[0%] w-[22%] rotate-[8deg]", speed: 0.1, spin: -0.015 },
  { id: "chili", className: "right-[0%] bottom-[12%] w-[26%] rotate-[-6deg]", speed: -0.34, spin: 0.025 },
  { id: "egg", className: "bottom-[-3%] left-[42%] w-[18%] rotate-[18deg]", speed: 0.2, spin: 0.02 },
];

const INTERLUDE_INGREDIENTS: { id: IngredientId; className: string; speed: number; spin: number }[] = [
  { id: "mushroom", className: "top-[8%] left-[6%] w-20 sm:w-32", speed: 0.3, spin: 0.08 },
  { id: "scallion", className: "top-[12%] right-[8%] w-20 sm:w-32", speed: -0.25, spin: -0.06 },
  { id: "tofu", className: "bottom-[8%] left-[16%] w-16 sm:w-28", speed: -0.4, spin: 0.05 },
  { id: "greens", className: "right-[14%] bottom-[6%] w-20 sm:w-32", speed: 0.38, spin: -0.07 },
];

export default function Home() {
  const heroDish = RECIPES[0];

  return (
    <>
      <main id="top" className="flex-1 overflow-x-clip">
        <section className="overflow-clip border-b-2 border-ink">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:py-16">
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
              <Parallax fromTop speed={0.12} className="lg:shrink-0">
                <h1 className="hero-title text-5xl leading-[1.3] font-black sm:text-6xl lg:h-[26rem] lg:shrink-0 lg:text-[3.75rem]">
                <span className="block">今天，</span>
                <span className="block">想煮點什麼？</span>
              </h1>
              </Parallax>
              <div className="hidden w-px bg-ink lg:block" aria-hidden="true" />
              <Parallax fromTop speed={0.24} className="flex flex-col justify-end lg:shrink-0">
                <p className="font-latin text-xl text-terracotta italic">No. 01 — Autumn Issue</p>
                <p className="mt-4 text-lg leading-loose whitespace-nowrap text-ink-soft">
                  一本可以動手的料理雜誌。
                  <br />
                  挑幾樣食材，切、炒、調味，
                  <br />
                  把一道菜從籃子端上餐桌。
                </p>
                <Link
                  href="/kitchen"
                  className="mt-6 inline-flex min-h-12 w-fit items-center rounded-full whitespace-nowrap border-2 border-ink bg-terracotta px-7 text-lg font-semibold text-paper transition-transform duration-150 hover:-translate-y-0.5"
                >
                  走進廚房
                </Link>
              </Parallax>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-lg" aria-hidden="true">
              <Parallax fromTop speed={0.2} className="absolute inset-[10%]">
                <div className="h-full w-full rounded-full bg-mustard" />
              </Parallax>
              <Parallax fromTop speed={0.06} spin={0.03} className="absolute inset-[17%]">
                <DishArt recipe={heroDish} className="float-slow h-full w-full" />
              </Parallax>
              {HERO_INGREDIENTS.map((item) => (
                <Parallax key={item.id} fromTop speed={item.speed} spin={item.spin} className={`absolute ${item.className}`}>
                  <IngredientArt id={item.id} className="w-full" />
                </Parallax>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="scroll-mt-20 border-b-2 border-ink bg-paper-deep">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8">
            <h2 className="text-sm tracking-[0.3em] text-ink-soft">怎麼玩</h2>
            <ol className="mt-6 grid gap-8 md:grid-cols-3 md:gap-0">
              {HOW_TO.map((item, index) => (
                <li key={item.title} className="md:border-l-2 md:border-ink md:px-8 md:first:border-l-0 md:first:pl-0">
                  <span className="font-latin text-5xl text-terracotta italic">{index + 1}</span>
                  <h3 className="mt-2 text-2xl font-bold">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{item.text}</p>
                </li>
              ))}
            </ol>
            <Link
              href="/kitchen"
              className="mt-10 inline-flex min-h-12 items-center rounded-full border-2 border-ink bg-terracotta px-7 text-lg font-semibold text-paper transition-transform duration-150 hover:-translate-y-0.5"
            >
              開始玩
            </Link>
          </div>
        </section>

        <section aria-label="品牌標語" className="relative overflow-clip border-b-2 border-ink bg-moss py-28 text-paper sm:py-40">
          <Parallax axis="x" speed={-0.35} className="whitespace-nowrap">
            <p aria-hidden="true" className="font-latin text-7xl text-paper/25 italic sm:text-9xl">
              chop · stir · season · taste · chop · stir · season · taste
            </p>
          </Parallax>
          <Parallax speed={-0.08} className="relative z-10 my-8 px-4 text-center">
            <p className="text-3xl leading-relaxed font-black tracking-[0.12em] sm:text-5xl">
              認真吃飯，
              <br className="sm:hidden" />
              也是一種實驗。
            </p>
          </Parallax>
          <Parallax axis="x" speed={0.3} className="whitespace-nowrap">
            <p aria-hidden="true" className="font-latin text-7xl text-paper/25 italic sm:text-9xl">
              taste · season · stir · chop · taste · season · stir · chop
            </p>
          </Parallax>
          {INTERLUDE_INGREDIENTS.map((item) => (
            <Parallax key={item.id} speed={item.speed} spin={item.spin} className={`pointer-events-none absolute ${item.className}`}>
              <IngredientArt id={item.id} className="w-full" />
            </Parallax>
          ))}
        </section>

        <section id="recipes" className="relative scroll-mt-16 overflow-clip bg-paper-deep">
          <Parallax speed={0.18} spin={0.04} className="pointer-events-none absolute -top-16 -right-24 w-80 opacity-30 lg:w-[28rem]">
            <DishArt recipe={RECIPES[5]} className="w-full" />
          </Parallax>
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-8 lg:py-20">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-4xl font-black sm:text-5xl">菜譜索引</h2>
              <p className="text-ink-soft">
                {RECIPES.length} 道菜・{INGREDIENTS.length} 種食材
              </p>
            </div>
            <ol className="mt-8 grid border-t-2 border-ink md:grid-cols-2 md:gap-x-12">
              {RECIPES.map((recipe, index) => (
                <li key={recipe.id} className="border-b border-ink/30">
                  <Link
                    href={`/dishes/${recipe.id}`}
                    className="group flex items-center gap-4 py-4 transition-colors duration-150 hover:bg-paper/60"
                  >
                    <span className="w-8 shrink-0 font-latin text-2xl text-terracotta italic">{index + 1}</span>
                    <DishArt recipe={recipe} className="h-16 w-16 shrink-0 transition-transform duration-200 group-hover:-rotate-6" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold group-hover:text-terracotta">{recipe.name}</h3>
                      <p className="text-sm text-ink-soft">
                        {recipe.ingredients.map((id) => INGREDIENT_BY_ID[id].name).join("・")}
                      </p>
                    </div>
                    <span className="shrink-0 pr-2 text-sm text-ink-soft group-hover:text-terracotta">營養卡 →</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </>
  );
}
