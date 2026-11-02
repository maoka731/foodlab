import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-8 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="text-3xl font-black tracking-[0.15em]">食驗室</p>
          <p className="mt-1 font-latin text-lg italic text-paper/75">Foodlab — a small kitchen on the internet</p>
          <p className="mt-5 max-w-sm leading-relaxed text-paper/75">
            一間開在網路上的小廚房。沒有標準答案，只有今天想吃的味道。
          </p>
        </div>
        <nav aria-label="頁尾選單">
          <p className="text-sm tracking-[0.2em] text-paper/60">逛逛</p>
          <ul className="mt-3 space-y-1">
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/#how">怎麼玩</Link></li>
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/kitchen">走進廚房</Link></li>
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/#recipes">菜譜索引</Link></li>
          </ul>
        </nav>
        <div>
          <p className="text-sm tracking-[0.2em] text-paper/60">版權頁</p>
          <p className="mt-3 leading-relaxed text-paper/75">
            第一號・秋日刊
            <br />
            插畫與文字皆為本站所作
          </p>
        </div>
      </div>
      <div className="border-t border-paper/20">
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-paper/60 sm:px-8">© 2026 Foodlab 食驗室</p>
      </div>
    </footer>
  );
}
