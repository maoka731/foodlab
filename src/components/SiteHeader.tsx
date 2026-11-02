import Link from "next/link";

const LINKS = [
  { href: "/#how", label: "怎麼玩" },
  { href: "/kitchen", label: "廚房" },
  { href: "/#recipes", label: "菜譜" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
        <Link href="/" className="flex min-h-11 items-center gap-2.5" aria-label="食驗室 Foodlab 首頁">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-terracotta text-lg font-black text-paper">食</span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-[0.15em]">食驗室</span>
            <span className="hidden font-latin text-sm italic text-ink-soft sm:block">Foodlab</span>
          </span>
        </Link>
        <nav aria-label="主選單">
          <ul className="flex items-center">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-11 items-center px-2.5 tracking-[0.1em] underline-offset-[6px] transition-colors duration-150 hover:text-terracotta hover:underline sm:px-4"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
