"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { betaProtectedHref } from "@/lib/vaps-beta-access";
import { vapsPublicMode } from "@/lib/vaps-public-config";
import {
  diagnosisQuestions,
  sectionColors,
} from "@/lib/vaps-data";
import type { StoredAnswers } from "@/lib/vaps-scoring";

const storageKey = "vapsAnswers";
const detailScale = [
  { value: 5, label: "同意しない" },
  { value: 4, label: "あまり同意しない" },
  { value: 3, label: "どちらでもない" },
  { value: 2, label: "少し同意する" },
  { value: 1, label: "同意する" },
];

function getQuestionSection(question: (typeof diagnosisQuestions)[number]): string {
  return question.kind === "simple" ? question.page : question.category;
}

const sections = diagnosisQuestions.reduce<Array<{ key: string; questions: typeof diagnosisQuestions }>>(
  (items, question) => {
    const key = getQuestionSection(question);
    const last = items[items.length - 1];
    if (last?.key === key) {
      last.questions.push(question);
    } else {
      items.push({ key, questions: [question] });
    }
    return items;
  },
  [],
);

const questionStartIndexes = sections.reduce<number[]>((indexes, section, index) => {
  const previousStart = indexes[index - 1] ?? 0;
  const previousLength = sections[index - 1]?.questions.length ?? 0;
  return [...indexes, previousStart + previousLength];
}, []);

function getStepFromLocation() {
  if (typeof window === "undefined") return 0;
  const value = Number(new URLSearchParams(window.location.search).get("step") ?? "0");
  if (Number.isNaN(value)) return 0;
  return Math.min(Math.max(value, 0), sections.length - 1);
}

function syncQuestionModeFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  if (vapsPublicMode === "beta") {
    window.localStorage.setItem("vapsQuestionMode", "beta");
    return "beta";
  }
  if (mode === "beta" || mode === "official") {
    window.localStorage.setItem("vapsQuestionMode", mode);
    return mode;
  }

  const currentMode = window.localStorage.getItem("vapsQuestionMode");
  if (currentMode !== "beta" && currentMode !== "official") {
    window.localStorage.setItem("vapsQuestionMode", "official");
  }
  return window.localStorage.getItem("vapsQuestionMode") ?? "official";
}

export default function DiagnosisPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<StoredAnswers>({});
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    syncQuestionModeFromLocation();
    const fallback = betaProtectedHref();
    if (fallback) {
      router.replace(fallback);
      return;
    }
    setStep(getStepFromLocation());
    const raw = window.localStorage.getItem(storageKey);
    if (raw) setAnswers(JSON.parse(raw) as StoredAnswers);
  }, [router]);

  useEffect(() => {
    const onPopState = () => setStep(getStepFromLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const currentSection = sections[step];
  const section = currentSection.key;
  const progress = Math.round(((step + 1) / sections.length) * 100);
  const isLastSection = step === sections.length - 1;
  const isSectionComplete = useMemo(
    () => currentSection.questions.every((question) => answers[question.id]),
    [answers, currentSection.questions],
  );

  function persist(nextAnswers: StoredAnswers) {
    setAnswers(nextAnswers);
    window.localStorage.setItem(storageKey, JSON.stringify(nextAnswers));
  }

  function goTo(nextStep: number) {
    const normalized = Math.min(Math.max(nextStep, 0), sections.length - 1);
    const mode = syncQuestionModeFromLocation();
    setStep(normalized);
    router.push(`/diagnosis?mode=${mode}&step=${normalized}`);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function selectAnswer(questionId: string, value: string | number) {
    setShowError(false);
    const nextAnswers = { ...answers, [questionId]: value };
    persist(nextAnswers);
  }

  function proceed() {
    if (!isSectionComplete) {
      setShowError(true);
      return;
    }

    if (isLastSection) {
      router.push("/survey");
      return;
    }

    goTo(step + 1);
  }

  return (
    <main className="diagnosis" style={{ "--section-color": sectionColors[section] } as React.CSSProperties}>
      <div className="question-panel">
        <div className="progress-line" aria-label={`進捗 ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="question-meta">
          <span>{step + 1}/{sections.length}</span>
        </div>

        <section className="question-box multi-question-box" key={currentSection.key}>
          {currentSection.questions.map((question, index) => {
            const selected = answers[question.id];
            const questionNumber = questionStartIndexes[step] + index + 1;

            return (
              <div className="question-item" key={question.id}>
                <div className="question-number">
                  Q{questionNumber}<span> / {diagnosisQuestions.length}</span>
                </div>
                <h1>{question.text}</h1>

                {question.kind === "simple" ? (
                  <div className="choices">
                    {question.choices.map((choice) => {
                      const value = choice.axis ?? choice.aspect ?? "";
                      return (
                        <button
                          className={`choice-button ${selected === value ? "selected" : ""}`}
                          key={choice.label}
                          type="button"
                          onClick={() => selectAnswer(question.id, value)}
                        >
                          {choice.label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="scale-field" aria-label="同意度">
                    <div className="scale-endpoints">
                      <span>同意しない</span>
                      <span>同意する</span>
                    </div>
                    <div className="scale-dots">
                      {detailScale.map((choice) => (
                        <button
                          aria-label={choice.label}
                          className={`scale-dot ${Number(selected) === choice.value ? "selected" : ""}`}
                          key={choice.value}
                          type="button"
                          onClick={() => selectAnswer(question.id, choice.value)}
                        >
                          <span />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {showError && <p className="error">回答を選択してください。</p>}

          <div className="navigation">
            <button
              className="button secondary"
              type="button"
              onClick={() => (step === 0 ? router.push(vapsPublicMode === "beta" ? "/beta" : "/") : goTo(step - 1))}
            >
              戻る
            </button>
            <button className="button" type="button" onClick={proceed} disabled={!isSectionComplete}>
              次へ
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
