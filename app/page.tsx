"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { typeData } from "@/lib/vaps-data";
import { vapsPublicMode } from "@/lib/vaps-public-config";

const typePool = Object.values(typeData);

export default function Home() {
  const router = useRouter();
  const [hasPrevious, setHasPrevious] = useState(false);
  const [featuredTypes, setFeaturedTypes] = useState(typePool.slice(0, 5));

  useEffect(() => {
    setHasPrevious(Boolean(window.localStorage.getItem("vapsAnswers")));
    setFeaturedTypes([...typePool].sort(() => Math.random() - 0.5).slice(0, 5));
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
            {hasPrevious && (
              <Link className="home-menu-item" href="/result">
                <strong>前回の結果を見る</strong>
                <span>このブラウザに残っている結果を表示します。</span>
              </Link>
            )}
          </div>
        </div>
        <div className="home-visual" aria-label="トップビジュアル差し替え予定領域">
          <div className="home-visual-slot">
            <div className="home-visual-placeholder" />
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
            <i className="home-pillar-icon" aria-hidden="true">T</i>
            <strong>思考</strong>
            <span>THINKING</span>
            <p>何を見るか、どんな情報を大事にするか</p>
          </article>
          <article>
            <i className="home-pillar-icon" aria-hidden="true">J</i>
            <strong>判断</strong>
            <span>JUDGEMENT</span>
            <p>どう決めるか、何を基準に選ぶか</p>
          </article>
          <article>
            <i className="home-pillar-icon" aria-hidden="true">A</i>
            <strong>行動</strong>
            <span>ACTION</span>
            <p>どう動くか、どんな行動をとるか</p>
          </article>
        </div>
      </section>

      <section className="home-type-strip container">
        <div>
          <i aria-hidden="true" />
          <span>12</span>
          <p>の軸</p>
          <small>人の価値観や行動を12の軸で分析</small>
        </div>
        <div>
          <i aria-hidden="true" />
          <span>16</span>
          <p>のグループ</p>
          <small>似た傾向を持つ人を16グループに分類</small>
        </div>
        <div>
          <i aria-hidden="true" />
          <span>64</span>
          <p>のタイプ</p>
          <small>掛け合わせによって生まれる64の個性タイプ</small>
        </div>
      </section>

      <section className="home-featured-types container" aria-label="ランダムタイプ">
        <div className="home-section-heading">
          <h2>64人、ぜんぶ違う。</h2>
          <Link className="text-link" href="/types">タイプ一覧を見る</Link>
        </div>
        <div className="home-random-types">
          {featuredTypes.map((type) => (
            <Link className="home-random-type" href={`/types/${type.code}`} key={type.code}>
              <i aria-hidden="true" />
              <span>{type.code}</span>
              <strong>{type.typeName}</strong>
              <p>{type.core}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-bottom-cta container">
        <div>
          <span aria-hidden="true" />
          <h2>さあ、はじめよう。</h2>
          <p>いくつかの質問に答えるだけで、あなたのタイプが見えてきます。</p>
        </div>
        <button className="button" type="button" onClick={startNew}>
          診断をはじめる
        </button>
      </section>
    </main>
  );
}
