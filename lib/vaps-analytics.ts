import type { VapsResult } from "./vaps-scoring";

export type SurveyAnalytics = {
  displayName?: string;
  ageGroup?: string;
  gender?: string;
  region?: string;
};

export type AnalyticsSource = "official" | "beta";

export type AnalyticsRecord = {
  id: string;
  createdAt: string;
  responseId?: string;
  source?: AnalyticsSource;
  consentVersion?: string;
  typeCode: string;
  groupCode: string;
  groupName: string;
  typeName: string;
  state: VapsResult["state"];
  valueTypeCode: string;
  valueTypeName: string;
  identityMatch: VapsResult["identityMatch"];
  rating: number;
  survey: SurveyAnalytics;
};

export const analyticsStorageKey = "vapsAnalyticsRecords";

export function buildAnalyticsRecord(
  result: VapsResult,
  survey: SurveyAnalytics,
  rating: number,
  source: AnalyticsSource = "official",
  meta: { consentVersion?: string; responseId?: string } = {},
): AnalyticsRecord {
  return {
    createdAt: new Date().toISOString(),
    consentVersion: meta.consentVersion,
    groupCode: result.groupCode,
    groupName: result.groupName,
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    identityMatch: result.identityMatch,
    rating,
    responseId: meta.responseId,
    source,
    state: result.state,
    survey,
    typeCode: result.typeCode,
    typeName: result.typeName,
    valueTypeCode: result.valueTypeCode,
    valueTypeName: result.valueTypeName,
  };
}

export function readAnalyticsRecords(): AnalyticsRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(analyticsStorageKey);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as AnalyticsRecord[];
  } catch {
    return [];
  }
}

export function appendAnalyticsRecord(record: AnalyticsRecord) {
  const records = readAnalyticsRecords();
  window.localStorage.setItem(analyticsStorageKey, JSON.stringify([...records, record]));
}

export function countBy<T extends string>(records: AnalyticsRecord[], getKey: (record: AnalyticsRecord) => T | undefined) {
  return records.reduce<Record<string, number>>((counts, record) => {
    const key = getKey(record) || "未回答";
    return { ...counts, [key]: (counts[key] ?? 0) + 1 };
  }, {});
}

export function averageRating(records: AnalyticsRecord[]) {
  if (records.length === 0) return 0;
  return records.reduce((sum, record) => sum + record.rating, 0) / records.length;
}

export function toAnalyticsCsv(records: AnalyticsRecord[]) {
  const headers = [
    "createdAt",
    "responseId",
    "source",
    "consentVersion",
    "typeCode",
    "typeName",
    "groupCode",
    "groupName",
    "state",
    "valueTypeCode",
    "valueTypeName",
    "identityMatch",
    "rating",
    "ageGroup",
    "gender",
    "region",
  ];
  const rows = records.map((record) =>
    [
      record.createdAt,
      record.responseId ?? "",
      record.source ?? "official",
      record.consentVersion ?? "",
      record.typeCode,
      record.typeName,
      record.groupCode,
      record.groupName,
      record.state,
      record.valueTypeCode,
      record.valueTypeName,
      record.identityMatch,
      String(record.rating),
      record.survey.ageGroup ?? "",
      record.survey.gender ?? "",
      record.survey.region ?? "",
    ].map(escapeCsv),
  );

  return [headers, ...rows].map((row) => row.join(",")).join("\n");
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}
