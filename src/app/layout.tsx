import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Serif_TC } from "next/font/google";
import { WobbleFilter } from "@/components/illustrations";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const notoSerif = Noto_Serif_TC({
  variable: "--font-noto-serif",
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
  preload: false,
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["500"],
  style: ["italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "食驗室 Foodlab｜一本可以動手的料理雜誌",
  description: "挑選插畫食材，配出一道菜，再親手切、炒、調味，完成屬於你的料理。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant"
      data-scroll-behavior="smooth"
      className={`${notoSerif.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <WobbleFilter />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
