const VARIANTS = {
  fulfilled: { tone: "success", text: "Fulfilled" },
  pending: { tone: "warning", text: "Pending" },
  delayed: { tone: "danger", text: "Delayed" },
  draft: { tone: "neutral", text: "Draft" },
  in_progress: { tone: "info", text: "In progress" },
};

export default function StatusBadge({ status }) {
  const v = VARIANTS[status?.toLowerCase()] || { tone: "neutral", text: status };
  return <span className={`status ${v.tone}`}>{v.text}</span>;
}