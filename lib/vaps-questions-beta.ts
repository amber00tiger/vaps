import { officialDetailQuestions, officialDiagnosisQuestions, officialSectionColors } from "./vaps-questions-official";

// テスト診断用の入口設定です。
// 現在は正式診断と同じ質問を使い、集計時の source だけ beta として分けます。
export const betaDiagnosisQuestions = officialDiagnosisQuestions;
export const betaDetailQuestions = officialDetailQuestions;
export const betaSectionColors = officialSectionColors;

// 合言葉はここで変更できます。
// 大文字小文字は区別しないようにしています。
export const betaPassphrase = "vaps-test";
