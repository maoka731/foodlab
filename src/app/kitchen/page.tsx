import type { Metadata } from "next";
import { Kitchen } from "@/components/Kitchen";

export const metadata: Metadata = {
  title: "廚房｜食驗室 Foodlab",
  description: "挑選食材、親手下廚，完成後還能看這道菜的解剖報告與營養分析。",
};

export default function KitchenPage() {
  return (
    <main className="flex-1 overflow-x-clip">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 lg:py-16">
        <div className="mb-10 flex items-end justify-between gap-4 border-b-2 border-ink pb-4">
          <h1 className="text-4xl font-black sm:text-5xl">廚房</h1>
          <p className="font-latin text-lg text-terracotta italic">The Kitchen</p>
        </div>
        <Kitchen />
      </div>
    </main>
  );
}
