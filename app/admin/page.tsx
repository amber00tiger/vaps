"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  averageRating,
  countBy,
  readAnalyticsRecords,
  toAnalyticsCsv,
  type AnalyticsRecord,
} from "@/lib/vaps-analytics";

const adminPassword = "vaps-admin";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [records, setRecords] = useState<AnalyticsRecord[]>([]);

  useEffect(() => {
    if (window.sessionStorage.getItem("vapsAdminAuthorized") === "yes") {
      setAuthorized(true);
      setRecords(readAnalyticsRecords());
    }
  }, []);

  function login(event: FormEvent) {
    event.preventDefault();
    if (password !== adminPassword) return;
    window.sessionStorage.setItem("vapsAdminAuthorized", "yes");
    setAuthorized(true);
    setRecords(readAnalyticsRecords());
  }

  function refresh() {
    setRecords(readAnalyticsRecords());
  }

  function downloadCsv() {
    const blob = new Blob([toAnalyticsCsv(records)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "vaps-analytics.csv";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  const stats = useMemo(
    () => ({
      age: countBy(records, (record) => record.survey.ageGroup),
      group: countBy(records, (record) => record.groupName),
      match: countBy(records, (record) => record.identityMatch),
      region: countBy(records, (record) => record.survey.region),
      source: countBy(records, (record) => record.source ?? "official"),
      state: countBy(records, (record) => record.state),
      type: countBy(records, (record) => record.typeCode),
    }),
    [records],
  );
  const officialRecords = records.filter((record) => (record.source ?? "official") === "official");
  const betaRecords = records.filter((record) => record.source === "beta");

  if (!authorized) {
    return (
      <main className="shell">
        <form className="admin-login" onSubmit={login}>
          <h1>VAPS 管理画面</h1>
          <p>ローカル確認用の仮ログインです。</p>
          <input
            aria-label="管理パスワード"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="パスワード"
            type="password"
            value={password}
          />
          <button className="button" type="submit">
            ログイン
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="shell">
      <div className="admin-layout">
        <header className="admin-header">
          <div>
            <h1>VAPS 管理画面</h1>
            <p>現在はこのブラウザに保存されたローカル回答だけを集計しています。</p>
          </div>
          <div className="button-row">
            <button className="button secondary" onClick={refresh} type="button">
              更新
            </button>
            <button className="button" disabled={records.length === 0} onClick={downloadCsv} type="button">
              CSV
            </button>
          </div>
        </header>

        <section className="admin-summary">
          <MetricCard label="総回答数" value={`${records.length}`} />
          <MetricCard label="納得度平均" value={records.length ? averageRating(records).toFixed(2) : "-"} />
          <MetricCard label="正式回答数" value={`${officialRecords.length}`} />
          <MetricCard label="テスト回答数" value={`${betaRecords.length}`} />
          <MetricCard label="正式納得度" value={officialRecords.length ? averageRating(officialRecords).toFixed(2) : "-"} />
          <MetricCard label="テスト納得度" value={betaRecords.length ? averageRating(betaRecords).toFixed(2) : "-"} />
          <MetricCard label="タイプ数" value={`${Object.keys(stats.type).length}`} />
          <MetricCard label="グループ数" value={`${Object.keys(stats.group).length}`} />
        </section>

        <div className="admin-grid">
          <Distribution title="入口別分布" data={stats.source} />
          <Distribution title="タイプ分布" data={stats.type} />
          <Distribution title="グループ分布" data={stats.group} />
          <Distribution title="状態分布" data={stats.state} />
          <Distribution title="一致度分布" data={stats.match} />
          <Distribution title="年代分布" data={stats.age} />
          <Distribution title="地域分布" data={stats.region} />
        </div>

        <section className="admin-table-section">
          <h2>回答ログ</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>日時</th>
                  <th>回答ID</th>
                  <th>入口</th>
                  <th>タイプ</th>
                  <th>グループ</th>
                  <th>状態</th>
                  <th>価値タイプ</th>
                  <th>一致度</th>
                  <th>納得度</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{new Date(record.createdAt).toLocaleString("ja-JP")}</td>
                    <td>{record.responseId ?? "-"}</td>
                    <td>{(record.source ?? "official") === "beta" ? "テスト" : "正式"}</td>
                    <td>
                      {record.typeCode} {record.typeName}
                    </td>
                    <td>{record.groupName}</td>
                    <td>{record.state}</td>
                    <td>
                      {record.valueTypeCode} {record.valueTypeName}
                    </td>
                    <td>{record.identityMatch}</td>
                    <td>{record.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <section className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </section>
  );
}

function Distribution({ data, title }: { data: Record<string, number>; title: string }) {
  const max = Math.max(...Object.values(data), 1);
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <section className="admin-card">
      <h2>{title}</h2>
      {entries.length === 0 ? (
        <p>まだデータがありません。</p>
      ) : (
        <div className="distribution-list">
          {entries.map(([label, count]) => (
            <div className="distribution-row" key={label}>
              <span>{label}</span>
              <div>
                <i style={{ width: `${(count / max) * 100}%` }} />
              </div>
              <strong>{count}</strong>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
