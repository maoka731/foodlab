"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { DishArt, IngredientArt, Star } from "@/components/illustrations";
import type { Recipe } from "@/data/kitchen";
import { dissect, macroShares } from "@/data/nutrition";

/* 已通過 dataviz 色彩驗證；芥末黃對比較低，因此圖上一律直接標籤，並附數據表。 */
const MACROS = [
  { key: "carbs", name: "碳水化合物", short: "碳水", color: "#CC9620" },
  { key: "protein", name: "蛋白質", short: "蛋白質", color: "#0F76A8" },
  { key: "fat", name: "脂肪", short: "脂肪", color: "#C2502F" },
] as const;

type MacroKey = (typeof MACROS)[number]["key"];

function slicePath(start: number, end: number, radius: number) {
  const point = (share: number) => {
    const angle = share * Math.PI * 2 - Math.PI / 2;
    return `${(Math.cos(angle) * radius).toFixed(2)} ${(Math.sin(angle) * radius).toFixed(2)}`;
  };
  if (end - start >= 0.9999) {
    return `M0 ${-radius}A${radius} ${radius} 0 1 1 -0.01 ${-radius}Z`;
  }
  return `M0 0L${point(start)}A${radius} ${radius} 0 ${end - start > 0.5 ? 1 : 0} 1 ${point(end)}Z`;
}

function MacroPie({
  shares,
  grams,
  active,
  onActive,
}: {
  shares: Record<MacroKey, number>;
  grams: Record<MacroKey, number>;
  active: MacroKey | null;
  onActive: (key: MacroKey | null) => void;
}) {
  const slices = MACROS.reduce<{ key: MacroKey; short: string; name: string; color: string; start: number; end: number }[]>(
    (list, macro) => {
      const start = list.at(-1)?.end ?? 0;
      return [...list, { key: macro.key, short: macro.short, name: macro.name, color: macro.color, start, end: start + shares[macro.key] }];
    },
    [],
  );
  const summary = MACROS.map((macro) => `${macro.name} ${Math.round(shares[macro.key] * 100)}%`).join("、");

  return (
    <svg viewBox="-160 -135 320 270" className="mx-auto w-full max-w-xs" role="img" aria-label={`熱量來源圓餅圖：${summary}`}>
      {slices
        .filter((slice) => slice.end - slice.start > 0.0005)
        .map((slice) => {
          const middle = ((slice.start + slice.end) / 2) * Math.PI * 2 - Math.PI / 2;
          const labelX = Math.cos(middle) * 112;
          const labelY = Math.sin(middle) * 112;
          const anchor = labelX > 12 ? "start" : labelX < -12 ? "end" : "middle";
          const share = Math.round((slice.end - slice.start) * 100);
          return (
            <g
              key={slice.key}
              tabIndex={0}
              aria-label={`${slice.name}：${grams[slice.key].toFixed(1)} 公克，佔熱量 ${share}%`}
              onPointerEnter={() => onActive(slice.key)}
              onPointerLeave={() => onActive(null)}
              onFocus={() => onActive(slice.key)}
              onBlur={() => onActive(null)}
              className="cursor-pointer outline-none"
            >
              <path
                d={slicePath(slice.start, slice.end, active === slice.key ? 100 : 96)}
                fill={slice.color}
                stroke="#FAF6EC"
                strokeWidth="2"
                opacity={active !== null && active !== slice.key ? 0.45 : 1}
                className="transition-opacity duration-150"
              />
              <text x={labelX} y={labelY - 3} textAnchor={anchor} fill="#2B2622" fontSize="14" fontWeight="700">
                {slice.short}
              </text>
              <text x={labelX} y={labelY + 14} textAnchor={anchor} fill="#5F564C" fontSize="14">
                {share}%
              </text>
            </g>
          );
        })}
    </svg>
  );
}

function SectionBrace({ title, en }: { title: string; en: string }) {
  return (
    <div className="flex w-[4.5rem] shrink-0 items-center gap-2 sm:w-28">
      <div className="min-w-0 flex-1 text-right">
        <p className="text-lg font-bold">{title}</p>
        <p className="font-latin text-sm leading-tight text-ink-soft italic">{en}</p>
      </div>
      <div className="w-3 shrink-0 self-stretch rounded-l-xl border-y-2 border-l-2 border-ink" aria-hidden="true" />
    </div>
  );
}

/** 爆炸圖的一層：沿虛線中軸往下堆疊，以引線接到右側說明。 */
function StackRow({
  art,
  index,
  title,
  en,
  children,
  last,
}: {
  art: ReactNode;
  index: number;
  title: string;
  en: string;
  children?: ReactNode;
  last?: boolean;
}) {
  return (
    <li className="group relative flex items-center gap-2 py-3 sm:gap-3">
      {!last && (
        <span className="absolute top-1/2 left-10 h-full border-l-2 border-dotted border-ink/45 sm:left-12" aria-hidden="true" />
      )}
      <span
        className="relative z-10 h-20 w-20 shrink-0 transition-transform duration-200 group-hover:-translate-y-1 sm:h-24 sm:w-24"
        style={{ rotate: `${index % 2 === 0 ? -4 : 5}deg` }}
      >
        {art}
      </span>
      <span className="w-5 shrink-0 border-t border-ink/70 sm:w-10" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-lg font-bold">{title}</span>
          <span className="font-latin text-ink-soft italic">{en}</span>
        </p>
        {children && <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">{children}</p>}
      </div>
    </li>
  );
}

export function DishAnatomy({
  recipe,
  stars,
  score,
  note,
}: {
  recipe: Recipe;
  stars: 1 | 2 | 3;
  score: number;
  note: string;
}) {
  const report = dissect(recipe);
  const shares = macroShares(report.total);
  const [active, setActive] = useState<MacroKey | null>(null);
  const pantryText = report.pantry.map((item) => `${item.name} ${item.grams}g`).join("、");

  return (
    <article aria-label={`${recipe.name}食譜卡`} className="mx-auto mt-14 max-w-5xl border-2 border-ink bg-paper-light">
      <div className="m-2 border border-ink sm:m-3">
        <header className="grid items-center gap-6 border-b border-ink px-4 py-8 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10">
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <div className="absolute inset-[6%] rounded-full bg-mustard/35" aria-hidden="true" />
            <DishArt recipe={recipe} title={`${recipe.name}成品`} className="relative h-full w-full" />
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm tracking-[0.3em] text-ink-soft">食譜卡・Recipe Card</p>
            <p className="mt-4 font-latin text-xl text-terracotta italic">{report.en}</p>
            <h4 className="text-4xl font-black tracking-[0.1em] sm:text-5xl">{recipe.name}</h4>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 md:justify-start">
              <span className="flex gap-0.5" role="img" aria-label={`獲得 ${stars} 顆星，滿分 3 顆`}>
                {[1, 2, 3].map((value) => (
                  <Star key={value} filled={value <= stars} className="h-9 w-9" />
                ))}
              </span>
              <span className="text-sm text-ink-soft">完成度 {score} 分</span>
            </div>
            <p className="mt-2 font-semibold">{note}</p>
            <p className="mt-4 leading-relaxed text-ink-soft">{report.quip}</p>
            <dl className="mt-6 flex justify-center gap-8 border-t border-line pt-4 md:justify-start">
              <div>
                <dt className="text-sm text-ink-soft">份量</dt>
                <dd className="mt-1 text-xl font-bold">一人份・約 {Math.round(report.grams)} g</dd>
              </div>
              <div>
                <dt className="text-sm text-ink-soft">熱量</dt>
                <dd className="mt-1 text-xl font-bold">
                  {Math.round(report.total.kcal)} <span className="text-base font-normal">大卡</span>
                </dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="grid gap-10 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
          <section aria-labelledby={`${recipe.id}-ingredients`}>
            <h5 id={`${recipe.id}-ingredients`} className="flex items-baseline gap-3 border-b-2 border-ink pb-2">
              <span className="text-2xl font-bold">食材拆解</span>
              <span className="font-latin text-lg text-ink-soft italic">Dish Anatomy</span>
            </h5>
            <div className="mt-4 flex gap-2 sm:gap-3">
              <SectionBrace title="食材" en="Ingredients" />
              <ol className="min-w-0 flex-1">
                {report.ingredients.map((item, index) => (
                  <StackRow
                    key={item.id}
                    index={index}
                    art={<IngredientArt id={item.id} className="h-full w-full" />}
                    title={item.name}
                    en={item.en}
                  >
                    {item.fact}
                  </StackRow>
                ))}
              </ol>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <SectionBrace title="成品" en="Serve" />
              <ol className="min-w-0 flex-1">
                <StackRow
                  last
                  index={report.ingredients.length}
                  art={<DishArt recipe={recipe} className="h-full w-full" />}
                  title={recipe.name}
                  en={report.en}
                />
              </ol>
            </div>
          </section>

          <section aria-labelledby={`${recipe.id}-nutrition`}>
            <h5 id={`${recipe.id}-nutrition`} className="flex items-baseline gap-3 border-b-2 border-ink pb-2">
              <span className="text-2xl font-bold">熱量都從哪裡來？</span>
            </h5>
            <MacroPie shares={shares} grams={report.total} active={active} onActive={setActive} />
            <table className="mt-2 w-full border-collapse text-left">
              <caption className="sr-only">{recipe.name}一人份營養成分</caption>
              <thead>
                <tr className="border-b border-ink text-sm text-ink-soft">
                  <th scope="col" className="py-2 font-normal">營養素</th>
                  <th scope="col" className="py-2 text-right font-normal">含量</th>
                  <th scope="col" className="py-2 text-right font-normal">熱量佔比</th>
                </tr>
              </thead>
              <tbody>
                {MACROS.map((macro) => (
                  <tr
                    key={macro.key}
                    onPointerEnter={() => setActive(macro.key)}
                    onPointerLeave={() => setActive(null)}
                    className={`border-b border-line transition-colors duration-150 ${active === macro.key ? "bg-paper-deep" : ""}`}
                  >
                    <th scope="row" className="py-2 font-normal">
                      <span className="mr-2 inline-block h-3 w-3 rounded-full" style={{ backgroundColor: macro.color }} aria-hidden="true" />
                      {macro.name}
                    </th>
                    <td className="py-2 text-right tabular-nums">{report.total[macro.key].toFixed(1)} g</td>
                    <td className="py-2 text-right tabular-nums">{Math.round(shares[macro.key] * 100)}%</td>
                  </tr>
                ))}
                <tr className="border-b border-line">
                  <th scope="row" className="py-2 pl-5 font-normal">膳食纖維</th>
                  <td className="py-2 text-right tabular-nums">{report.total.fiber.toFixed(1)} g</td>
                  <td className="py-2 text-right text-ink-soft">—</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        <div className="px-4 pb-6 text-sm leading-relaxed text-ink-soft sm:px-8">
          {pantryText && <p>調味與用油：{pantryText}（已計入總熱量）</p>}
          <p className="mt-1">
            營養數值依常見食材成分與本站設定的一人份用量估算，未計入高湯、米酒、豆瓣醬與烹調耗損，僅供參考，並非營養或醫療建議。
          </p>
        </div>

        <footer className="flex items-center justify-between gap-3 bg-ink px-4 py-2.5 text-sm text-paper sm:px-8">
          <span className="tracking-[0.2em]">食驗室</span>
          <span className="font-latin italic">Recipe Card</span>
        </footer>
      </div>
    </article>
  );
}
