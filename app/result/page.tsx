"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { CharacterImage } from "@/components/CharacterImage";
import {
  axisDescriptions,
  axisNames,
  matchDescriptions,
  stateDescriptions,
  typeData,
  type Axis,
} from "@/lib/vaps-data";
import { axisColors, fallbackAxisColor } from "@/lib/vaps-axis-colors";
import { betaProtectedHref } from "@/lib/vaps-beta-access";
import { appendAnalyticsRecord, buildAnalyticsRecord, type AnalyticsSource } from "@/lib/vaps-analytics";
import { readableAccentColor, surfaceAccentColor } from "@/lib/vaps-color-utils";
import { groupExplanations, typeExplanations } from "@/lib/vaps-explanations";
import { axisKeywords } from "@/lib/vaps-keywords";
import { recommendedVideos } from "@/lib/vaps-videos";
import { calculateResult, type StoredAnswers, type VapsResult } from "@/lib/vaps-scoring";
import { fallbackGroupColor, groupColors } from "@/lib/vaps-group-colors";
import {
  betaConsentVersion,
  betaStorageKeys,
  createResponseId,
  discordCommunityUrl,
  vapsPublicMode,
} from "@/lib/vaps-public-config";
import { submitDiagnosisResponse, submitResultFeedback } from "@/lib/vaps-supabase";

type Survey = {
  displayName?: string;
};

type RelatedType = {
  code: string;
  typeName: string;
  core: string;
};

const graphAxisOrder: Axis[] = ["H", "R", "A", "E", "S", "F", "C", "P", "O", "L", "G", "M"];

export default function ResultPage() {
  const [answers, setAnswers] = useState<StoredAnswers | null>(null);
  const [survey, setSurvey] = useState<Survey>({});
  const [activeSection, setActiveSection] = useState("ranking");
  const [showResultHeader, setShowResultHeader] = useState(false);
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [analyticsSource, setAnalyticsSource] = useState<AnalyticsSource>("official");
  const [responseId, setResponseId] = useState("");
  const result = useMemo<VapsResult | null>(() => (answers ? calculateResult(answers) : null), [answers]);

  useEffect(() => {
    const fallback = betaProtectedHref();
    if (fallback) {
      location.replace(fallback);
      return;
    }
    const answerRaw = window.localStorage.getItem("vapsAnswers");
    const surveyRaw = window.localStorage.getItem("vapsSurvey");
    const modeRaw = window.localStorage.getItem("vapsQuestionMode");
    if (answerRaw) setAnswers(JSON.parse(answerRaw) as StoredAnswers);
    if (surveyRaw) setSurvey(JSON.parse(surveyRaw) as Survey);
    setAnalyticsSource(modeRaw === "beta" ? "beta" : "official");
    const storedResponseId = window.localStorage.getItem(betaStorageKeys.responseId);
    const nextResponseId = storedResponseId ?? createResponseId(modeRaw === "beta" ? "beta" : "official");
    window.localStorage.setItem(betaStorageKeys.responseId, nextResponseId);
    setResponseId(nextResponseId);
  }, []);

  useEffect(() => {
    if (!answers || !result || !responseId) return;

    const submissionKey = `vapsSupabaseSubmission:${responseId}`;
    if (window.localStorage.getItem(submissionKey)) return;

    window.localStorage.setItem(submissionKey, "pending");
    submitDiagnosisResponse({
      answers,
      consentVersion: analyticsSource === "beta" ? betaConsentVersion : undefined,
      responseId,
      result,
      source: analyticsSource,
      survey,
    })
      .then((status) => {
        window.localStorage.setItem(submissionKey, status.ok ? "sent" : `failed:${status.status ?? "skipped"}`);
      })
      .catch(() => {
        window.localStorage.setItem(submissionKey, "failed:network");
      });
  }, [analyticsSource, answers, responseId, result, survey]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-result-section]"));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-22% 0px -58% 0px", threshold: [0.12, 0.3, 0.55] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [result]);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".result-hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowResultHeader(!entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px", threshold: 0.02 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [result]);

  if (!result) {
    return (
      <main className="shell">
        <div className="container">
          <h1 className="page-title">結果がまだありません</h1>
          <p className="lead">診断を完了すると、このページに結果が表示されます。</p>
          <Link className="button" href={vapsPublicMode === "beta" ? "/beta" : "/diagnosis?step=0"}>
            診断を始める
          </Link>
        </div>
      </main>
    );
  }

  const displayName = survey.displayName?.trim();
  const subject = displayName ? `${displayName}縺輔ｓ縺ｮ險ｺ譁ｭ邨先棡` : "縺ゅ↑縺溘・險ｺ譁ｭ邨先棡";
  const maxScore = Math.max(...Object.values(result.axisScores), 1);
  const groupColor = groupColors[result.groupCode] ?? fallbackGroupColor;
  const groupTextColor = readableAccentColor(groupColor);
  const groupSurfaceColor = surfaceAccentColor(groupColor);
  const groupExplanation = groupExplanations[result.groupCode];
  const typeExplanation = typeExplanations[result.typeCode];
  const keywords = buildKeywordItems(result);
  const visibleKeywords = showAllKeywords ? keywords : keywords.slice(0, 8);
  const relatedTypes = getRelatedTypes(result);
  const similarTypes = getSimilarTypes(result);
  const isFooterActive = activeSection === "share" || activeSection === "videos";
  const isBetaResult = analyticsSource === "beta";

  function submitRating(value: number) {
    if (!result) return;
    setRating(value);
    const record = buildAnalyticsRecord(result, survey, value, analyticsSource, {
      consentVersion: isBetaResult ? betaConsentVersion : undefined,
      responseId,
    });
    appendAnalyticsRecord(record);
    if (responseId) {
      submitResultFeedback({
        consentVersion: isBetaResult ? betaConsentVersion : undefined,
        rating: value,
        responseId,
        source: analyticsSource,
        typeCode: result.typeCode,
      }).catch(() => undefined);
    }
    window.localStorage.setItem(
      "vapsResultFeedback",
      JSON.stringify(record),
    );
  }

  function startNewDiagnosis() {
    window.localStorage.removeItem("vapsAnswers");
    window.localStorage.removeItem("vapsSurvey");
    window.localStorage.removeItem("vapsResultFeedback");
    window.localStorage.removeItem("vapsQuestionOrderSeed");
    if (vapsPublicMode === "beta") {
      location.href = "/beta";
      return;
    }
    window.localStorage.setItem("vapsQuestionMode", "official");
    location.href = "/diagnosis?mode=official&step=0";
  }

  return (
    <main className="shell">
      <div
        className={`result-sticky-header ${showResultHeader ? "visible" : ""}`}
        style={{ "--group-color": groupColor, "--group-surface-color": groupSurfaceColor, "--group-text-color": groupTextColor } as React.CSSProperties}
      >
        <span>{result.core}</span>
        <strong>
          {result.typeCode} {result.typeName}
        </strong>
      </div>
      <div
        id="top"
        className="result-layout"
        style={{ "--group-color": groupColor, "--group-surface-color": groupSurfaceColor, "--group-text-color": groupTextColor } as React.CSSProperties}
      >
        <section
          className="result-hero"
          style={{ "--group-color": groupColor, "--group-surface-color": groupSurfaceColor, "--group-text-color": groupTextColor } as React.CSSProperties}
        >
          {isBetaResult && <span className="beta-result-badge">βテスト結果</span>}
          <div
            className="result-symbol-ghost"
            style={{ backgroundImage: `url(/images/symbols/${result.typeCode}.png)` }}
            aria-hidden="true"
          />
          <div className="result-copy">
            <p className="result-core" style={{ color: groupTextColor }}>
              {result.core}
            </p>
            <div className="result-code" style={{ color: groupTextColor }}>
              {result.typeCode}
              <span>{result.typeName}</span>
              <span className="state-ribbon" style={{ "--state-color": groupColor } as React.CSSProperties}>
                {result.state}
              </span>
            </div>
            <div className="result-summary-card value-type-card" aria-label={subject}>
              <span>価値タイプ</span>
              <strong>
                {result.valueTypeCode} {result.valueTypeName}
              </strong>
              <em>{result.identityMatch}</em>
            </div>
            {isBetaResult && (
              <div className="result-beta-note">
                <strong>この結果はβテスト版です。</strong>
                <p>解説や分類は開発中で、今後変更される可能性があります。</p>
                {responseId && (
                  <p>
                    回答ID <code>{responseId}</code>
                  </p>
                )}
              </div>
            )}
          </div>
          <CharacterImage typeCode={result.typeCode} />
          <div className="axis-rank-strip">
            <AxisRankFlow ranking={result.axisRanking} scores={result.axisScores} />
          </div>
        </section>

        <div className="result-grid">
          <div className="sections">
            <ResultSection id="ranking" title="軸バランス">
              <div className="vertical-chart" aria-label="軸バランス">
                {graphAxisOrder.map((axis) => (
                  <div className="vertical-bar-item" key={axis}>
                    <div className="vertical-bar-track" tabIndex={0}>
                      <div
                        className="vertical-bar-fill"
                        style={
                          {
                            "--h": `${(result.axisScores[axis] / maxScore) * 100}%`,
                            "--bar-color": axisColors[axis] ?? fallbackAxisColor,
                          } as React.CSSProperties
                        }
                      />
                      <span className="bar-tooltip">
                        <strong>{axisNames[axis]}</strong>
                        {axisDescriptions[axis] || "説明文を追加予定です。"}
                      </span>
                    </div>
                    <strong>{axis}</strong>
                  </div>
                ))}
              </div>
            </ResultSection>

            <ResultSection id="keywords">
              <div className="keyword-list">
                {visibleKeywords.map((keyword) => (
                  <span
                    key={`${keyword.axis}-${keyword.label}`}
                    style={
                      {
                        "--keyword-mix": `${keyword.mix}%`,
                        "--keyword-border": `${Math.min(keyword.mix + 12, 58)}%`,
                      } as React.CSSProperties
                    }
                  >
                    {keyword.label}
                  </span>
                ))}
              </div>
              {keywords.length > 8 && (
                <button className="text-button" type="button" onClick={() => setShowAllKeywords(!showAllKeywords)}>
                  {showAllKeywords ? "閉じる" : "さらに見る"}
                </button>
              )}
            </ResultSection>

            <ResultSection id="detail">
              <div className="explanation-stack">
                <p className="type-intro">
                  {typeExplanation?.intro ??
                    `${result.typeName}タイプの簡単な説明を表示する領域です。固定解説データが追加されたら、ここに短い導入文を反映します。`}
                </p>
                <h2>{result.groupName}</h2>
                {groupExplanation ? (
                  groupExplanation.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
                ) : (
                  <p>
                    {result.groupName}グループは、{result.groupCode}の組み合わせに基づく共通説明を表示する領域です。
                    固定解説データが追加されたら、ここにグループ固有の文章を反映します。
                  </p>
                )}
                {typeExplanation && (
                  <div className="type-explanation-block">
                    <h3>{result.typeName}</h3>
                    {typeExplanation.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                )}
              </div>
            </ResultSection>

            <ResultSection id="strength">
              <div className="trait-window-grid">
                <TraitWindow title="長所" items={typeExplanation?.strengths ?? ["タイプ別固定文のプレースホルダー"]} />
                <TraitWindow title="得意" items={typeExplanation?.skills ?? ["タイプ別固定文のプレースホルダー"]} />
                <TraitWindow title="短所" items={typeExplanation?.weaknesses ?? ["タイプ別固定文のプレースホルダー"]} />
                <TraitWindow title="苦手" items={typeExplanation?.challenges ?? ["タイプ別固定文のプレースホルダー"]} />
              </div>
            </ResultSection>

            <ResultSection id="role" title="向いている役割">
              {typeExplanation ? (
                <>
                  <p>{typeExplanation.jobs.join("、")}</p>
                  <p>{typeExplanation.roles.join("、")}</p>
                </>
              ) : (
                <p>向いている職業・活動・チーム内の役割を表示する領域です。</p>
              )}
            </ResultSection>

            <ResultSection id="group-types" title={`同じ${result.groupName}グループ`}>
              <RelatedTypeTabs items={relatedTypes} color={groupColor} />
            </ResultSection>

            <ResultSection id="similar-types" title="似ているタイプ">
              <RelatedTypeTabs items={similarTypes} color={groupColor} />
            </ResultSection>

            <ResultSection id="compatibility" title="相性">
              {typeExplanation ? (
                <>
                  <p>相性の良いタイプ：{typeExplanation.compatibility.good.join("、")}</p>
                  <p>ズレが起こりやすいタイプ：{typeExplanation.compatibility.bad.join("、")}</p>
                </>
              ) : (
                <p>相性の良いタイプ・ズレが起こりやすいタイプを表示する領域です。</p>
              )}
            </ResultSection>

            <ResultSection id="state" title="補足解説">
              <InfoTabs
                items={[
                  { label: result.state, text: stateDescriptions[result.state], color: groupColor },
                  { label: result.identityMatch, text: matchDescriptions[result.identityMatch], color: groupColor },
                ]}
              />
            </ResultSection>
          </div>

          <aside className="side-rail">
            <nav className="toc" aria-label="結果ページ目次">
              <strong>目次</strong>
              {[
                ["ranking", "軸バランス"],
                ["keywords", "キーワード"],
                ["detail", "詳細説明"],
                ["strength", "長所・短所"],
                ["role", "向いている役割"],
                ["group-types", "同グループ"],
                ["similar-types", "似ているタイプ"],
                ["compatibility", "相性"],
                ["state", "補足解説"],
                ["videos", "おすすめ"],
                ["share", "結果を共有"],
              ].map(([id, label]) => (
                <a className={activeSection === id ? "active" : ""} href={`#${id}`} key={id}>
                  {label}
                </a>
              ))}
            </nav>
            {isFooterActive ? (
              <a className="side-link side-link-top" href="#top">
                一番上に戻る
              </a>
            ) : (
              <>
                <Link className="side-link" href="/types">
                  タイプ一覧を見る
                </Link>
                <ShareActions
                  keywords={keywords.slice(0, 4)}
                  result={result}
                  survey={survey}
                  maxScore={maxScore}
                  layout="desktop"
                />
              </>
            )}
          </aside>
        </div>
        <footer className="result-footer" id="share" data-result-section>
          <section className="footer-panel">
            <div className="footer-heading">
              <span>おすすめ</span>
              <h2>動画・記事</h2>
            </div>
            <div className="video-grid" id="videos" data-result-section>
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
            <div className="article-placeholder-grid" aria-label="おすすめ記事">
              <article>
                <span>Article</span>
                <strong>おすすめ記事 1</strong>
              </article>
              <article>
                <span>Article</span>
                <strong>おすすめ記事 2</strong>
              </article>
              <article>
                <span>Article</span>
                <strong>おすすめ記事 3</strong>
              </article>
            </div>

            <div className="footer-share">
              {isBetaResult && (
                <section className="beta-community-panel">
                  <span>βテスト参加ありがとうございます</span>
                  <p>
                    個別解説や不具合報告を希望する場合は、回答ID
                    {responseId ? <code>{responseId}</code> : "を"} 控えてDiscordで伝えてください。
                  </p>
                  <a className="button secondary" href={discordCommunityUrl} rel="noreferrer" target="_blank">
                    Discordコミュニティに参加
                  </a>
                </section>
              )}
              <ShareActions
                keywords={keywords.slice(0, 4)}
                result={result}
                survey={survey}
                maxScore={maxScore}
                layout="mobile"
              />
              <ResultRating rating={rating} onRate={submitRating} />
              <nav className="footer-links" aria-label="結果ページ下部リンク">
                <Link href="/">TOPに戻る</Link>
                <button type="button" onClick={startNewDiagnosis}>
                  もう一度新しく診断する
                </button>
                <Link href="/types">タイプ一覧を見る</Link>
              </nav>
            </div>
          </section>
        </footer>
      </div>
    </main>
  );
}

function ResultSection({
  id,
  title,
  children,
}: {
  id: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`section section-${id}`} id={id} data-result-section>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}

function InfoTabs({ items }: { items: Array<{ label: string; text: string; color: string }> }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];

  return (
    <div className="info-tabs">
      <div className="info-tab-list" role="tablist" aria-label="陬懆ｶｳ隗｣隱ｬ">
        {items.map((item, index) => (
          <button
            aria-selected={activeIndex === index}
            className="info-tab"
            key={item.label}
            onClick={() => setActiveIndex(index)}
            role="tab"
            style={{ "--tab-color": item.color } as React.CSSProperties}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="info-tab-panel" style={{ "--tab-color": activeItem.color } as React.CSSProperties}>
        <strong>{activeItem.label}</strong>
        <p>{activeItem.text || "説明文を追加予定です。"}</p>
      </div>
    </div>
  );
}

function RelatedTypeTabs({ items, color }: { items: RelatedType[]; color: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];
  const activeColor = activeItem ? (groupColors[typeData[activeItem.code]?.groupCode] ?? color) : color;
  const activeTextColor = readableAccentColor(activeColor);

  if (items.length === 0) {
    return <p>関連タイプの説明を表示する領域です。</p>;
  }

  return (
    <div className="related-tabs">
      <div className="related-tab-list" role="tablist" aria-label="関連タイプ">
        {items.map((item, index) => (
          <button
            aria-selected={activeIndex === index}
            className="related-tab"
            key={item.code}
            onClick={() => setActiveIndex(index)}
            role="tab"
            style={{ "--related-color": color } as React.CSSProperties}
            type="button"
          >
            {item.code}
          </button>
        ))}
      </div>
      <div
        className="related-panel"
        style={{ "--related-color": activeColor, "--related-text-color": activeTextColor } as React.CSSProperties}
      >
        <strong>
          {activeItem.code} {activeItem.typeName}
        </strong>
        <p>{activeItem.core}</p>
        <p className="related-note">診断結果タイプとの違い・専用イラストを追加予定です。</p>
        <Link className="related-link" href={`/types/${activeItem.code}`}>
          詳しく見る
        </Link>
      </div>
    </div>
  );
}

function ShareActions({
  keywords,
  layout,
  maxScore,
  result,
  survey,
}: {
  keywords: Array<{ axis: Axis; label: string; mix: number }>;
  layout: "desktop" | "mobile";
  maxScore: number;
  result: VapsResult;
  survey: Survey;
}) {
  function copyUrl() {
    navigator.clipboard?.writeText(location.href);
  }

  function postToX() {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(
      "VAPSタイプ診断の結果を見ました",
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function shareOther() {
    if (navigator.share) {
      navigator.share({ title: document.title, url: location.href }).catch(() => undefined);
      return;
    }
    copyUrl();
  }

  function saveImage() {
    void generateResultImage({ keywords, maxScore, result, survey });
  }

  return (
    <section className={`share-panel ${layout === "desktop" ? "desktop-share" : "mobile-share"}`} aria-label="結果を共有">
      <strong>結果を共有</strong>
      <div className="share-icon-row">
        <IconButton label="URLコピー" onClick={copyUrl} icon="link" />
        <IconButton label="Xでポスト" onClick={postToX} icon="x" />
        <IconButton label="その他の共有" onClick={shareOther} icon="share" />
        <IconButton label="画像を保存" onClick={saveImage} icon="image" />
      </div>
    </section>
  );
}

function ResultRating({ rating, onRate }: { rating: number | null; onRate: (value: number) => void }) {
  if (rating) {
    return <section className="rating-panel answered">回答ありがとうございました！</section>;
  }

  return (
    <section className="rating-panel" aria-label="結果への納得度">
      <span>結果に納得できる？</span>
      <div>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            aria-label={`${value}段階`}
            aria-pressed={rating === value}
            key={value}
            onClick={() => onRate(value)}
            type="button"
          >
            {value}
          </button>
        ))}
      </div>
    </section>
  );
}

function IconButton({
  disabled,
  icon,
  label,
  onClick,
}: {
  disabled?: boolean;
  icon: "link" | "x" | "share" | "image";
  label: string;
  onClick?: () => void;
}) {
  return (
    <button aria-label={label} className="icon-button" disabled={disabled} onClick={onClick} title={label} type="button">
      <ShareIcon name={icon} />
    </button>
  );
}

function ShareIcon({ name }: { name: "link" | "x" | "share" | "image" }) {
  if (name === "x") return <span aria-hidden="true">X</span>;

  const paths = {
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
        <path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1" />
      </>
    ),
    share: (
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.6 13.5l6.8 4" />
        <path d="M15.4 6.5l-6.8 4" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8" cy="10" r="2" />
        <path d="M21 16l-5-5-4 4-2-2-5 5" />
      </>
    ),
  } as const;

  return (
    <svg aria-hidden="true" fill="none" height="22" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="22">
      {paths[name]}
    </svg>
  );
}

function TraitWindow({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="trait-window">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function AxisRankFlow({ ranking, scores }: { ranking: Axis[]; scores: Record<Axis, number> }) {
  return (
    <div className="axis-rank-flow" aria-label="強く出やすい軸の順番">
      {ranking.map((axis, index) => {
        const sameAsPrevious = index > 0 && scores[axis] === scores[ranking[index - 1]];
        return (
          <Fragment key={`${axis}-${index}`}>
            {index > 0 && (
              <span className="rank-separator">
                {sameAsPrevious ? "=" : ">"}
              </span>
            )}
            <span
              className="axis-rank-chip"
              style={{ "--axis-color": axisColors[axis] ?? fallbackAxisColor } as React.CSSProperties}
              title={axisNames[axis]}
            >
              {axis}
            </span>
          </Fragment>
        );
      })}
    </div>
  );
}

function buildKeywordItems(result: VapsResult) {
  const typeAxes = result.typeCode.split("") as Axis[];
  const typeAxisScores = typeAxes.map((axis) => result.axisScores[axis]);
  const nearThreshold = Math.min(...typeAxisScores) - 2;
  const keywordAxes = result.axisRanking.filter(
    (axis) => typeAxes.includes(axis) || result.axisScores[axis] >= nearThreshold,
  ).slice(0, 5);
  const selectedScores = keywordAxes.map((axis) => result.axisScores[axis]);
  const max = Math.max(...selectedScores, 1);
  const min = Math.min(...selectedScores);
  const range = Math.max(max - min, 1);

  return keywordAxes.flatMap((axis) => {
    const strength = (result.axisScores[axis] - min) / range;
    const mix = Math.round(8 + strength * 34);
    return (axisKeywords[axis] ?? []).slice(0, 2).map((label) => ({ axis, label, mix }));
  });
}

function getRelatedTypes(result: VapsResult): RelatedType[] {
  return Object.values(typeData)
    .filter((item) => item.groupCode === result.groupCode && item.code !== result.typeCode)
    .map((item) => ({
      code: item.code,
      core: item.core,
      typeName: item.typeName,
    }));
}

function getSimilarTypes(result: VapsResult): RelatedType[] {
  return Object.values(typeData)
    .filter((item) => item.code !== result.typeCode && item.groupCode !== result.groupCode)
    .map((item) => ({
      code: item.code,
      core: item.core,
      matchCount: [...item.code].filter((axis, index) => axis === result.typeCode[index]).length,
      typeName: item.typeName,
    }))
    .filter((item) => item.matchCount >= 2)
    .sort((a, b) => b.matchCount - a.matchCount || a.code.localeCompare(b.code))
    .slice(0, 4)
    .map(({ code, core, typeName }) => ({ code, core, typeName }));
}

async function generateResultImage({
  keywords,
  maxScore,
  result,
  survey,
}: {
  keywords: Array<{ axis: Axis; label: string; mix: number }>;
  maxScore: number;
  result: VapsResult;
  survey: Survey;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const context = canvas.getContext("2d");
  if (!context) return;

  const groupColor = groupColors[result.groupCode] ?? fallbackGroupColor;
  const displayName = survey.displayName?.trim() || "あなた";
  const softText = "#6f6670";
  const mainText = "#253044";
  const siteUrl = typeof location !== "undefined" ? location.origin.replace(/^https?:\/\//, "") : "VAPS";
  const [characterImage, logoMark, logoType] = await Promise.all([
    loadCanvasImage(`/images/characters/${result.typeCode}.png`),
    loadCanvasImage("/images/brand/vaps-logo-mark.png"),
    loadCanvasImage("/images/brand/vaps-logotype.png"),
  ]);

  context.fillStyle = "#fbf8f5";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#fffdfb";
  roundRect(context, 36, 32, 1208, 656, 28);
  context.fill();
  context.strokeStyle = mixWithWhite(groupColor, 0.58);
  context.lineWidth = 1.6;
  context.stroke();

  context.save();
  context.beginPath();
  context.rect(36, 32, 1208, 656);
  context.clip();
  drawDotPattern(context, 1016, 72, 180, 150, mixWithWhite(groupColor, 0.76));
  context.strokeStyle = mixWithWhite(groupColor, 0.72);
  context.lineWidth = 1.2;
  context.beginPath();
  context.moveTo(786, 32);
  context.quadraticCurveTo(740, 210, 778, 390);
  context.quadraticCurveTo(808, 536, 768, 688);
  context.stroke();
  context.restore();

  context.fillStyle = groupColor;
  context.globalAlpha = 0.05;
  context.beginPath();
  context.arc(1018, 318, 310, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;

  context.fillStyle = groupColor;
  context.font = '800 17px "Yu Gothic", sans-serif';
  if (logoMark) drawImageContain(context, logoMark, 82, 70, 20, 20);
  context.fillText("VAPS RESULT", 112, 88);
  drawDashedLine(context, 82, 112, 720, mixWithWhite(groupColor, 0.7));

  context.fillStyle = mainText;
  context.font = '700 27px "Yu Gothic", sans-serif';
  context.fillText(`${displayName}さんのVAPSタイプは`, 82, 162);

  context.fillStyle = groupColor;
  context.font = '800 38px "Yu Gothic", sans-serif';
  context.fillText(result.core, 82, 222);

  context.font = '900 88px "Yu Gothic", sans-serif';
  const typeTitle = `${result.typeCode} ${result.typeName}`;
  context.fillText(typeTitle, 82, 330);
  const titleWidth = context.measureText(typeTitle).width;
  drawCanvasPill(context, result.state, Math.min(82 + titleWidth + 28, 650), 291, groupColor, groupColor, 22);

  context.fillStyle = softText;
  context.font = '700 26px "Yu Gothic", sans-serif';
  context.fillText("価値タイプ", 84, 390);
  context.fillStyle = groupColor;
  context.font = '800 26px "Yu Gothic", sans-serif';
  const valueTitle = `${result.valueTypeCode} ${result.valueTypeName}`;
  context.fillText(valueTitle, 225, 390);
  const valueWidth = context.measureText(valueTitle).width;
  drawCanvasPill(context, result.identityMatch, 225 + valueWidth + 18, 365, "#8f9098", "#5b5e67", 17);

  if (characterImage) {
    drawImageContain(context, characterImage, 742, 62, 510, 610);
  }

  drawShareBars(context, result, maxScore, { left: 82, top: 430, width: 660, height: 108 });
  drawShareKeywords(context, getShareKeywords(result, keywords), groupColor, { left: 82, top: 590, maxWidth: 700 });

  if (logoType) {
    drawImageContain(context, logoType, 82, 648, 72, 20);
  } else {
    context.fillStyle = mixWithWhite(groupColor, 0.18);
    context.font = '900 20px "Yu Gothic", sans-serif';
    context.fillText("VAPS", 82, 668);
  }
  context.fillStyle = softText;
  context.font = '700 14px "Yu Gothic", sans-serif';
  context.fillText(siteUrl, 172, 664);
  context.strokeStyle = mixWithWhite(groupColor, 0.82);
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(292, 660);
  context.lineTo(860, 660);
  context.stroke();
  context.textAlign = "right";
  context.fillStyle = groupColor;
  context.font = '700 14px "Yu Gothic", sans-serif';
  context.fillText("© VAPS project", 1198, 664);
  context.textAlign = "left";
  downloadCanvas(canvas, `vaps-${result.typeCode}.png`);
}

function drawShareBars(
  context: CanvasRenderingContext2D,
  result: VapsResult,
  maxScore: number,
  layout = { left: 64, top: 444, width: 660, height: 110 },
) {
  const { left, top, width, height } = layout;
  const gap = 10;
  const barWidth = (width - gap * (graphAxisOrder.length - 1)) / graphAxisOrder.length;

  graphAxisOrder.forEach((axis, index) => {
    const x = left + index * (barWidth + gap);
    const barHeight = Math.max(6, (result.axisScores[axis] / maxScore) * height);
    context.fillStyle = "#f4f5f8";
    roundRect(context, x, top, barWidth, height, 8);
    context.fill();
    context.fillStyle = "rgba(255, 255, 255, 0.36)";
    roundRect(context, x + 2, top + 2, Math.max(barWidth - 4, 2), Math.max(height - 4, 2), 7);
    context.fill();
    context.fillStyle = axisColors[axis] ?? fallbackAxisColor;
    roundRect(context, x, top + height - barHeight, barWidth, barHeight, 8);
    context.fill();
    context.fillStyle = "#253044";
    context.font = '800 17px "Yu Gothic", sans-serif';
    context.textAlign = "center";
    context.fillText(axis, x + barWidth / 2, top + height + 30);
  });
  context.textAlign = "left";
}

function drawShareKeywords(
  context: CanvasRenderingContext2D,
  keywords: Array<{ axis: Axis; label: string; mix: number }>,
  groupColor: string,
  layout = { left: 780, top: 446, maxWidth: 360 },
) {
  context.font = '800 17px "Yu Gothic", sans-serif';
  context.textBaseline = "middle";
  let x = layout.left;
  const y = layout.top;
  keywords.forEach((keyword) => {
    const width = Math.min(context.measureText(keyword.label).width + 28, 154);
    if (x + width > layout.left + layout.maxWidth) return;
    context.fillStyle = mixWithWhite(groupColor, 0.86 - keyword.mix / 260);
    roundRect(context, x, y, width, 32, 16);
    context.fill();
    context.strokeStyle = mixWithWhite(groupColor, 0.66);
    context.lineWidth = 1.5;
    context.stroke();
    context.fillStyle = "#253044";
    const textWidth = context.measureText(keyword.label).width;
    context.fillText(keyword.label, x + (width - textWidth) / 2, y + 16);
    x += width + 10;
  });
  context.textBaseline = "alphabetic";
}

function getShareKeywords(result: VapsResult, keywords: Array<{ axis: Axis; label: string; mix: number }>) {
  const selected: Array<{ axis: Axis; label: string; mix: number }> = [];
  const seen = new Set<string>();
  const typeAxes = result.typeCode.split("") as Axis[];
  const selectedScores = typeAxes.map((axis) => result.axisScores[axis]);
  const max = Math.max(...selectedScores, 1);
  const min = Math.min(...selectedScores);
  const range = Math.max(max - min, 1);

  typeAxes.forEach((axis) => {
    const label = axisKeywords[axis]?.[0];
    if (!label) return;
    const strength = (result.axisScores[axis] - min) / range;
    selected.push({ axis, label, mix: Math.round(16 + strength * 28) });
    seen.add(label);
  });

  keywords.forEach((keyword) => {
    if (selected.length >= 5 || seen.has(keyword.label)) return;
    selected.push(keyword);
    seen.add(keyword.label);
  });

  return selected.slice(0, 5);
}

function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function drawImageContain(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function roundRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function drawCanvasPill(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fillColor: string,
  textColor: string,
  fontSize: number,
) {
  context.font = `800 ${fontSize}px "Yu Gothic", sans-serif`;
  context.textBaseline = "middle";
  const textWidth = context.measureText(text).width;
  const width = textWidth + fontSize * 1.7;
  const height = fontSize * 1.55;
  context.fillStyle = "rgba(255, 255, 255, 0.68)";
  roundRect(context, x, y, width, height, height / 2);
  context.fill();
  context.strokeStyle = mixWithWhite(fillColor, 0.58);
  context.lineWidth = 1.5;
  context.stroke();
  context.fillStyle = textColor;
  context.fillText(text, x + (width - textWidth) / 2, y + height / 2);
  context.textBaseline = "alphabetic";
  return { width, height };
}

function drawDashedLine(context: CanvasRenderingContext2D, x: number, y: number, width: number, color: string) {
  context.save();
  context.strokeStyle = color;
  context.lineWidth = 1.4;
  context.setLineDash([8, 8]);
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + width, y);
  context.stroke();
  context.restore();
}

function drawDotPattern(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
) {
  context.fillStyle = color;
  for (let dotY = y; dotY < y + height; dotY += 14) {
    for (let dotX = x; dotX < x + width; dotX += 14) {
      context.globalAlpha = 0.42;
      context.beginPath();
      context.arc(dotX, dotY, 1.6, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.globalAlpha = 1;
}

function mixWithWhite(hex: string, amount: number) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  const mix = (channel: number) => Math.round(channel + (255 - channel) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}


