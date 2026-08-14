"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { vapsPublicMode } from "@/lib/vaps-public-config";

export function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const diagnosisHref = vapsPublicMode === "beta" ? "/beta" : "/diagnosis?mode=official&step=0";

  useEffect(() => {
    let previousY = window.scrollY;

    function onScroll() {
      const currentY = window.scrollY;
      setHidden(currentY > previousY && currentY > 96);
      previousY = currentY;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${hidden ? "hidden" : ""}`}>
      <Link className="site-brand" href="/" aria-label="VAPS トップ">
        <img className="site-brand-mark" src="/images/brand/vaps-logo-mark.png" alt="" />
        <img className="site-brand-type" src="/images/brand/vaps-logotype.png" alt="VAPS" />
      </Link>
      <nav className="site-nav" aria-label="サイト内メニュー">
        <Link href="/types">タイプ一覧</Link>
        <Link href={diagnosisHref}>診断</Link>
        <Link href="/videos">おすすめ動画</Link>
      </nav>
    </header>
  );
}
