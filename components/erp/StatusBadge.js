"use client";
import { Badge } from "reactstrap";

const STATUS_VARIANTS = {
  fulfilled: { color: "success", text: "Fulfilled" },
  pending: { color: "warning", text: "Pending" },
  delayed: { color: "danger", text: "Delayed" },
  draft: { color: "secondary", text: "Draft" },
  in_progress: { color: "info", text: "In Progress" },
};

export default function StatusBadge({ status }) {
  const config = STATUS_VARIANTS[status?.toLowerCase()] || { color: "dark", text: status };

  return (
    <Badge
      color={config.color}
      pill
      style={{
        fontSize: "0.65rem",
        padding: "0.2em 0.55em",
        fontWeight: 500,
      }}
    >
      {config.text}
    </Badge>
  );
}