"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { betaProtectedHref } from "@/lib/vaps-beta-access";

export default function AnalyzingPage() {
  const router = useRouter();

  useEffect(() => {
    const fallback = betaProtectedHref();
    if (fallback) {
      router.replace(fallback);
      return;
    }
    const timer = window.setTimeout(() => router.replace("/result"), 2000);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="analyzing-page">
      <section className="analyzing-card" aria-live="polite">
        <div className="analyzing-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <h1>分析中...</h1>
        <p>回答の傾向を整理しています。</p>
      </section>
    </main>
  );
}
