"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { DishArt, IngredientArt } from "@/components/illustrations";
import type { GameStep, Recipe } from "@/data/kitchen";
import { dissect, macroShares } from "@/data/nutrition";

/* 已通過 dataviz 色彩驗證；芥末黃對比較低，因此圖上一律直接標籤，並附數據表。 */
const MACROS = [
  { key: "carbs", name: "碳水化合物", short: "碳水", color: "#CC9620" },
  { key: "protein", name: "蛋白質", short: "蛋白質", color: "#0F76A8" },
  { key: "fat", name: "脂肪", short: "脂肪", color: "#C2502F" },
] as const;

type MacroKey = (typeof MACROS)[number]["key"];

const GAME_LABEL: Record<GameStep["game"], { en: string; icon: ReactNode }> = {
  chop: {
    en: "Chop",
    icon: <path d="M20 16h44c4 18 2 34-4 44H20zM28 60h18v22H28z" fill="#E7E2D6" />,
  },
  stir: {
    en: "Stir-Fry",
    icon: (
      <>
        <path d="M10 48h70c0 18-14 30-35 30S10 66 10 48z" fill="#4A423B" />
        <path d="M80 54l14-4" />
        <path d="M60 14L44 56" />
      </>
    ),
  },
  heat: {
    en: "Control the Heat",
    icon: <path d="M50 10c4 16 24 26 24 48 0 15-11 28-24 28S26 73 26 58c0-10 6-16 10-22 2 8 6 10 9 10 2-12 0-24 5-36z" fill="#C8492F" />,
  },
  pour: {
    en: "Pour & Season",
    icon: (
      <>
        <path d="M24 34h44l-5 46H29z" fill="#9C5A2A" />
        <path d="M68 42c14-2 16 18-3 22" />
        <path d="M34 12c-3 5 3 8 0 14M50 12c-3 5 3 8 0 14" />
      </>
    ),
  },
};

function SectionBrace({ title, en }: { title: string; en: string }) {
  return (
    <div className="flex w-[5.25rem] shrink-0 items-center gap-2 sm:w-40">
      <div className="min-w-0 flex-1 text-right">
        <p className="font-bold">{title}</p>
        <p className="font-latin text-sm leading-tight text-ink-soft italic">{en}</p>
      </div>
      <div className="w-3 shrink-0 self-stretch rounded-l-xl border-y-2 border-l-2 border-ink" aria-hidden="true" />
    </div>
  );
}

function AnatomyRow({ art, name, en, last }: { art: ReactNode; name: string; en: string; last?: boolean }) {
  return (
    <li className="relative flex min-h-20 items-center gap-2">
      {!last && <span className="absolute top-1/2 left-9 h-full border-l-2 border-dotted border-ink/50 sm:left-10" aria-hidden="true" />}
      <span className="relative z-10 h-[4.5rem] w-[4.5rem] shrink-0 sm:h-20 sm:w-20">{art}</span>
      <span className="h-px min-w-3 flex-1 border-t border-ink/60" aria-hidden="true" />
      <span className="w-24 shrink-0 sm:w-36">
        <span className="block leading-snug font-bold">{name}</span>
        <span className="block font-latin text-sm leading-tight text-ink-soft italic">{en}</span>
      </span>
    </li>
  );
}

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
    <svg viewBox="-160 -135 320 270" className="mx-auto w-full max-w-sm" role="img" aria-label={`熱量來源圓餅圖：${summary}`}>
      {slices
        .filter((slice) => slice.end - slice.start > 0.0005)
        .map((slice) => {
          const middle = ((slice.start + slice.end) / 2) * Math.PI * 2 - Math.PI / 2;
          const labelX = Math.cos(middle) * 112;
          const labelY = Math.sin(middle) * 112;
          const dim = active !== null && active !== slice.key;
          return (
            <g
              key={slice.key}
              tabIndex={0}
              aria-label={`${slice.name}：${grams[slice.key].toFixed(1)} 公克，佔熱量 ${Math.round((slice.end - slice.start) * 100)}%`}
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
                opacity={dim ? 0.45 : 1}
                className="transition-opacity duration-150"
              />
              <text
                x={labelX}
                y={labelY - 3}
                textAnchor={labelX > 12 ? "start" : labelX < -12 ? "end" : "middle"}
                fill="#2B2622"
                fontSize="14"
                fontWeight="700"
              >
                {slice.short}
              </text>
              <text
                x={labelX}
                y={labelY + 14}
                textAnchor={labelX > 12 ? "start" : labelX < -12 ? "end" : "middle"}
                fill="#5F564C"
                fontSize="14"
              >
                {Math.round((slice.end - slice.start) * 100)}%
              </text>
            </g>
          );
        })}
    </svg>
  );
}

function MacroBar({ shares, label }: { shares: Record<MacroKey, number>; label: string }) {
  return (
    <div role="img" aria-label={label} className="flex h-2 gap-0.5 overflow-hidden rounded-full">
      {MACROS.filter((macro) => shares[macro.key] > 0).map((macro) => (
        <span key={macro.key} style={{ width: `${shares[macro.key] * 100}%`, backgroundColor: macro.color }} />
      ))}
    </div>
  );
}

export function DishAnatomy({ recipe }: { recipe: Recipe }) {
  const report = dissect(recipe);
  const shares = macroShares(report.total);
  const [active, setActive] = useState<MacroKey | null>(null);
  const cookingSteps = recipe.steps.filter((step) => step.game !== "chop");
  const pantryText = report.pantry.map((item) => `${item.name} ${item.grams}g`).join("、");

  return (
    <section aria-label={`${recipe.name}解剖報告`} className="mx-auto mt-14 max-w-5xl border-2 border-ink bg-paper-light">
      <div className="m-2 border border-ink sm:m-3">
        <header className="px-4 pt-8 pb-6 text-center sm:px-8">
          <p className="text-sm tracking-[0.3em] text-ink-soft">菜餚解剖報告</p>
          <p className="mt-3 font-latin text-xl text-terracotta italic">{report.en}</p>
          <h4 className="text-4xl font-black tracking-[0.1em] sm:text-5xl">{recipe.name}</h4>
          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-ink-soft">{report.quip}</p>
        </header>

        <div className="grid gap-10 px-4 pb-8 sm:px-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="flex gap-3">
              <SectionBrace title="食材處理" en="Ingredient Processing" />
              <ol className="min-w-0 flex-1">
                {report.ingredients.map((item) => (
                  <AnatomyRow
                    key={item.id}
                    art={<IngredientArt id={item.id} className="h-full w-full" />}
                    name={`${item.name}・${item.prep}`}
                    en={item.en}
                  />
                ))}
              </ol>
            </div>
            <div className="flex gap-3">
              <SectionBrace title="烹調方式" en="Cooking Method" />
              <ol className="min-w-0 flex-1">
                {cookingSteps.map((step) => (
                  <AnatomyRow
                    key={step.title}
                    art={
                      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" stroke="#2B2622" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="50" cy="50" r="46" fill="#FAF6EC" stroke="none" />
                        <g filter="url(#wobble)">{GAME_LABEL[step.game].icon}</g>
                      </svg>
                    }
                    name={step.title}
                    en={GAME_LABEL[step.game].en}
                  />
                ))}
                <AnatomyRow
                  last
                  art={<DishArt recipe={recipe} className="h-full w-full" />}
                  name={`上桌：${recipe.name}`}
                  en="Serve"
                />
              </ol>
            </div>
          </div>

          <div>
            <div className="border-b-2 border-ink pb-3">
              <p className="text-sm text-ink-soft">一人份・約 {Math.round(report.grams)} 公克</p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="text-6xl font-black">{Math.round(report.total.kcal)}</span>
                <span className="text-lg text-ink-soft">大卡</span>
              </p>
            </div>
            <h5 className="mt-5 font-bold">熱量都從哪裡來？</h5>
            <MacroPie
              shares={shares}
              grams={report.total}
              active={active}
              onActive={setActive}
            />
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
          </div>
        </div>

        <div className="border-t border-ink px-4 py-8 sm:px-8">
          <h5 className="text-2xl font-bold">每樣食材，貢獻了什麼</h5>
          <ul className="mt-5 grid gap-x-8 gap-y-6 md:grid-cols-2">
            {report.ingredients.map((item) => {
              const itemShares = macroShares(item.nutrition);
              return (
                <li key={item.id} className="flex gap-3">
                  <IngredientArt id={item.id} className="h-16 w-16 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="text-lg font-bold">{item.name} <span className="text-sm font-normal text-ink-soft">{item.grams} g</span></span>
                      <span className="text-sm text-ink-soft tabular-nums">{Math.round(item.nutrition.kcal)} 大卡</span>
                    </p>
                    <MacroBar
                      shares={itemShares}
                      label={`${item.name}熱量組成：${MACROS.map((macro) => `${macro.short} ${Math.round(itemShares[macro.key] * 100)}%`).join("、")}`}
                    />
                    <p className="mt-1.5 text-sm text-ink-soft tabular-nums">
                      碳水 {item.nutrition.carbs.toFixed(1)}g・蛋白質 {item.nutrition.protein.toFixed(1)}g・脂肪 {item.nutrition.fat.toFixed(1)}g
                    </p>
                    <p className="mt-1.5 leading-relaxed">{item.fact}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          {pantryText && <p className="mt-6 text-ink-soft">調味與用油：{pantryText}（已計入總熱量）</p>}
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            本報告依常見食材成分與本站設定的一人份用量估算，未計入高湯、米酒、豆瓣醬與烹調耗損，僅供參考，並非營養或醫療建議。
          </p>
        </div>

        <footer className="flex items-center justify-between gap-3 bg-ink px-4 py-2.5 text-sm text-paper sm:px-8">
          <span className="tracking-[0.2em]">食驗室</span>
          <span className="font-latin italic">Dish Anatomy</span>
        </footer>
      </div>
    </section>
  );
}
