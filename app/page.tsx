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
  }, []);

  function startNew() {
    if (vapsPublicMode === "beta") {
      router.push("/beta");
      return;
    }
    window.localStorage.removeItem("vapsAnswers");
    window.localStorage.removeItem("vapsSurvey");
    window.localStorage.removeItem("vapsResultFeedback");
    window.localStorage.setItem("vapsQuestionMode", "official");
    router.push("/diagnosis?mode=official&step=0");
  }

  return (
    <main className="shell">
      <div className="container hero">
        <div>
          <h1>VAPS64タイプ性格診断</h1>
          <p className="lead">
            思考・判断・行動の3層から、あなたの価値観と行動傾向を読み取る診断です。
            簡易診断、詳細診断、任意アンケートの順に進み、最後にタイプ結果を表示します。
          </p>
          <div className="home-menu">
            <button className="home-menu-item primary" type="button" onClick={startNew}>
              <strong>新しく質問に答える</strong>
              <span>保存済みの回答を消して、最初から診断します。</span>
            </button>
            <Link className={`home-menu-item ${hasPrevious ? "" : "disabled"}`} href={hasPrevious ? "/diagnosis?step=0" : "#"}>
              <strong>今までの回答を編集する</strong>
              <span>前回の回答を残したまま、質問画面から編集します。</span>
            </Link>
            <Link className={`home-menu-item ${hasPrevious ? "" : "disabled"}`} href={hasPrevious ? "/result" : "#"}>
              <strong>前回の結果を見る</strong>
              <span>保存されている回答から、結果ページを表示します。</span>
            </Link>
          </div>
          <Link className="text-link" href="/about">
            VAPSってなに？
          </Link>
          <Link className="text-link home-sub-link" href="/types">
            タイプ一覧を見る
          </Link>
        </div>
      </div>
    </main>
  );
}
