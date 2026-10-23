// Feature-pack helpers: record filtering, export, deterministic insights over own records.
export function filterRecords(rows, { q = "", status = "", risk = "" } = {}) {
  const needle = String(q).trim().toLowerCase();
  return (rows || []).filter((r) => {
    if (status && r.status !== status) return false;
    if (risk && r.risk !== risk) return false;
    if (!needle) return true;
    return [r.reference, r.title, r.owner, r.status, r.risk].some((v) => String(v ?? "").toLowerCase().includes(needle));
  });
}
export function recordsToCsv(rows) {
  const cols = ["id","reference","title","status","owner","risk","due_date","amount"];
  const esc = (v) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  return [cols.join(","), ...(rows || []).map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n") + "\n";
}
const INSIGHT_LABELS = { "exposure-summary": "Case-rate variance summary", "variance-watch": "Outlier reconciliation queue", "priority-queue": "Overdue reconciliation reviews" };
export const INSIGHT_TYPES = Object.keys(INSIGHT_LABELS);
export function buildInsight(type, feature, rows) {
  if (!INSIGHT_LABELS[type]) { const e = new Error("Unknown insight type"); e.status = 400; throw e; }
  const list = rows || [];
  const totalAmount = list.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const highRisk = list.filter((r) => ["High","Critical"].includes(r.risk)).length;
  const now = new Date().toISOString().slice(0, 10);
  const overdue = list.filter((r) => r.due_date && String(r.due_date).slice(0, 10) < now && !["Approved","Closed"].includes(r.status));
  const byStatus = {}; for (const r of list) byStatus[r.status || "Unknown"] = (byStatus[r.status || "Unknown"] || 0) + 1;
  const top = [...list].sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0)).slice(0, 5);
  const sections = [
    { title: "Record count", detail: String(list.length) },
    { title: "Represented value", detail: String(totalAmount) },
    { title: "High or critical risk records", detail: String(highRisk) },
    { title: "Overdue open records", detail: String(overdue.length) },
    { title: "Status breakdown", detail: Object.entries(byStatus).map(([k, v]) => `${k}: ${v}`).join("; ") || "No records" },
    { title: "Largest records by value", detail: top.map((r) => `${r.reference || r.id} (${r.amount ?? 0})`).join("; ") || "No records" },
  ];
  if (type === "priority-queue") sections.push({ title: "Priority queue", detail: overdue.map((r) => r.reference || String(r.id)).join("; ") || "No overdue records" });
  return { type, title: INSIGHT_LABELS[type], featureId: feature.id, aiGenerated: false, mode: "deterministic-fallback", source: "own-records", generatedFrom: list.length,
    note: "Deterministic summary of this workspace's own saved records. No provider call was made; validate source evidence before acting.",
    metrics: [{ label: "Records", value: list.length }, { label: "Represented value", value: totalAmount }, { label: "High/critical risk", value: highRisk }, { label: "Overdue open", value: overdue.length }], sections };
}
