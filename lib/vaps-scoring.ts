import {
  allAxes,
  axisPairs,
  detailQuestions,
  reverseAspect,
  typeData,
  type Axis,
  type Aspect,
} from "./vaps-data";

export type StoredAnswers = Record<string, string | number>;

export type SimpleProfile = {
  thought_origin_axis?: Axis;
  thought_structure_axis?: Axis;
  thought_preferred_aspect?: Aspect;
  judgement_origin_axis?: Axis;
  judgement_principle_axis?: Axis;
  judgement_preferred_aspect?: Aspect;
  action_operation_axis?: Axis;
  action_orientation_axis?: Axis;
  action_preferred_aspect?: Aspect;
};

export type VapsResult = {
  typeCode: string;
  groupCode: string;
  groupName: string;
  typeName: string;
  state: "成熟" | "安定" | "経過" | "不安定";
  valueTypeCode: string;
  valueGroupName: string;
  valueTypeName: string;
  identityMatch: "同一" | "近似" | "乖離";
  axisRanking: Axis[];
  axisScores: Record<Axis, number>;
  core: string;
  simpleProfile: SimpleProfile;
};

const layerAxes = {
  thought: ["R", "H", "E", "A"] as Axis[],
  judgement: ["C", "P", "S", "F"] as Axis[],
  action: ["M", "G", "L", "O"] as Axis[],
};

const layerAspects = {
  thought: ["thought_origin", "thought_structure"] as Aspect[],
  judgement: ["judgement_origin", "judgement_principle"] as Aspect[],
  action: ["action_operation", "action_orientation"] as Aspect[],
};

export function extractSimpleProfile(answers: StoredAnswers): SimpleProfile {
  return {
    thought_origin_axis: answers.SQ1 as Axis | undefined,
    thought_structure_axis: answers.SQ2 as Axis | undefined,
    thought_preferred_aspect: answers.SQ3 as Aspect | undefined,
    judgement_origin_axis: answers.SQ4 as Axis | undefined,
    judgement_principle_axis: answers.SQ5 as Axis | undefined,
    judgement_preferred_aspect: answers.SQ6 as Aspect | undefined,
    action_operation_axis: answers.SQ7 as Axis | undefined,
    action_orientation_axis: answers.SQ8 as Axis | undefined,
    action_preferred_aspect: answers.SQ9 as Aspect | undefined,
  };
}

export function calculateResult(answers: StoredAnswers): VapsResult {
  const scores = Object.fromEntries(allAxes.map((axis) => [axis, 0])) as Record<Axis, number>;
  const simple = extractSimpleProfile(answers);

  for (const question of detailQuestions) {
    const raw = answers[question.id];
    if (!raw) continue;

    const value = Number(raw);
    if (question.type === "normal" && question.axis && question.reverse_axis) {
      if (value === 1) scores[question.axis] += 5;
      if (value === 2) scores[question.axis] += 3;
      if (value === 3) {
        scores[question.axis] += 1;
        scores[question.reverse_axis] += 1;
      }
      if (value === 4) scores[question.reverse_axis] += 3;
      if (value === 5) scores[question.reverse_axis] += 5;
    }

    if (question.type === "bonus" && question.aspect) {
      const targetAspect = value <= 3 ? question.aspect : question.reverse_aspect ?? reverseAspect[question.aspect];
      const points = value === 1 || value === 5 ? 3 : value === 2 || value === 4 ? 1 : 0;
      if (points > 0) {
        for (const axis of axisPairs[targetAspect]) scores[axis] += points;
      }
    }
  }

  const thoughtAxis = decideLayerAxis("thought", scores, simple);
  const judgementAxis = decideLayerAxis("judgement", scores, simple);
  const actionAxis = decideLayerAxis("action", scores, simple);
  const typeCode = `${thoughtAxis}${judgementAxis}${actionAxis}`;
  const valueTypeCode = buildValueTypeCode(simple);
  const identityMatch = calculateIdentityMatch(typeCode, valueTypeCode);
  const axisRanking = [...allAxes].sort((a, b) => scores[b] - scores[a] || allAxes.indexOf(a) - allAxes.indexOf(b));
  const state = calculateState([thoughtAxis, judgementAxis, actionAxis], axisRanking, scores, identityMatch);
  const type = typeData[typeCode] ?? typeData.HSO;
  const valueType = typeData[valueTypeCode] ?? type;

  return {
    typeCode,
    groupCode: type.groupCode,
    groupName: type.groupName,
    typeName: type.typeName,
    state,
    valueTypeCode,
    valueGroupName: valueType.groupName,
    valueTypeName: valueType.typeName,
    identityMatch,
    axisRanking,
    axisScores: scores,
    core: type.core,
    simpleProfile: simple,
  };
}

function decideLayerAxis(
  layer: keyof typeof layerAxes,
  scores: Record<Axis, number>,
  simple: SimpleProfile,
): Axis {
  const axes = layerAxes[layer];
  const max = Math.max(...axes.map((axis) => scores[axis]));
  let candidates = axes.filter((axis) => scores[axis] === max);
  if (candidates.length === 1) return candidates[0];

  const aspectTotals = Object.fromEntries(
    layerAspects[layer].map((aspect) => [aspect, axisPairs[aspect].reduce((sum, axis) => sum + scores[axis], 0)]),
  ) as Record<Aspect, number>;

  const bestAspectTotal = Math.max(...layerAspects[layer].map((aspect) => aspectTotals[aspect]));
  const bestAspects = layerAspects[layer].filter((aspect) => aspectTotals[aspect] === bestAspectTotal);
  const aspectFiltered = candidates.filter((axis) => bestAspects.some((aspect) => axisPairs[aspect].includes(axis)));
  if (aspectFiltered.length > 0) candidates = aspectFiltered;
  if (candidates.length === 1) return candidates[0];

  const simpleAxes = getSimpleAxesForLayer(layer, simple);
  const selfMatched = candidates.find((axis) => simpleAxes.includes(axis));
  if (selfMatched) return selfMatched;

  const preferredAspect = getPreferredAspectForLayer(layer, simple);
  if (preferredAspect) {
    const preferred = candidates.find((axis) => axisPairs[preferredAspect].includes(axis));
    if (preferred) return preferred;
  }

  return candidates[0];
}

function buildValueTypeCode(simple: SimpleProfile): string {
  const thought = pickSimpleLayerAxis(
    simple.thought_preferred_aspect,
    simple.thought_origin_axis,
    simple.thought_structure_axis,
  );
  const judgement = pickSimpleLayerAxis(
    simple.judgement_preferred_aspect,
    simple.judgement_origin_axis,
    simple.judgement_principle_axis,
  );
  const action = pickSimpleLayerAxis(
    simple.action_preferred_aspect,
    simple.action_operation_axis,
    simple.action_orientation_axis,
  );

  return `${thought ?? "H"}${judgement ?? "S"}${action ?? "O"}`;
}

function pickSimpleLayerAxis(preferred: Aspect | undefined, firstAxis?: Axis, secondAxis?: Axis): Axis | undefined {
  if (!preferred) return firstAxis ?? secondAxis;
  const firstAspect = preferred.endsWith("origin") || preferred.endsWith("operation");
  return firstAspect ? firstAxis ?? secondAxis : secondAxis ?? firstAxis;
}

function calculateIdentityMatch(typeCode: string, valueTypeCode: string): "同一" | "近似" | "乖離" {
  const matches = [...typeCode].filter((char, index) => char === valueTypeCode[index]).length;
  if (matches === 3) return "同一";
  if (matches === 2) return "近似";
  return "乖離";
}

function calculateState(
  typeAxes: Axis[],
  ranking: Axis[],
  scores: Record<Axis, number>,
  identityMatch: VapsResult["identityMatch"],
): VapsResult["state"] {
  const top3 = ranking.slice(0, 3);
  const top5 = ranking.slice(0, 5);
  const hasAllInTop3 = typeAxes.every((axis) => top3.includes(axis));
  const hasAllInTop5 = typeAxes.every((axis) => top5.includes(axis));

  if (hasAllInTop3 && identityMatch === "同一") return "成熟";
  if (hasAllInTop3 && scores[ranking[2]] - scores[ranking[3]] >= 2) return "安定";
  if (hasAllInTop5) return "経過";
  return "不安定";
}

function getSimpleAxesForLayer(layer: keyof typeof layerAxes, simple: SimpleProfile): Axis[] {
  if (layer === "thought") return [simple.thought_origin_axis, simple.thought_structure_axis].filter(Boolean) as Axis[];
  if (layer === "judgement") return [simple.judgement_origin_axis, simple.judgement_principle_axis].filter(Boolean) as Axis[];
  return [simple.action_operation_axis, simple.action_orientation_axis].filter(Boolean) as Axis[];
}

function getPreferredAspectForLayer(layer: keyof typeof layerAxes, simple: SimpleProfile): Aspect | undefined {
  if (layer === "thought") return simple.thought_preferred_aspect;
  if (layer === "judgement") return simple.judgement_preferred_aspect;
  return simple.action_preferred_aspect;
}
