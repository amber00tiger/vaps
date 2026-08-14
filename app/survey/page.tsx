"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { betaProtectedHref, getStoredQuestionMode } from "@/lib/vaps-beta-access";

type Survey = {
  displayName: string;
  ageGroup: string;
  gender: string;
  region: string;
};

const initialSurvey: Survey = {
  displayName: "",
  ageGroup: "unknown",
  gender: "no_answer",
  region: "unknown",
};

export default function SurveyPage() {
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey>(initialSurvey);

  useEffect(() => {
    const fallback = betaProtectedHref();
    if (fallback) {
      router.replace(fallback);
      return;
    }
    const raw = window.localStorage.getItem("vapsSurvey");
    if (raw) setSurvey({ ...initialSurvey, ...JSON.parse(raw) });
  }, [router]);

  function submit(event: FormEvent) {
    event.preventDefault();
    window.localStorage.setItem("vapsSurvey", JSON.stringify(survey));
    router.push("/analyzing");
  }

  return (
    <main className="shell">
      <form className="form-panel" onSubmit={submit}>
        <h1 className="page-title">任意アンケート</h1>
        <p className="lead">未回答のまま結果へ進めます。表示名は結果画面と共有用の仮データにだけ使います。</p>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="displayName">表示名</label>
            <input
              id="displayName"
              value={survey.displayName}
              onChange={(event) => setSurvey({ ...survey, displayName: event.target.value })}
              placeholder="名前を入力"
            />
          </div>

          <div className="field">
            <label htmlFor="ageGroup">年齢層</label>
            <select
              id="ageGroup"
              value={survey.ageGroup}
              onChange={(event) => setSurvey({ ...survey, ageGroup: event.target.value })}
            >
              <option value="unknown">回答しない</option>
              <option value="under_15">15歳未満</option>
              <option value="15_19">15〜19歳</option>
              <option value="20_24">20〜24歳</option>
              <option value="25_29">25〜29歳</option>
              <option value="30_34">30〜34歳</option>
              <option value="35_39">35〜39歳</option>
              <option value="40_44">40〜44歳</option>
              <option value="45_49">45〜49歳</option>
              <option value="50_54">50〜54歳</option>
              <option value="55_59">55〜59歳</option>
              <option value="60plus">60歳以上</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="gender">性別</label>
            <select
              id="gender"
              value={survey.gender}
              onChange={(event) => setSurvey({ ...survey, gender: event.target.value })}
            >
              <option value="no_answer">回答しない</option>
              <option value="female">女性</option>
              <option value="male">男性</option>
              <option value="other">その他</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="region">居住地域</label>
            <select
              id="region"
              value={survey.region}
              onChange={(event) => setSurvey({ ...survey, region: event.target.value })}
            >
              <option value="unknown">回答しない</option>
              <option value="japan">日本</option>
              <option value="east_asia">東アジア</option>
              <option value="southeast_asia">東南アジア</option>
              <option value="south_asia">南アジア</option>
              <option value="oceania">オセアニア</option>
              <option value="north_america">北米</option>
              <option value="latin_america">中南米</option>
              <option value="western_europe">西欧</option>
              <option value="northern_europe">北欧</option>
              <option value="eastern_europe">東欧</option>
              <option value="middle_east">中東</option>
              <option value="africa">アフリカ</option>
              <option value="other_region">その他</option>
            </select>
          </div>
        </div>

        <div className="button-row">
          <button className="button secondary" type="button" onClick={() => router.push(`/diagnosis?mode=${getStoredQuestionMode()}&step=47`)}>
            戻る
          </button>
          <button className="button" type="submit">
            結果を見る
          </button>
        </div>
      </form>
    </main>
  );
}
