import Link from "next/link";
import { discordCommunityUrl } from "@/lib/vaps-public-config";

export default function BetaTermsPage() {
  return (
    <main className="shell">
      <article className="terms-panel">
        <span className="beta-label">VAPS βテスト</span>
        <h1>βテスト参加規約</h1>
        <p>
          VAPS βテストは、正式公開前の開発・検証を目的としたテスト診断です。
          参加前に以下の内容を確認してください。
        </p>

        <section>
          <h2>研究・調査目的での利用</h2>
          <p>
            回答内容、診断結果、任意アンケート、納得度回答は、VAPS理論および診断サイトの改善、
            傾向分析、研究・調査目的で集計・利用する場合があります。
          </p>
        </section>

        <section>
          <h2>個人情報と公開範囲</h2>
          <p>
            集計結果を公開する場合、個人を特定できる形では公開しません。表示名は結果ページや共有画像での表示を目的とした任意入力です。
          </p>
        </section>

        <section>
          <h2>開発中の結果について</h2>
          <p>
            診断結果、タイプ解説、相性、キーワード、共有画像などの内容は開発中であり、今後変更される可能性があります。
          </p>
        </section>

        <section>
          <h2>医療・心理診断ではないこと</h2>
          <p>
            本診断は医療行為、心理診断、カウンセリング、適性検査、能力判定を目的としたものではありません。
            結果は自己理解や創作・コミュニケーションの参考としてご利用ください。
          </p>
        </section>

        <section>
          <h2>回答IDと個別解説</h2>
          <p>
            診断開始時に回答IDを発行します。個別解説や問い合わせを希望する場合は、結果ページに表示される回答IDを控え、
            Discordまたは指定の連絡先でお伝えください。
          </p>
        </section>

        <div className="button-row">
          <Link className="button" href="/beta">
            βテスト入口に戻る
          </Link>
          <a className="button secondary" href={discordCommunityUrl} rel="noreferrer" target="_blank">
            Discordを見る
          </a>
        </div>
      </article>
    </main>
  );
}
