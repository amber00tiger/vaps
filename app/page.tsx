"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { vapsPublicMode } from "@/lib/vaps-public-config";

export default function Home() {
  const router = useRouter();
  const [hasPrevious, setHasPrevious] = useState(false);

  useEffect(() => {
    setHasPrevious(Boolean(window.localStorage.getItem("vapsAnswers")));
    if (vapsPublicMode === "beta") {
      router.replace("/beta");
    }
  }, [router]);

  function clearDiagnosisState() {
    window.localStorage.removeItem("vapsAnswers");
    window.localStorage.removeItem("vapsSurvey");
    window.localStorage.removeItem("vapsResultFeedback");
    window.localStorage.removeItem("vapsQuestionOrderSeed");
  }

  function startNew() {
    if (vapsPublicMode === "beta") {
      router.push("/beta");
      return;
    }
    clearDiagnosisState();
    window.localStorage.setItem("vapsQuestionMode", "official");
    router.push("/diagnosis?mode=official&step=0");
  }

  return (
    <main className="shell home-shell">
      <section className="home-hero container">
        <div className="home-hero-copy">
          <p className="hero-kicker">思考・判断・行動の3層から、あなたの価値観と行動傾向を読み解く</p>
          <h1>VAPS64</h1>
          <p className="hero-subtitle">タイプ性格診断</p>
          <p className="lead">
            簡易診断から詳細診断まで。あなたのタイプを、理論に基づいて分析します。
          </p>
          <div className="home-menu compact">
            <button className="home-menu-item primary" type="button" onClick={startNew}>
              <strong>診断をはじめる</strong>
              <span>新しい回答で最初から診断します。</span>
            </button>
            <Link className={`home-menu-item ${hasPrevious ? "" : "disabled"}`} href={hasPrevious ? "/diagnosis?step=0" : "#"}>
              <strong>前回の回答を編集する</strong>
              <span>保存済みの回答を続きから編集します。</span>
            </Link>
            <Link className={`home-menu-item ${hasPrevious ? "" : "disabled"}`} href={hasPrevious ? "/result" : "#"}>
              <strong>前回の結果を見る</strong>
              <span>このブラウザに残っている結果を表示します。</span>
            </Link>
          </div>
        </div>
        <div className="home-visual" aria-hidden="true">
          <div className="home-arch">
            <img src="/images/brand/vaps-logo-mark.png" alt="" />
          </div>
        </div>
      </section>

      <section className="home-overview container">
        <div>
          <h2>VAPSは、3つの視点で人を捉えます。</h2>
          <Link className="text-link" href="/about">もっと詳しく見る</Link>
        </div>
        <div className="home-pillar-grid">
          <article>
            <strong>思考</strong>
            <span>THINKING</span>
            <p>何を見るか、どんな情報を大事にするか</p>
          </article>
          <article>
            <strong>判断</strong>
            <span>JUDGEMENT</span>
            <p>どう決めるか、何を基準に選ぶか</p>
          </article>
          <article>
            <strong>行動</strong>
            <span>ACTION</span>
            <p>どう動くか、どんな行動をとるか</p>
          </article>
        </div>
      </section>

      <section className="home-type-strip container">
        <div>
          <span>12</span>
          <p>の軸</p>
        </div>
        <div>
          <span>16</span>
          <p>のグループ</p>
        </div>
        <div>
          <span>64</span>
          <p>のタイプ</p>
        </div>
        <Link className="text-link" href="/types">タイプ一覧を見る</Link>
      </section>
    </main>
  );
}
