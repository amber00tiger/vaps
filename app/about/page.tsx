import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="shell">
      <div className="about-page">
        <Link className="text-link" href="/">
          トップへ戻る
        </Link>
        <section className="about-hero">
          <h1>VAPSとは</h1>
          <p>
            VAPSは、ユングのタイプ論から着想を得て、新たに考えている独自のタイプ理論です。
            既存の16タイプ診断やMBTI風の結果表示で起こりやすい誤解を減らすため、
            別の理論と同一の名称や分類を使わず、独自の仕組みとして制作しています。
          </p>
        </section>

        <article className="about-content">
          <section>
            <h2>3つの面を見る</h2>
            <p>
              VAPSでは、人の傾向を思考の面、行動の面、その間でどのように判断するかに関わる面から見ます。
              この3つの層に、それぞれどのような特性が表れやすいのかを見ていきます。
            </p>
          </section>
          <section>
            <h2>性格をグラデーションとして扱う</h2>
            <p>
              VAPSでは、各軸の大きさを順位やグラフで表します。人の性格は固定されたタイプや単純な二極の数値だけで
              説明できるものではなく、複数の傾向が重なり合うものとして扱います。
            </p>
          </section>
          <section>
            <h2>何のために作っているのか</h2>
            <p>
              VAPSの目的は、人を固定された型にはめることではありません。
              自己理解や他者理解を深め、違いを理解し、コミュニケーションを少しでも円滑にするためのきっかけを作ることです。
            </p>
          </section>
          <section>
            <h2>誤解を減らすために</h2>
            <p>
              VAPSは、既存の理論名や分類名をそのまま使わず、独自の名称と分類で設計しています。
              実際に検証を繰り返しながら、できるだけ悪影響の少ない形を目指して制作を進めています。
            </p>
          </section>
          <section>
            <h2>注意</h2>
            <p>
              VAPSは、心理学・医学・精神医学などの学術的根拠に基づく診断ではありません。
              医療・心理診断、職業適性診断、能力評価、人格評価として利用するものではなく、
              自己理解やコミュニケーションのための参考として楽しむことを想定しています。
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
