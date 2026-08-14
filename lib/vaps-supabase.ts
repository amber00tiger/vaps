import type { AnalyticsSource, SurveyAnalytics } from "./vaps-analytics";
import type { StoredAnswers, VapsResult } from "./vaps-scoring";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

type DiagnosisSubmission = {
  answers: StoredAnswers;
  consentVersion?: string;
  responseId: string;
  result: VapsResult;
  source: AnalyticsSource;
  survey: SurveyAnalytics;
};

type FeedbackSubmission = {
  consentVersion?: string;
  rating: number;
  responseId: string;
  source: AnalyticsSource;
  typeCode: string;
};

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

export async function submitDiagnosisResponse(submission: DiagnosisSubmission) {
  if (!isSupabaseConfigured()) return { ok: false, status: "skipped" };

  const simpleAnswers = Object.fromEntries(
    Object.entries(submission.answers).filter(([questionId]) => questionId.startsWith("SQ")),
  );
  const detailAnswers = Object.fromEntries(
    Object.entries(submission.answers).filter(([questionId]) => questionId.startsWith("Q")),
  );

  return postToSupabase("diagnosis_responses", {
    axis_ranking: submission.result.axisRanking,
    axis_scores: submission.result.axisScores,
    consent_version: submission.consentVersion ?? null,
    detail_answers: detailAnswers,
    group_code: submission.result.groupCode,
    group_name: submission.result.groupName,
    identity_match: submission.result.identityMatch,
    response_id: submission.responseId,
    simple_answers: simpleAnswers,
    simple_profile: submission.result.simpleProfile,
    source: submission.source,
    state: submission.result.state,
    survey: submission.survey,
    type_code: submission.result.typeCode,
    type_name: submission.result.typeName,
    value_type_code: submission.result.valueTypeCode,
    value_type_name: submission.result.valueTypeName,
  });
}

export async function submitResultFeedback(submission: FeedbackSubmission) {
  if (!isSupabaseConfigured()) return { ok: false, status: "skipped" };

  return postToSupabase("result_feedback", {
    consent_version: submission.consentVersion ?? null,
    rating: submission.rating,
    response_id: submission.responseId,
    source: submission.source,
    type_code: submission.typeCode,
  });
}

async function postToSupabase(tableName: string, payload: Record<string, unknown>) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
    body: JSON.stringify(payload),
    headers: {
      apikey: supabasePublishableKey ?? "",
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    method: "POST",
  });

  return { ok: response.ok, status: String(response.status) };
}
