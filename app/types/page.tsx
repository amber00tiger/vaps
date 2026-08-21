import Link from "next/link";
import { typeData } from "@/lib/vaps-data";
import { readableAccentColor, surfaceAccentColor } from "@/lib/vaps-color-utils";
import {
  fallbackGroupBlockBackground,
  fallbackGroupColor,
  fallbackGroupPageBackground,
  groupBlockBackgrounds,
  groupColors,
  groupDisplayColors,
  groupPageBackgrounds,
} from "@/lib/vaps-group-colors";

const operationOrder = ["S", "F", "C", "P"];
const orientationOrder = ["O", "L", "G", "M"];
const axisOrder = ["R", "H", "E", "A"];
const groupOrder = operationOrder.flatMap((operation) => orientationOrder.map((orientation) => `${operation}${orientation}`));
const types = Object.values(typeData).sort((a, b) => {
  const groupDiff = groupOrder.indexOf(a.groupCode) - groupOrder.indexOf(b.groupCode);
  if (groupDiff !== 0) return groupDiff;
  return axisOrder.indexOf(a.code[0]) - axisOrder.indexOf(b.code[0]);
});

export default function TypesPage() {
  const groups = types.reduce<Record<string, typeof types>>((items, type) => {
    return { ...items, [type.groupCode]: [...(items[type.groupCode] ?? []), type] };
  }, {});

  return (
    <main className="shell">
      <div className="type-index-page">
        <Link className="text-link" href="/">
          トップへ戻る
        </Link>
        <header className="type-index-hero">
          <h1>タイプ一覧</h1>
          <p>VAPSの64タイプをグループごとに確認できます。診断結果とは別の、定型的なタイプ解説ページです。</p>
        </header>

        <div className="type-group-list">
          {Object.entries(groups).map(([groupCode, groupTypes]) => {
            const color = groupColors[groupCode] ?? fallbackGroupColor;
            const displayColor = groupDisplayColors[groupCode] ?? color;
            const textColor = readableAccentColor(displayColor);
            const surfaceColor = surfaceAccentColor(color);
            const pageBackground = groupPageBackgrounds[groupCode] ?? fallbackGroupPageBackground;
            const blockBackground = groupBlockBackgrounds[groupCode] ?? fallbackGroupBlockBackground;
            return (
              <section
                className="type-group-section"
                key={groupCode}
                style={
                  {
                    "--group-block-bg": blockBackground,
                    "--group-color": color,
                    "--group-display-color": displayColor,
                    "--group-page-bg": pageBackground,
                    "--group-surface-color": surfaceColor,
                    "--group-text-color": textColor,
                  } as React.CSSProperties
                }
              >
                <h2>{groupTypes[0].groupName}</h2>
                <div className="type-card-grid">
                  {groupTypes.map((type) => (
                    <Link className="type-card-link" href={`/types/${type.code}`} key={type.code}>
                      <strong>
                        {type.code} {type.typeName}
                      </strong>
                      <span>{type.core}</span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
