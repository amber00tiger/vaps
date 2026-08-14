import Link from "next/link";
import { recommendedVideos } from "@/lib/vaps-videos";

export default function VideosPage() {
  return (
    <main className="shell">
      <div className="container video-page">
        <header className="type-index-hero">
          <h1>おすすめ動画</h1>
          <p>診断結果やVAPS理論の理解を深める動画を置くためのページです。動画IDが入るとYouTube埋め込みに切り替わります。</p>
        </header>

        <section className="section">
          <div className="video-grid">
            {recommendedVideos.map((video) => (
              <article className="video-card" key={video.id}>
                {video.youtubeId ? (
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                  />
                ) : (
                  <div className="video-placeholder">YouTube</div>
                )}
                <strong>{video.title}</strong>
              </article>
            ))}
          </div>
        </section>

        <Link className="text-link" href="/">
          トップへ戻る
        </Link>
      </div>
    </main>
  );
}
