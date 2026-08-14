import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="shell">
      <div className="about-page">
        <Link className="text-link" href="/">
          トップへ戻る
        </Link>
        <section className="about-hero">
          <h1>VAPSってなに？</h1>
          <p>
            VAPSは、思考・判断・行動の3つの層から、その人がどのように世界を見て、選び、動くのかを整理するための性格診断です。
          </p>
        </section>

        <div className="about-grid">
          <section>
            <h2>3つの層で見る</h2>
            <p>考え方、判断のしかた、行動の出方を分けて見ることで、表面的な印象だけではなく傾向の構造を読み取ります。</p>
          </section>
          <section>
            <h2>64タイプに分かれる</h2>
            <p>各層の組み合わせによって、VAPSでは64タイプの結果が表示されます。タイプごとにグループやコア説明があります。</p>
          </section>
          <section>
            <h2>状態も見る</h2>
            <p>タイプだけでなく、現在の出方や価値タイプとの一致度も見ます。これにより、その人らしさの現れ方を補足します。</p>
          </section>
        </div>
      </div>
    </main>
  );
}
