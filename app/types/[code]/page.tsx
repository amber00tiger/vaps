import Link from "next/link";
import { notFound } from "next/navigation";
import { CharacterImage } from "@/components/CharacterImage";
import { axisNames, typeData, type Axis } from "@/lib/vaps-data";
import { groupExplanations, typeExplanations } from "@/lib/vaps-explanations";
import { axisKeywords } from "@/lib/vaps-keywords";
import { recommendedVideos } from "@/lib/vaps-videos";
import { readableAccentColor, surfaceAccentColor } from "@/lib/vaps-color-utils";
import { fallbackGroupColor, groupColors } from "@/lib/vaps-group-colors";

type TypePageProps = {
  params: Promise<{ code: string }>;
};

export function generateStaticParams() {
  return Object.keys(typeData).map((code) => ({ code }));
}

export default async function TypeDetailPage({ params }: TypePageProps) {
  const { code } = await params;
  const type = typeData[code.toUpperCase()];
  if (!type) notFound();

  const color = groupColors[type.groupCode] ?? fallbackGroupColor;
  const textColor = readableAccentColor(color);
  const surfaceColor = surfaceAccentColor(color);
  const typeExplanation = typeExplanations[type.code];
  const groupExplanation = groupExplanations[type.groupCode];
  const axes = type.code.split("") as Axis[];
  const siblingTypes = Object.values(typeData).filter((item) => item.groupCode === type.groupCode && item.code !== type.code);
  const similarTypes = getSimilarTypes(type.code, type.groupCode);

  return (
    <main className="shell">
      <div
        className="type-detail-page"
        style={
          {
            "--group-color": color,
            "--group-surface-color": surfaceColor,
            "--group-text-color": textColor,
          } as React.CSSProperties
        }
      >
        <div className="type-page-nav">
          <Link className="text-link" href="/types">
            タイプ一覧へ
          </Link>
          <Link className="text-link" href="/">
            トップへ
          </Link>
        </div>

        <section className="type-detail-hero">
          <div
            className="result-symbol-ghost"
            style={{ backgroundImage: `url(/images/symbols/${type.code}.png)` }}
            aria-hidden="true"
          />
          <div className="result-copy">
            <p className="result-core">{type.core}</p>
            <p className="type-group-label">{type.groupName}グループ</p>
            <h1 className="result-code">
              {type.code}
              <span>{type.typeName}</span>
            </h1>
          </div>
          <CharacterImage typeCode={type.code} />
        </section>

        <section className="section section-detail">
          <div className="explanation-stack">
            <p className="type-intro">
              {typeExplanation?.intro ??
                `${type.typeName}タイプの簡単な説明を表示する領域です。固定解説データが追加されたら、ここに導入文を反映します。`}
            </p>
            <h2>{type.groupName}</h2>
            {groupExplanation ? (
              groupExplanation.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>{type.groupName}グループの説明を表示する領域です。</p>
            )}
            <div className="type-explanation-block">
              <h3>{type.typeName}</h3>
              {typeExplanation ? (
                typeExplanation.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
              ) : (
                <p>{type.typeName}タイプの詳細説明を表示する領域です。</p>
              )}
            </div>
          </div>
        </section>

        <section className="section">
          <h2>タイプの軸</h2>
          <div className="type-axis-list">
            {axes.map((axis) => (
              <span key={axis}>
                <strong>{axis}</strong>
                {axisNames[axis]}
              </span>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>キーワード</h2>
          <div className="keyword-list">
            {axes
              .flatMap((axis) => (axisKeywords[axis] ?? []).slice(0, 4))
              .map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
          </div>
        </section>

        <section className="section">
          <h2>同じグループのタイプ</h2>
          <div className="type-card-grid">
            {siblingTypes.map((item) => (
              <Link className="type-card-link" href={`/types/${item.code}`} key={item.code}>
                <strong>
                  {item.code} {item.typeName}
                </strong>
                <span>{item.core}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>似ているタイプ</h2>
          <div className="type-card-grid">
            {similarTypes.map((item) => (
              <Link className="type-card-link" href={`/types/${item.code}`} key={item.code}>
                <strong>
                  {item.code} {item.typeName}
                </strong>
                <span>{item.core}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>おすすめ動画</h2>
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
      </div>
    </main>
  );
}

function getSimilarTypes(typeCode: string, groupCode: string) {
  return Object.values(typeData)
    .filter((item) => item.code !== typeCode && item.groupCode !== groupCode)
    .map((item) => ({
      ...item,
      matchCount: [...item.code].filter((axis, index) => axis === typeCode[index]).length,
    }))
    .filter((item) => item.matchCount >= 2)
    .sort((a, b) => b.matchCount - a.matchCount || a.code.localeCompare(b.code))
    .slice(0, 4);
}
