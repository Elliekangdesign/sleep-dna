import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import StarField from "@/components/StarField";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "수면 DNA — 나의 수면 기질 찾기",
  description:
    "사주와 별자리로 타고난 나의 잠 기질을 알아보세요. 태어날 때부터 정해진 나만의 수면 DNA를 분석해 드립니다.",
  openGraph: {
    title: "수면 DNA — 나의 수면 기질 찾기",
    description: "태어날 때부터 정해진 나만의 수면 DNA를 분석해 드립니다.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full antialiased ${notoSansKR.variable}`}>
      <body className="min-h-full flex flex-col" style={{ background: "#070712" }}>
        <StarField />
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}
