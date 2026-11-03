import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DishAnatomy } from "@/components/DishAnatomy";
import { CARD_COPY } from "@/data/cards";
import { RECIPE_BY_ID, RECIPES } from "@/data/kitchen";

export function generateStaticParams() {
  return RECIPES.map((recipe) => ({ id: recipe.id }));
}

export async function generateMetadata({ params }: PageProps<"/dishes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const recipe = RECIPE_BY_ID[id];
  if (!recipe) return { title: "找不到這道菜｜食驗室 Foodlab" };
  return {
    title: `${recipe.name}・料理營養卡｜食驗室 Foodlab`,
    description: CARD_COPY[recipe.id].highlights.map((item) => item.note).join(""),
  };
}

export default function DishPage({ params }: PageProps<"/dishes/[id]">) {
  return (
    <main className="flex-1 overflow-x-clip">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 lg:py-14">
        <Suspense fallback={<p className="py-24 text-center text-ink-soft">營養卡準備中……</p>}>
          <DishContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}

async function DishContent({ params }: Pick<PageProps<"/dishes/[id]">, "params">) {
  const { id } = await params;
  const recipe = RECIPE_BY_ID[id];
  if (!recipe) notFound();

  const index = RECIPES.indexOf(recipe);
  const previous = RECIPES[(index - 1 + RECIPES.length) % RECIPES.length];
  const next = RECIPES[(index + 1) % RECIPES.length];
  const pager = "inline-flex min-h-11 items-center underline-offset-4 hover:text-terracotta hover:underline";

  return (
    <>
      <nav aria-label="麵包屑" className="text-sm text-ink-soft">
        <Link href="/#recipes" className={pager}>菜譜索引</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <span aria-current="page" className="text-ink">{recipe.name}</span>
      </nav>

      <DishAnatomy recipe={recipe} className="mt-4" />

      <div className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <Link href={`/dishes/${previous.id}`} className={pager}>← {previous.name}</Link>
        <Link
          href="/kitchen"
          className="inline-flex min-h-12 items-center rounded-full border-2 border-ink bg-terracotta px-7 text-lg font-semibold text-paper transition-transform duration-150 hover:-translate-y-0.5"
        >
          到廚房玩一局
        </Link>
        <Link href={`/dishes/${next.id}`} className={pager}>{next.name} →</Link>
      </div>
    </>
  );
}
