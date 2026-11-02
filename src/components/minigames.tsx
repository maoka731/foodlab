"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { IngredientArt } from "@/components/illustrations";
import { INGREDIENT_BY_ID } from "@/data/kitchen";
import type { IngredientId } from "@/data/kitchen";

type GameProps = {
  /** 分數介於 0–1。 */
  onDone: (score: number) => void;
};

const actionClass =
  "min-h-12 cursor-pointer rounded-full border-2 border-ink bg-terracotta px-7 py-2.5 text-lg font-semibold text-paper transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50";

/* ---------- 切菜：連點砧板，時間內切完 ---------- */

const CHOP_TARGET = 10;
const CHOP_LIMIT_MS = 6000;
const CHOP_PIECES = CHOP_TARGET + 1;

export function ChopGame({ ingredient, onDone }: GameProps & { ingredient: IngredientId }) {
  const [cuts, setCuts] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(CHOP_LIMIT_MS);
  const startedAt = useRef(0);
  const cutCount = useRef(0);
  const closed = useRef(false);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      const left = CHOP_LIMIT_MS - (performance.now() - startedAt.current);
      setTimeLeft(Math.max(left, 0));
      if (left <= 0 && !closed.current) {
        closed.current = true;
        setFinished(true);
        onDone(cutCount.current / CHOP_TARGET);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [started, finished, onDone]);

  function chop() {
    if (closed.current) return;
    if (!started) {
      startedAt.current = performance.now();
      setStarted(true);
    }
    cutCount.current += 1;
    setCuts(cutCount.current);
    if (cutCount.current >= CHOP_TARGET) {
      closed.current = true;
      setFinished(true);
      onDone(1);
    }
  }

  const name = INGREDIENT_BY_ID[ingredient].name;

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={chop}
        disabled={finished}
        aria-label={`在砧板上切${name}，目前切了 ${cuts} 刀，共 ${CHOP_TARGET} 刀`}
        className="relative h-56 w-full max-w-md cursor-pointer touch-manipulation overflow-hidden rounded-[2rem] border-2 border-ink bg-wood disabled:cursor-default"
      >
        <span className="absolute inset-0 m-auto block h-40 w-72 max-w-[85%]" aria-hidden="true">
          {Array.from({ length: CHOP_PIECES }, (_, index) => {
            const piece = 100 / CHOP_PIECES;
            const style: CSSProperties = {
              clipPath: `inset(0 ${100 - piece * (index + 1)}% 0 ${piece * index}%)`,
              transform: `translateX(${index <= cuts ? (index - cuts / 2) * 3 : cuts * 1.5}px)`,
            };
            return (
              <span key={index} className="absolute inset-0 transition-transform duration-150" style={style}>
                <IngredientArt id={ingredient} className="mx-auto h-40 w-40" />
              </span>
            );
          })}
        </span>
        <span key={cuts} aria-hidden="true" className="chop-knife absolute top-3 right-[18%]">
          <svg viewBox="0 0 60 120" className="h-28 w-14">
            <path d="M12 8h30c6 28 4 50-2 66H12z" fill="#E7E2D6" stroke="#2B2622" strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M16 74h22v38c-8 5-16 5-22 0z" fill="#5C3A22" stroke="#2B2622" strokeWidth="2.4" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div className="w-full max-w-md">
        <div className="flex justify-between text-sm text-ink-soft">
          <span>{cuts} / {CHOP_TARGET} 刀</span>
          <span>{started ? `剩 ${(timeLeft / 1000).toFixed(1)} 秒` : "點砧板開始，共 6 秒"}</span>
        </div>
        <Meter value={cuts / CHOP_TARGET} label="切菜進度" />
      </div>
    </div>
  );
}

/* ---------- 翻炒：在鍋中畫圈三圈 ---------- */

const STIR_TURNS = 3;
const STIR_FAST_MS = 9000;
const STIR_SLOW_MS = 20000;

export function StirGame({ onDone }: GameProps) {
  const [turns, setTurns] = useState(0);
  const [angle, setAngle] = useState(0);
  const pad = useRef<HTMLDivElement>(null);
  const lastAngle = useRef<number | null>(null);
  const total = useRef(0);
  const startedAt = useRef<number | null>(null);
  const closed = useRef(false);

  function advance(radians: number) {
    if (closed.current) return;
    startedAt.current ??= performance.now();
    total.current += Math.abs(radians);
    const nextTurns = total.current / (Math.PI * 2);
    setTurns(Math.min(nextTurns, STIR_TURNS));
    setAngle((current) => current + radians);
    if (nextTurns >= STIR_TURNS) {
      closed.current = true;
      const spent = performance.now() - startedAt.current;
      const late = (spent - STIR_FAST_MS) / (STIR_SLOW_MS - STIR_FAST_MS);
      onDone(1 - Math.min(Math.max(late, 0), 1) * 0.4);
    }
  }

  function angleAt(event: PointerEvent<HTMLDivElement>) {
    const rect = pad.current!.getBoundingClientRect();
    return Math.atan2(
      event.clientY - (rect.top + rect.height / 2),
      event.clientX - (rect.left + rect.width / 2),
    );
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (lastAngle.current === null) return;
    const next = angleAt(event);
    let delta = next - lastAngle.current;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;
    lastAngle.current = next;
    advance(delta);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={pad}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          lastAngle.current = angleAt(event);
        }}
        onPointerMove={move}
        onPointerUp={() => (lastAngle.current = null)}
        onPointerCancel={() => (lastAngle.current = null)}
        className="relative aspect-square w-64 cursor-grab touch-none select-none active:cursor-grabbing sm:w-72"
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 200" className="absolute inset-0">
          <circle cx="103" cy="103" r="94" fill="#3B3530" />
          <circle cx="100" cy="100" r="94" fill="#4A423B" stroke="#2B2622" strokeWidth="2.4" />
          <circle cx="100" cy="100" r="76" fill="#E9B44C" />
          <g transform={`rotate(${(angle * 180) / Math.PI} 100 100)`}>
            <path d="M60 80l14-6 6 12-14 5z" fill="#C8492F" stroke="#2B2622" strokeWidth="1.5" />
            <path d="M120 60l13 3-3 13-12-3z" fill="#6F8150" stroke="#2B2622" strokeWidth="1.5" />
            <path d="M130 118l14 4-5 13-13-5z" fill="#C8492F" stroke="#2B2622" strokeWidth="1.5" />
            <path d="M70 130l13-2 3 13-14 2z" fill="#FAF3E3" stroke="#2B2622" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="6" fill="#6F8150" stroke="#2B2622" strokeWidth="1.5" />
            <g>
              <path d="M100 100L100 20" stroke="#5C3A22" strokeWidth="7" strokeLinecap="round" />
              <ellipse cx="100" cy="46" rx="12" ry="18" fill="#8C5A36" stroke="#2B2622" strokeWidth="2" />
            </g>
          </g>
          <circle cx="100" cy="100" r="60" fill="none" stroke="#FAF3E3" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="3 9" strokeLinecap="round" />
        </svg>
      </div>
      <div className="w-full max-w-md">
        <div className="flex justify-between text-sm text-ink-soft">
          <span>{Math.floor(turns)} / {STIR_TURNS} 圈</span>
          <span>按住鍋子，沿虛線畫圈</span>
        </div>
        <Meter value={turns / STIR_TURNS} label="翻炒進度" />
      </div>
      <button type="button" className={actionClass} onClick={() => advance(Math.PI / 2)}>
        攪一下
      </button>
    </div>
  );
}

/* ---------- 火候：指針落在剛好的區域時起鍋 ---------- */

const HEAT_ROUNDS = [
  { width: 0.26, speed: 0.55 },
  { width: 0.2, speed: 0.75 },
  { width: 0.14, speed: 0.95 },
];
const HEAT_CENTER = 0.62;

export function HeatGame({ onDone }: GameProps) {
  const [round, setRound] = useState(0);
  const [hits, setHits] = useState(0);
  const [verdict, setVerdict] = useState("看指針滑進綠色區域，就按下按鈕");
  const needle = useRef<HTMLSpanElement>(null);
  const position = useRef(0);
  const finished = round >= HEAT_ROUNDS.length;

  useEffect(() => {
    if (finished) return;
    const { speed } = HEAT_ROUNDS[round];
    const startedAt = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const phase = (((now - startedAt) / 1000) * speed) % 2;
      position.current = phase < 1 ? phase : 2 - phase;
      if (needle.current) needle.current.style.left = `${position.current * 100}%`;
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [round, finished]);

  function press() {
    if (finished) return;
    const half = HEAT_ROUNDS[round].width / 2;
    const offset = position.current - HEAT_CENTER;
    const hit = Math.abs(offset) <= half;
    const nextHits = hits + (hit ? 1 : 0);
    setHits(nextHits);
    setVerdict(hit ? "剛剛好！" : offset < 0 ? "還有點生" : "有點焦了");
    setRound(round + 1);
    if (round + 1 >= HEAT_ROUNDS.length) onDone(nextHits / HEAT_ROUNDS.length);
  }

  const width = HEAT_ROUNDS[Math.min(round, HEAT_ROUNDS.length - 1)].width;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="w-full max-w-md">
        <div className="relative h-14 rounded-full border-2 border-ink bg-gradient-to-r from-[#EFE3C8] via-[#E9B44C] to-[#7A3F20]">
          <span
            className="absolute inset-y-0 border-x-2 border-ink bg-moss/70"
            style={{ left: `${(HEAT_CENTER - width / 2) * 100}%`, width: `${width * 100}%` }}
          />
          <span ref={needle} className="absolute -inset-y-2 w-1.5 -translate-x-1/2 rounded-full bg-ink" />
        </div>
        <div className="mt-2 flex justify-between text-sm text-ink-soft">
          <span>太生</span>
          <span>焦了</span>
        </div>
      </div>
      <p className="text-lg font-semibold" role="status">{verdict}</p>
      <p className="text-sm text-ink-soft">
        第 {Math.min(round + 1, HEAT_ROUNDS.length)} / {HEAT_ROUNDS.length} 次，命中 {hits} 次
      </p>
      <button type="button" className={actionClass} onClick={press} disabled={finished}>
        就是現在！
      </button>
    </div>
  );
}

/* ---------- 調味：長按倒入，放開時要剛好到刻度線 ---------- */

const POUR_TARGET = 0.7;
const POUR_RATE = 0.32; // 每秒上升的比例
const POUR_TOLERANCE = 0.35;

export function PourGame({ liquid, onDone }: GameProps & { liquid: string }) {
  const [holding, setHolding] = useState(false);
  const [settled, setSettled] = useState<string | null>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const level = useRef(0);
  const active = useRef(false);

  useEffect(() => {
    if (!holding) return;
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      level.current = Math.min(level.current + ((now - last) / 1000) * POUR_RATE, 1);
      last = now;
      if (fill.current) fill.current.style.transform = `scaleY(${level.current})`;
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [holding]);

  function start() {
    if (settled || active.current) return;
    active.current = true;
    setHolding(true);
  }

  function stop() {
    if (!active.current) return;
    active.current = false;
    setHolding(false);
    const offset = level.current - POUR_TARGET;
    setSettled(Math.abs(offset) <= 0.05 ? "分毫不差！" : offset < 0 ? "再多一點會更好" : "倒得有點多");
    onDone(Math.max(0, 1 - Math.abs(offset) / POUR_TOLERANCE));
  }

  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    if (!event.repeat) start();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex h-60 w-44 flex-col items-center" aria-hidden="true">
        <span className={`pour-stream ${holding ? "is-on" : ""}`} />
        <span className="relative mt-10 block h-48 w-36 overflow-hidden rounded-b-[2.5rem] rounded-t-md border-2 border-ink bg-paper-deep">
          <span ref={fill} className="absolute inset-0 origin-bottom scale-y-0 bg-[#9C5A2A]" />
          <span
            className="absolute inset-x-0 border-t-2 border-dashed border-ink"
            style={{ bottom: `${POUR_TARGET * 100}%` }}
          />
        </span>
      </div>
      <p className="text-lg font-semibold" role="status">
        {settled ?? (holding ? `倒${liquid}中……` : `長按按鈕倒入${liquid}，到虛線時放開`)}
      </p>
      <button
        type="button"
        className={`${actionClass} touch-none select-none`}
        disabled={settled !== null}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          start();
        }}
        onPointerUp={stop}
        onPointerCancel={stop}
        onKeyDown={keyDown}
        onKeyUp={stop}
        onBlur={stop}
      >
        按住倒入
      </button>
    </div>
  );
}

function Meter({ value, label }: { value: number; label: string }) {
  const percent = Math.round(Math.min(value, 1) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className="mt-1.5 h-3 overflow-hidden rounded-full border-2 border-ink bg-paper-deep"
    >
      <div className="h-full bg-moss transition-[width] duration-150" style={{ width: `${percent}%` }} />
    </div>
  );
}
