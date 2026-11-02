"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/* 所有圖層共用一個 scroll 監聽與 rAF，每幀只寫一次 transform。 */
const layers = new Set<() => void>();
let frame = 0;

function flush() {
  frame = 0;
  layers.forEach((update) => update());
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(flush);
}

function subscribe(update: () => void) {
  if (layers.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }
  layers.add(update);
  update();
  return () => {
    layers.delete(update);
    if (layers.size === 0) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    }
  };
}

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** 每捲動 1px 位移多少 px；正值比頁面慢，負值比頁面快。 */
  speed: number;
  axis?: "x" | "y";
  /** 每捲動 1px 旋轉幾度。 */
  spin?: number;
  /** 從頁面頂端起算（首屏用，載入時不會有位移）；預設以元素到視窗中央的距離計算。 */
  fromTop?: boolean;
};

export function Parallax({ children, className = "", speed, axis = "y", spin = 0, fromTop = false }: ParallaxProps) {
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = element.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let appliedY = 0;
    return subscribe(() => {
      const rect = node.getBoundingClientRect();
      const distance = fromTop
        ? window.scrollY
        : window.innerHeight / 2 - (rect.top + rect.height / 2 - appliedY);
      const shift = distance * speed;
      appliedY = axis === "y" ? shift : 0;
      const move = axis === "y" ? `0, ${shift}px, 0` : `${shift}px, 0, 0`;
      node.style.transform = `translate3d(${move}) rotate(${distance * spin}deg)`;
    });
  }, [speed, axis, spin, fromTop]);

  return (
    <div ref={element} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
