import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SwRegister } from "@/components/SwRegister";

export const metadata: Metadata = {
  title: { default: "MUTO Associates", template: "%s · MUTO Associates" },
  description:
    "MUTO Associates — 건축, 글, 공간 기획을 넘나드는 KIM Seung woo의 아틀리에. 지속가능성과 경험의 구조.",
  appleWebApp: { capable: true, title: "MUTO", statusBarStyle: "default" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: "#efefef" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Noto+Sans+KR:wght@400;500&display=swap"
        />
      </head>
      <body>
        {children}
        <SwRegister />
      </body>
    </html>
  );
}
