"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DishAnatomy } from "@/components/DishAnatomy";
import { DishArt, IngredientArt } from "@/components/illustrations";
import { ChopGame, HeatGame, PourGame, StirGame } from "@/components/minigames";
import { CARD_COPY } from "@/data/cards";
import {
  INGREDIENT_BY_ID,
  INGREDIENTS,
  MAX_PICK,
  RECIPE_BY_ID,
  STAR_NOTES,
  canAdd,
  completions,
  explore,
  findRecipe,
  starsFor,
} from "@/data/kitchen";
import type { GameStep, IngredientId, Recipe } from "@/data/kitchen";

type Phase = "pick" | "match" | "cook" | "done";
/** 跟著玩：只能選配得起來的食材；自由實驗：隨意組合，再看能做什麼。兩者共用同一套流程。 */
type Mode = "guided" | "free";

const FREE_MAX = 5;

const GAME_NAMES: Record<GameStep["game"], string> = {
  chop: "切",
  stir: "炒",
  heat: "火候",
  pour: "調味",
};

const primaryButton =
  "min-h-12 cursor-pointer rounded-full border-2 border-ink bg-terracotta px-7 py-2.5 text-lg font-semibold text-paper transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0";
const secondaryButton =
  "min-h-12 cursor-pointer rounded-full border-2 border-ink bg-transparent px-6 py-2.5 font-semibold text-ink transition-colors duration-150 hover:bg-paper-deep";

const names = (ids: IngredientId[]) =>
  ids.map((id) => INGREDIENT_BY_ID[id].name).join("、");

export function Kitchen() {
  const [mode, setMode] = useState<Mode>("guided");
  const [phase, setPhase] = useState<Phase>("pick");
  const [selected, setSelected] = useState<IngredientId[]>([]);
  /** 自由模式下使用者挑定的菜；跟著玩模式則由食材組合直接決定。 */
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [stepScore, setStepScore] = useState<number | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const shownPhase = useRef(phase);

  const recipe: Recipe | undefined =
    mode === "guided" ? findRecipe(selected) : chosenId ? RECIPE_BY_ID[chosenId] : undefined;

  useEffect(() => {
    if (shownPhase.current === phase) return;
    shownPhase.current = phase;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    top.current?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
    top.current?.focus({ preventScroll: true });
  }, [phase]);

  const finishStep = useCallback((score: number) => setStepScore(score), []);

  function switchMode(next: Mode) {
    setMode(next);
    setChosenId(null);
    // 自由模式的組合不一定配得起來；切回跟著玩時，配不起來就清空重選
    if (next === "guided" && selected.length > 0 && completions(selected).length === 0) setSelected([]);
  }

  function toggle(id: IngredientId) {
    setChosenId(null);
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (mode === "guided") return canAdd(current, id) ? [...current, id] : current;
      return current.length < FREE_MAX ? [...current, id] : current;
    });
  }

  function choose(id: string) {
    setChosenId(id);
    setPhase("match");
  }

  /** 快速探索：不玩小遊戲，直接看營養卡。 */
  function preview(id?: string) {
    if (id) setChosenId(id);
    setScores([]);
    setPhase("done");
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

  function restart() {
    setSelected([]);
    setChosenId(null);
    setPhase("pick");
  }

  return (
    <div ref={top} tabIndex={-1} className="scroll-mt-24 outline-none">
      {phase === "pick" && (
        <PickView
          mode={mode}
          selected={selected}
          onMode={switchMode}
          onToggle={toggle}
          onClear={() => setSelected([])}
          onSubmit={() => setPhase("match")}
          onChoose={choose}
          onPreview={preview}
        />
      )}
      {phase === "match" && recipe && (
        <MatchView recipe={recipe} onBack={() => setPhase("pick")} onCook={startCooking} onPreview={() => preview()} />
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
        <DoneView recipe={recipe} scores={scores} onPlay={startCooking} onRestart={restart} />
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

function ModeSwitch({ mode, onMode }: { mode: Mode; onMode: (mode: Mode) => void }) {
  const options: { id: Mode; label: string; hint: string }[] = [
    { id: "guided", label: "跟著玩", hint: "只亮出配得起來的食材" },
    { id: "free", label: "自由實驗", hint: "隨意組合，看看能做什麼" },
  ];
  return (
    <div role="radiogroup" aria-label="探索模式" className="mt-6 inline-flex flex-wrap rounded-2xl border-2 border-ink bg-paper-light p-1">
      {options.map((option) => {
        const active = mode === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onMode(option.id)}
            className={`min-h-12 cursor-pointer rounded-xl px-5 py-2 text-left transition-colors duration-150 ${
              active ? "bg-ink text-paper" : "text-ink hover:bg-paper-deep"
            }`}
          >
            <span className="block font-bold">{option.label}</span>
            <span className={`block text-sm ${active ? "text-paper/75" : "text-ink-soft"}`}>{option.hint}</span>
          </button>
        );
      })}
    </div>
  );
}

function PickView({
  mode,
  selected,
  onMode,
  onToggle,
  onClear,
  onSubmit,
  onChoose,
  onPreview,
}: {
  mode: Mode;
  selected: IngredientId[];
  onMode: (mode: Mode) => void;
  onToggle: (id: IngredientId) => void;
  onClear: () => void;
  onSubmit: () => void;
  onChoose: (id: string) => void;
  onPreview: (id: string) => void;
}) {
  const guided = mode === "guided";
  const recipe = guided ? findRecipe(selected) : undefined;
  const found = explore(selected);
  const limit = guided ? MAX_PICK : FREE_MAX;

  let hint = "先挑一樣想吃的";
  if (guided) {
    if (recipe) hint = `湊齊了：${recipe.name}`;
    else if (selected.length > 0) {
      hint = completions(selected)
        .slice(0, 2)
        .map((path) => `加${names(path.missing)}，就是${path.recipe.name}`)
        .join("；或");
    }
  } else if (selected.length > 0) {
    if (found.ready.length > 0) hint = `可以做：${found.ready.map((entry) => entry.recipe.name).join("、")}`;
    else if (found.nearly.length > 0) {
      hint = found.nearly
        .slice(0, 2)
        .map((entry) => `差一項：加${names(entry.missing)}就是${entry.recipe.name}`)
        .join("；");
    } else hint = "還差好幾樣，繼續加加看";
  }

  const showLab = !guided && selected.length >= 2 && found.ready.length === 0;

  return (
    <div>
      <StageLabel number="i.">挑選食材</StageLabel>
      <h3 className="text-3xl font-bold sm:text-4xl">今天的籃子裡，有什麼？</h3>
      <p className="mt-3 text-ink-soft">
        {guided
          ? "湊齊一道菜的食材就能下鍋。每選一樣，合不來的食材會自動反灰。"
          : `最多選 ${FREE_MAX} 樣，什麼都能放進籃子。我們會告訴你能做什麼、還差什麼。`}
      </p>
      <ModeSwitch mode={mode} onMode={onMode} />

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {INGREDIENTS.map((item, index) => {
          const active = selected.includes(item.id);
          const blocked = !active && (guided ? !canAdd(selected, item.id) : selected.length >= FREE_MAX);
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
                <span className="text-sm text-ink-soft">
                  {blocked ? (guided ? "這次搭不上" : "籃子滿了") : item.note}
                </span>
                <span className="mt-2 flex flex-wrap justify-center gap-1">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-paper-deep px-2 py-0.5 text-xs text-ink">
                      {tag}
                    </span>
                  ))}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {showLab && (
        <section aria-labelledby="lab-result" className="mt-8 rounded-2xl border-2 border-dashed border-ink bg-paper-light px-5 py-6 sm:px-8">
          <p className="font-latin text-lg text-terracotta italic">Lab Notes</p>
          <h4 id="lab-result" className="text-2xl font-bold">這組還不在食譜裡</h4>
          <p className="mt-2 text-ink-soft">
            {names(selected)}，是個大膽的實驗！目前的食譜還沒有這個組合，這幾道最接近：
          </p>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {found.closest.map((entry) => (
              <li key={entry.recipe.id} className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3 py-3">
                <DishArt recipe={entry.recipe} className="h-16 w-16 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{entry.recipe.name}</p>
                  <p className="text-sm leading-snug text-ink-soft">
                    {[
                      entry.missing.length > 0 && `再加${names(entry.missing)}`,
                      entry.extra.length > 0 && `拿掉${names(entry.extra)}`,
                    ]
                      .filter(Boolean)
                      .join("，")}
                  </p>
                  <button
                    type="button"
                    onClick={() => onPreview(entry.recipe.id)}
                    className="mt-1 min-h-11 cursor-pointer text-sm font-semibold text-terracotta underline underline-offset-4"
                  >
                    看營養卡
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {/* 預留：之後可在此加入「自行新增料理」入口 */}
        </section>
      )}

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
        {guided || found.ready.length === 0 ? (
          <button type="button" className={primaryButton} disabled={!recipe} onClick={onSubmit}>
            {recipe ? "就煮這道" : `籃子 ${selected.length}/${limit}`}
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            {found.ready.map((entry) => (
              <button key={entry.recipe.id} type="button" className={primaryButton} onClick={() => onChoose(entry.recipe.id)}>
                做{entry.recipe.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MatchView({
  recipe,
  onBack,
  onCook,
  onPreview,
}: {
  recipe: Recipe;
  onBack: () => void;
  onCook: () => void;
  onPreview: () => void;
}) {
  const copy = CARD_COPY[recipe.id];

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

      <div className="lg:pt-10">
        <h4 className="text-2xl font-bold">這道菜的營養亮點</h4>
        <ul className="mt-4">
          {copy.highlights.map((item) => (
            <li key={item.label} className="flex gap-3 border-b border-line py-4">
              <span className="h-fit shrink-0 rounded-full bg-moss px-3 py-0.5 text-sm font-semibold text-paper">{item.label}</span>
              <span className="leading-relaxed">{item.note}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-2xl border-2 border-ink bg-paper-light p-5">
          <p className="font-bold">想動手玩一局？</p>
          <p className="mt-1 text-ink-soft">
            {recipe.steps.length} 個小關卡：{recipe.steps.map((step) => GAME_NAMES[step.game]).join("、")}，大約一分鐘。玩完會拿到星等。
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className={primaryButton} onClick={onCook}>開始下廚</button>
            <button type="button" className={secondaryButton} onClick={onPreview}>直接看營養卡</button>
          </div>
        </div>
        <button type="button" onClick={onBack} className="mt-4 min-h-11 cursor-pointer text-ink-soft underline underline-offset-4">
          ← 重新挑食材
        </button>
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
  onPlay,
  onRestart,
}: {
  recipe: Recipe;
  scores: number[];
  onPlay: () => void;
  onRestart: () => void;
}) {
  const played = scores.length > 0;
  const average = scores.reduce((sum, score) => sum + score, 0) / Math.max(scores.length, 1);
  const stars = starsFor(average);

  return (
    <div>
      <div className="text-center">
        <StageLabel number="iv.">{played ? "上菜" : "快速探索"}</StageLabel>
        <h3 className="serve-in text-5xl font-black tracking-[0.2em] sm:text-6xl">{played ? "完成！" : "營養卡"}</h3>
      </div>
      <DishAnatomy
        recipe={recipe}
        rating={played ? { stars, score: Math.round(average * 100), note: STAR_NOTES[stars] } : undefined}
      />
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" className={primaryButton} onClick={onRestart}>換一組食材</button>
        <button type="button" className={secondaryButton} onClick={onPlay}>
          {played ? "再做一次" : "玩小遊戲做這道"}
        </button>
      </div>
    </div>
  );
}
