import type { IngredientId, Recipe } from "@/data/kitchen";

const INK = "#2B2622";

type Shape = { d: string; fill?: string };

const ART: Record<IngredientId, Shape[]> = {
  tomato: [
    { d: "M50 27c23-5 37 12 35 31-2 18-17 28-35 28S17 76 15 58c-2-19 12-36 35-31z", fill: "#C8492F" },
    { d: "M30 46c3-6 8-9 13-10" },
    { d: "M50 29l-13-8 10 1-3-9 9 8 9-8-3 9 10-1-13 8-3 3z", fill: "#6F8150" },
  ],
  egg: [
    { d: "M50 13c17 0 31 27 31 45 0 18-14 30-31 30S19 76 19 58c0-18 14-45 31-45z", fill: "#EBD3AE" },
    { d: "M35 40c2-6 5-10 9-13" },
    { d: "M61 69c5-1 9-5 10-10" },
  ],
  scallion: [
    { d: "M36 12c-2 22-1 44 6 64 2 7 8 13 14 12 7-1 7-9 4-15-8-18-7-40-4-59l-5 16-5-20-4 18z", fill: "#7E9458" },
    { d: "M42 76c2 7 8 13 14 12 7-1 7-9 4-15-6 3-12 4-18 3z", fill: "#FAF3E3" },
    { d: "M47 30c-1 12 0 24 3 34" },
    { d: "M50 88l-3 7M56 88l1 7M60 86l4 6" },
  ],
  tofu: [
    { d: "M18 38l32-16 34 14-2 34-34 18-30-16z", fill: "#FAF3E3" },
    { d: "M18 38l30 14 36-16M48 52l0 36" },
    { d: "M30 58l5 3M33 68l5 3M62 60l6-3M62 72l6-3" },
  ],
  mushroom: [
    { d: "M12 52c0-22 18-38 38-38s38 16 38 38c0 7-14 10-38 10S12 59 12 52z", fill: "#8C5A36" },
    { d: "M38 61c1 9-1 19-3 24 8 4 22 4 30 0-2-5-4-15-3-24", fill: "#EADFC8" },
    { d: "M33 32a4 4 0 1 0 .1 0zM60 28a5 4 0 1 0 .1 0zM70 44a3 3 0 1 0 .1 0z" },
  ],
  rice: [
    { d: "M12 52h76c0 22-16 38-38 38S12 74 12 52z", fill: "#A9BA7E" },
    { d: "M16 52c2-20 18-34 34-34s32 14 34 34z", fill: "#FAF3E3" },
    { d: "M32 40l5-3M46 30l5 2M62 38l5 3M50 44l-4 3M36 30l3-2" },
    { d: "M36 90h28" },
  ],
  noodles: [
    { d: "M14 58h72c0 18-15 32-36 32S14 76 14 58z", fill: "#C8492F" },
    { d: "M20 58c0-10 10-5 13-13 3-9 12-5 14-13 3 9 11 4 15 13 3 8 15 3 17 13z", fill: "#E9B44C" },
    { d: "M30 58c3-7 7-8 9-13M45 58c0-7 3-11 3-17M60 58c-1-6-3-9-5-13" },
    { d: "M58 8L80 52M70 6L86 50" },
  ],
  chicken: [
    { d: "M64 14c14 4 22 20 15 35-6 14-20 18-31 17l-13 11c1 7-5 12-10 10-3-1-4-4-3-7-4 1-8-2-8-6 0-5 6-8 12-6l11-13c-2-12 4-27 15-35 3-2 8-2 12-1z", fill: "#C98F52" },
    { d: "M58 28c7-1 13 4 13 11" },
  ],
  garlic: [
    { d: "M50 14c1 10 7 15 16 22 12 9 16 22 8 35-6 9-16 13-24 13s-18-4-24-13c-8-13-4-26 8-35 9-7 15-12 16-22z", fill: "#EFE3C8" },
    { d: "M50 40c-8 10-10 28-4 44M50 40c8 10 10 28 4 44" },
    { d: "M42 84l-2 7M50 85v7M58 84l2 7" },
  ],
  chili: [
    { d: "M68 26c9 2 14 11 11 21-7 22-30 38-62 41 20-11 34-28 39-52 1-7 6-11 12-10z", fill: "#B3301E" },
    { d: "M60 28c1-4 5-6 10-5s9 5 8 10c-5-5-12-7-18-5z", fill: "#6F8150" },
    { d: "M70 23c1-5 4-9 9-11" },
    { d: "M64 40c-3 12-10 23-19 31" },
  ],
  basil: [
    { d: "M50 14C28 18 16 38 22 60c14 2 29-8 34-26 2-8 0-15-6-20z", fill: "#4C6238" },
    { d: "M56 48c14-8 28-6 32 4-6 14-21 21-34 17-3-7-3-14 2-21z", fill: "#6F8150" },
    { d: "M50 14c-4 14-13 30-23 42" },
    { d: "M54 69c8-5 18-11 30-16" },
    { d: "M40 62c4 9 9 18 10 28" },
  ],
  greens: [
    { d: "M50 90c-11-8-14-22-13-34-10-4-20-16-17-29 3-11 15-18 30-18s27 7 30 18c3 13-7 25-17 29 1 12-2 26-13 34z", fill: "#6F8150" },
    { d: "M37 56c-1 12 2 26 13 34 11-8 14-22 13-34-8 3-18 3-26 0z", fill: "#EADFC8" },
    { d: "M50 22v48M50 38l-12-9M50 38l12-9M50 50l-9-6M50 50l9-6" },
  ],
};

/** 手繪感：填色略微錯位（像套印不準的版畫），再疊一層墨線。 */
export function IngredientArt({
  id,
  className,
  title,
}: {
  id: IngredientId;
  className?: string;
  title?: string;
}) {
  const shapes = ART[id];
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g filter="url(#wobble)">
        <g transform="translate(3 3)">
          {shapes
            .filter((shape) => shape.fill)
            .map((shape) => (
              <path key={shape.d} d={shape.d} fill={shape.fill} />
            ))}
        </g>
        <g fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {shapes.map((shape) => (
            <path key={shape.d} d={shape.d} />
          ))}
        </g>
      </g>
    </svg>
  );
}

const round = (value: number) => Number(value.toFixed(1));

/** 以黃金角排列配料：分布自然，且伺服器與瀏覽器算出的位置完全相同。 */
function scatter(index: number, total: number, spread: number) {
  const angle = index * 2.39996;
  const radius = spread * Math.sqrt((index + 0.6) / total);
  return {
    x: round(100 + Math.cos(angle) * radius),
    y: round(100 + Math.sin(angle) * radius),
    rotate: round((index * 67) % 360),
  };
}

function Topping({ shape, color, x, y, rotate }: { shape: string; color: string; x: number; y: number; rotate: number }) {
  const transform = `translate(${x} ${y}) rotate(${rotate})`;
  const line = { stroke: INK, strokeWidth: 1.4, strokeLinejoin: "round" as const };
  if (shape === "ring") {
    return <circle transform={transform} r="3.6" fill="none" stroke={color} strokeWidth="2.6" />;
  }
  if (shape === "leaf") {
    return <path transform={transform} d="M-9 0C-4-8 5-8 10 0 5 7-4 7-9 0z" fill={color} {...line} />;
  }
  if (shape === "dot") {
    return <ellipse transform={transform} rx="4.6" ry="3.2" fill={color} {...line} />;
  }
  return <path transform={transform} d="M-8-5L7-7 9 5-5 8z" fill={color} {...line} />;
}

export function DishArt({ recipe, className, title }: { recipe: Recipe; className?: string; title?: string }) {
  const toppings = recipe.bits.flatMap((bit) =>
    Array.from({ length: bit.count }, () => bit),
  );
  // 交錯排列不同配料，避免同一種全擠在中央
  const mixed = toppings
    .map((bit, index) => ({ bit, order: (index * 7) % toppings.length }))
    .sort((a, b) => a.order - b.order);
  const foodRadius = recipe.vessel === "plate" ? 66 : 72;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g filter="url(#wobble)">
        {recipe.vessel === "pan" && (
          <path d="M178 118l20 8" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        )}
        <circle cx="103" cy="103" r="90" fill={recipe.vessel === "pan" ? "#3B3530" : "#A9BA7E"} />
        <circle cx="100" cy="100" r="90" fill={recipe.vessel === "pan" ? "#4A423B" : "#FAF3E3"} stroke={INK} strokeWidth="2.4" />
        {recipe.vessel === "plate" && (
          <circle cx="100" cy="100" r="76" fill="none" stroke="#5A6B45" strokeWidth="1.4" strokeDasharray="2 7" strokeLinecap="round" />
        )}
        <path
          d={`M${100 - foodRadius} 100c0-${foodRadius * 0.6} ${foodRadius * 0.4}-${foodRadius} ${foodRadius}-${foodRadius}s${foodRadius} ${foodRadius * 0.45} ${foodRadius} ${foodRadius}-${foodRadius * 0.5} ${foodRadius}-${foodRadius} ${foodRadius}-${foodRadius}-${foodRadius * 0.45}-${foodRadius}-${foodRadius}z`}
          fill={recipe.base}
          stroke={INK}
          strokeWidth="1.6"
        />
        {recipe.texture === "noodle" && (
          <g fill="none" stroke="#F2DDA4" strokeWidth="3.4" strokeLinecap="round">
            <path d="M55 95c20-32 70-32 90 0" />
            <path d="M52 112c22-28 74-28 96 0" />
            <path d="M60 128c20-22 62-22 82 0" />
            <path d="M72 78c16-14 42-14 58 0" />
            <path d="M74 142c16-12 38-12 54 0" />
          </g>
        )}
        {recipe.texture === "rice" &&
          Array.from({ length: 46 }, (_, index) => {
            const point = scatter(index, 46, foodRadius * 0.85);
            return (
              <ellipse
                key={index}
                transform={`translate(${point.x} ${point.y}) rotate(${point.rotate})`}
                rx="3.2"
                ry="1.6"
                fill="#FFFAEE"
              />
            );
          })}
        {recipe.texture === "soup" && (
          <g fill="none" stroke="#FFFAEE" strokeOpacity="0.55" strokeWidth="1.8" strokeLinecap="round">
            <path d="M58 86c16-8 30 8 46 0" />
            <path d="M96 128c14-8 28 8 44 0" />
          </g>
        )}
        {mixed.map(({ bit }, index) => {
          const point = scatter(index, mixed.length, foodRadius * 0.8);
          return <Topping key={index} shape={bit.shape} color={bit.color} {...point} />;
        })}
      </g>
    </svg>
  );
}

export function Star({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 5l6 13 14 2-10 10 2 14-12-7-12 7 2-14L4 20l14-2z"
        fill={filled ? "#C9962F" : "none"}
        stroke={INK}
        strokeWidth="2.2"
        strokeLinejoin="round"
        filter="url(#wobble)"
      />
    </svg>
  );
}

/** 全站共用的手繪抖動濾鏡；放在 layout，所有插畫都能引用。 */
export function WobbleFilter() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" />
        <feDisplacementMap in="SourceGraphic" scale="2.4" />
      </filter>
    </svg>
  );
}
