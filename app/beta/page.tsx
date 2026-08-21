"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { betaConsentVersion, betaStorageKeys, createResponseId, discordCommunityUrl } from "@/lib/vaps-public-config";

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
    window.localStorage.removeItem("vapsQuestionOrderSeed");
    window.localStorage.setItem("vapsQuestionMode", "beta");
    window.localStorage.setItem(betaStorageKeys.consentAccepted, "yes");
    window.localStorage.setItem(betaStorageKeys.consentVersion, betaConsentVersion);
    window.localStorage.setItem(betaStorageKeys.responseId, responseId);
    router.push("/diagnosis?mode=beta&step=0");
  }

  return (
    <main className="shell beta-shell">
      <form className="beta-gate beta-briefing" onSubmit={startBeta}>
        <section className="beta-hero">
          <div className="beta-hero-copy">
            <span className="beta-label">VAPS βテスト</span>
            <p className="beta-kicker">正式公開前の検証版</p>
            <h1>VAPS βテスト</h1>
            <p className="lead">
              VAPSは、ユングのタイプ論から着想を得て制作している、独自理論に基づくタイプ診断です。
              現在公開しているものは正式版ではなく、設問・診断結果・解説文・表示内容を検証するためのβテスト版です。
            </p>
            <p className="lead">
              診断結果は最後まで確認できますが、今後の検証によって内容が変更される可能性があります。
            </p>
            <Link className="button secondary beta-about-button" href="/about">
              VAPSとは
            </Link>
          </div>
        </section>

        <section className="beta-notice-grid" aria-label="βテストの注意事項">
          <article>
            <strong>所要時間</strong>
            <p>
              所要時間は<strong>約7〜10分</strong>です。落ち着いて回答できるタイミングでの参加をおすすめします。
            </p>
          </article>
          <article>
            <strong>診断の内容</strong>
            <p>
              自分ではどちらに近いと感じるかを選ぶ<strong>抽象的な2択質問</strong>と、
              日常での考え方や行動傾向について答える<strong>具体的な5段階質問</strong>があります。
            </p>
          </article>
          <article>
            <strong>共有について</strong>
            <p>
              <strong>診断結果画像や結果ページ</strong>は共有して問題ありません。
              設問内容や検証中の資料は転載しないでください。
            </p>
          </article>
        </section>

        <section className="beta-start-panel">
          <div className="beta-id-note">
            <strong>参加前に確認してください</strong>
            <ul className="beta-check-list">
              <li>VAPSは医療・心理診断ではありません。</li>
              <li>制作者は心理学などを専門的に学んでいる者ではありません。</li>
              <li>回答データ、診断結果、各軸スコア、送信日時などは、研究・調査・開発目的で保存・集計します。</li>
              <li>送信後、参加者都合による個別の削除依頼には原則対応できません。</li>
              <li>表示名や自由記述欄に、本名、住所、連絡先、所属、SNS IDなどを入力しないでください。</li>
            </ul>
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
                βテスト参加規約およびデータ取扱方針
              </Link>
              を確認し、回答データの利用と、送信後の個別削除依頼に原則対応できないことに同意します。
            </span>
          </label>
          {showError && <p className="beta-error">参加するには同意チェックが必要です。</p>}

          <div className="beta-actions">
            <button className="button" disabled={!accepted} type="submit">
              βテストを開始する
            </button>
          </div>
        </section>

        <footer className="beta-footer">
          <p>βテストのお知らせや交流はコミュニティで行う場合があります。</p>
          <a href={discordCommunityUrl} rel="noreferrer" target="_blank">
            コミュニティを見る
          </a>
        </footer>
      </form>
    </main>
  );
}

