import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "VAPS64タイプ性格診断",
  description: "思考・判断・行動の3層から自分の傾向を知るVAPS診断サイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
