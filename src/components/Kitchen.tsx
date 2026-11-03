"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DishAnatomy } from "@/components/DishAnatomy";
import { DishArt, IngredientArt } from "@/components/illustrations";
import { ChopGame, HeatGame, PourGame, StirGame } from "@/components/minigames";
import {
  INGREDIENT_BY_ID,
  INGREDIENTS,
  MAX_PICK,
  STAR_NOTES,
  canAdd,
  completions,
  findRecipe,
  starsFor,
} from "@/data/kitchen";
import type { GameStep, IngredientId, Recipe } from "@/data/kitchen";

type Phase = "pick" | "match" | "cook" | "done";

const primaryButton =
  "min-h-12 cursor-pointer rounded-full border-2 border-ink bg-terracotta px-7 py-2.5 text-lg font-semibold text-paper transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0";
const secondaryButton =
  "min-h-12 cursor-pointer rounded-full border-2 border-ink bg-transparent px-6 py-2.5 font-semibold text-ink transition-colors duration-150 hover:bg-paper-deep";

const names = (ids: IngredientId[]) =>
  ids.map((id) => INGREDIENT_BY_ID[id].name).join("、");

export function Kitchen() {
  const [phase, setPhase] = useState<Phase>("pick");
  const [selected, setSelected] = useState<IngredientId[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [stepScore, setStepScore] = useState<number | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const shownPhase = useRef(phase);

  const recipe = findRecipe(selected);

  useEffect(() => {
    if (shownPhase.current === phase) return;
    shownPhase.current = phase;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    top.current?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
    top.current?.focus({ preventScroll: true });
  }, [phase]);

  const finishStep = useCallback((score: number) => setStepScore(score), []);

  function toggle(id: IngredientId) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      return canAdd(current, id) ? [...current, id] : current;
    });
  }

  function startCooking() {
    setStepIndex(0);
    setScores([]);
    setStepScore(null);
    setPhase("cook");
  }

  function nextStep() {
    if (!recipe || stepScore === null) return;
    setScores((current) => [...current, stepScore]);
    setStepScore(null);
    if (stepIndex + 1 >= recipe.steps.length) setPhase("done");
    else setStepIndex(stepIndex + 1);
  }

  return (
    <div ref={top} tabIndex={-1} className="scroll-mt-24 outline-none">
      {phase === "pick" && (
        <PickView
          selected={selected}
          onToggle={toggle}
          onClear={() => setSelected([])}
          onSubmit={() => setPhase("match")}
        />
      )}
      {phase === "match" && recipe && (
        <MatchView recipe={recipe} onBack={() => setPhase("pick")} onCook={startCooking} />
      )}
      {phase === "cook" && recipe && (
        <CookView
          key={`${recipe.id}-${stepIndex}`}
          dish={recipe.name}
          ingredients={recipe.ingredients}
          step={recipe.steps[stepIndex]}
          index={stepIndex}
          total={recipe.steps.length}
          stepScore={stepScore}
          onDone={finishStep}
          onNext={nextStep}
        />
      )}
      {phase === "done" && recipe && (
        <DoneView
          recipe={recipe}
          scores={scores}
          onRetry={startCooking}
          onRestart={() => {
            setSelected([]);
            setPhase("pick");
          }}
        />
      )}
    </div>
  );
}

function StageLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <p className="mb-2 flex items-baseline gap-3 text-ink-soft">
      <span className="font-latin text-2xl italic text-terracotta">{number}</span>
      <span className="text-sm tracking-[0.2em]">{children}</span>
    </p>
  );
}

function PickView({
  selected,
  onToggle,
  onClear,
  onSubmit,
}: {
  selected: IngredientId[];
  onToggle: (id: IngredientId) => void;
  onClear: () => void;
  onSubmit: () => void;
}) {
  const recipe = findRecipe(selected);
  const paths = completions(selected);

  let hint = "先挑一樣想吃的";
  if (recipe) hint = `湊齊了：${recipe.name}`;
  else if (selected.length > 0) {
    hint = paths
      .slice(0, 2)
      .map((path) => `加${names(path.missing)}，就是${path.recipe.name}`)
      .join("；或");
  }

  return (
    <div>
      <StageLabel number="i.">挑選食材</StageLabel>
      <h3 className="text-3xl font-bold sm:text-4xl">今天的籃子裡，有什麼？</h3>
      <p className="mt-3 text-ink-soft">
        湊齊一道菜的食材就能下鍋。每選一樣，合不來的食材會自動反灰。
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {INGREDIENTS.map((item, index) => {
          const active = selected.includes(item.id);
          const blocked = !active && !canAdd(selected, item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={active}
                disabled={blocked}
                onClick={() => onToggle(item.id)}
                className={`relative flex h-full w-full cursor-pointer flex-col items-center rounded-2xl border-2 px-3 pt-4 pb-3 text-center transition-[transform,background-color,border-color,filter,opacity] duration-200 disabled:cursor-not-allowed disabled:border-dashed disabled:border-line disabled:bg-transparent disabled:opacity-50 disabled:grayscale ${
                  active ? "border-ink bg-mustard/30" : "border-line bg-paper-light hover:-translate-y-1 hover:border-ink disabled:hover:translate-y-0"
                }`}
                style={{ rotate: `${(index % 3) - 1}deg` }}
              >
                {active && (
                  <span className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-terracotta text-paper">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 13l4 4 10-11" />
                    </svg>
                  </span>
                )}
                <IngredientArt id={item.id} className="h-24 w-24 sm:h-28 sm:w-28" />
                <span className="mt-2 text-lg font-bold">{item.name}</span>
                <span className="text-sm text-ink-soft">{blocked ? "這次搭不上" : item.note}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-3 z-10 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-paper-light px-4 py-3">
        <div className="flex min-h-12 min-w-0 flex-1 items-center gap-3">
          <span className="flex shrink-0 -space-x-2">
            {selected.map((id) => (
              <IngredientArt key={id} id={id} title={INGREDIENT_BY_ID[id].name} className="h-10 w-10" />
            ))}
          </span>
          <p aria-live="polite" className="min-w-0 text-ink-soft">{hint}</p>
          {selected.length > 0 && (
            <button type="button" onClick={onClear} className="ml-auto min-h-11 shrink-0 cursor-pointer px-2 text-sm text-ink-soft underline underline-offset-4">
              清空
            </button>
          )}
        </div>
        <button type="button" className={primaryButton} disabled={!recipe} onClick={onSubmit}>
          {recipe ? "就煮這道" : `籃子 ${selected.length}/${MAX_PICK}`}
        </button>
      </div>
    </div>
  );
}

function MatchView({
  recipe,
  onBack,
  onCook,
}: {
  recipe: Recipe;
  onBack: () => void;
  onCook: () => void;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
      <div>
        <StageLabel number="ii.">今日推薦</StageLabel>
        <h3 className="text-4xl font-black sm:text-5xl">{recipe.name}</h3>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">{recipe.blurb}</p>
        <DishArt recipe={recipe} title={recipe.name} className="mx-auto mt-6 w-full max-w-sm" />
        <p className="mt-4 border-t border-line pt-4">
          <span className="text-ink-soft">用到的食材　</span>
          <span className="font-semibold">{names(recipe.ingredients)}</span>
        </p>
      </div>

      <div>
        <h4 className="text-2xl font-bold">製作過程</h4>
        <ol className="mt-4">
          {recipe.steps.map((step, index) => (
            <li key={step.title} className="flex gap-4 border-b border-line py-4">
              <span className="font-latin text-3xl italic leading-none text-terracotta">{index + 1}</span>
              <div>
                <p className="font-bold">{step.title}</p>
                <p className="mt-1 leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className={primaryButton} onClick={onCook}>開始下廚</button>
          <button type="button" className={secondaryButton} onClick={onBack}>重新挑食材</button>
        </div>
      </div>
    </div>
  );
}

function CookView({
  dish,
  ingredients,
  step,
  index,
  total,
  stepScore,
  onDone,
  onNext,
}: {
  dish: string;
  ingredients: IngredientId[];
  step: GameStep;
  index: number;
  total: number;
  stepScore: number | null;
  onDone: (score: number) => void;
  onNext: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <StageLabel number="iii.">{dish}・第 {index + 1} 步，共 {total} 步</StageLabel>
      <h3 className="text-3xl font-black sm:text-4xl">{step.title}</h3>
      <p className="mx-auto mt-3 max-w-lg leading-relaxed text-ink-soft">{step.text}</p>
      <div className="mt-8">
        {step.game === "chop" && <ChopGame ingredient={step.ingredient} onDone={onDone} />}
        {step.game === "stir" && <StirGame ingredients={ingredients} onDone={onDone} />}
        {step.game === "heat" && <HeatGame onDone={onDone} />}
        {step.game === "pour" && <PourGame liquid={step.liquid} onDone={onDone} />}
      </div>
      <div className="mt-6 min-h-24" aria-live="polite">
        {stepScore !== null && (
          <>
            <p className="mb-3 text-lg font-bold text-moss">
              {stepScore >= 0.85 ? "漂亮！" : stepScore >= 0.55 ? "不錯喔！" : "沒關係，繼續！"}
            </p>
            <button type="button" className={primaryButton} onClick={onNext}>
              {index + 1 >= total ? "端上桌" : "下一步"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function DoneView({
  recipe,
  scores,
  onRetry,
  onRestart,
}: {
  recipe: Recipe;
  scores: number[];
  onRetry: () => void;
  onRestart: () => void;
}) {
  const average = scores.reduce((sum, score) => sum + score, 0) / Math.max(scores.length, 1);
  const stars = starsFor(average);

  return (
    <div>
      <div className="text-center">
        <StageLabel number="iv.">上菜</StageLabel>
        <h3 className="serve-in text-5xl font-black tracking-[0.2em] sm:text-6xl">完成！</h3>
      </div>
      <DishAnatomy recipe={recipe} stars={stars} score={Math.round(average * 100)} note={STAR_NOTES[stars]} />
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" className={primaryButton} onClick={onRestart}>換一組食材</button>
        <button type="button" className={secondaryButton} onClick={onRetry}>再做一次</button>
      </div>
    </div>
  );
}
