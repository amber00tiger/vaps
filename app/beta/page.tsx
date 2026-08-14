"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  betaConsentVersion,
  betaStorageKeys,
  createResponseId,
  discordCommunityUrl,
} from "@/lib/vaps-public-config";

export default function BetaPage() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [showError, setShowError] = useState(false);

  function startBeta(event: FormEvent) {
    event.preventDefault();
    if (!accepted) {
      setShowError(true);
      return;
    }

    const responseId = createResponseId("beta");
    window.localStorage.removeItem("vapsAnswers");
    window.localStorage.removeItem("vapsSurvey");
    window.localStorage.removeItem("vapsResultFeedback");
    window.localStorage.setItem("vapsQuestionMode", "beta");
    window.localStorage.setItem(betaStorageKeys.consentAccepted, "yes");
    window.localStorage.setItem(betaStorageKeys.consentVersion, betaConsentVersion);
    window.localStorage.setItem(betaStorageKeys.responseId, responseId);
    router.push("/diagnosis?mode=beta&step=0");
  }

  return (
    <main className="shell beta-shell">
      <form className="beta-gate beta-briefing" onSubmit={startBeta}>
        <span className="beta-label">VAPS βテスト</span>
        <h1>開発中のVAPS診断に参加する</h1>
        <p className="lead">
          このページは正式公開前のテスト診断です。診断結果やタイプ解説はまだ調整中で、今後内容が変わる可能性があります。
        </p>

        <section className="beta-notice-grid" aria-label="βテストの注意事項">
          <article>
            <strong>結果は開発中です</strong>
            <p>タイプ説明、相性、キーワード、共有画像などには仮の内容や曖昧な表現が含まれます。</p>
          </article>
          <article>
            <strong>研究・調査目的で集計します</strong>
            <p>回答、任意アンケート、納得度はVAPS理論と診断サイトの改善・傾向分析に利用します。</p>
          </article>
          <article>
            <strong>個人を特定して公開しません</strong>
            <p>集計結果を公開する場合でも、個人を特定できる形では公開しません。</p>
          </article>
          <article>
            <strong>医療・心理診断ではありません</strong>
            <p>この診断は医療行為、心理診断、カウンセリング、能力判定を目的としたものではありません。</p>
          </article>
        </section>

        <div className="beta-id-note">
          <strong>回答IDについて</strong>
          <p>
            診断開始時に回答IDを発行します。結果ページに表示されるIDをDiscordやDMで伝えると、個別解説や不具合確認に使えます。
          </p>
        </div>

        <label className="consent-check">
          <input
            checked={accepted}
            onChange={(event) => {
              setAccepted(event.target.checked);
              setShowError(false);
            }}
            type="checkbox"
          />
          <span>
            <Link href="/beta/terms" target="_blank">
              βテスト参加規約
            </Link>
            を読み、研究・調査目的での集計と、結果が開発中で変更される可能性があることに同意します。
          </span>
        </label>
        {showError && <p className="beta-error">参加するには同意チェックが必要です。</p>}

        <div className="beta-actions">
          <button className="button" type="submit">
            同意して診断を始める
          </button>
          <a className="button secondary" href={discordCommunityUrl} rel="noreferrer" target="_blank">
            Discordを見る
          </a>
        </div>
      </form>
    </main>
  );
}
