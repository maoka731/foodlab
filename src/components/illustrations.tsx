import Image from "next/image";
import type { IngredientId, Recipe } from "@/data/kitchen";

const INK = "#2B2622";

export function IngredientArt({
  id,
  className = "",
  title,
}: {
  id: IngredientId;
  className?: string;
  title?: string;
}) {
  return (
    <Image
      src={`/images/ingredients/${id}.png`}
      alt={title ?? ""}
      width={400}
      height={400}
      sizes="240px"
      draggable={false}
      className={`object-contain ${className}`}
    />
  );
}

export function DishArt({ recipe, className = "", title }: { recipe: Recipe; className?: string; title?: string }) {
  return (
    <Image
      src={`/images/dishes/${recipe.id}.png`}
      alt={title ?? ""}
      width={720}
      height={720}
      sizes="(min-width: 1024px) 512px, 90vw"
      draggable={false}
      className={`object-contain ${className}`}
    />
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
