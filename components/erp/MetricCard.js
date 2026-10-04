import Icon from "./Icon";
import { Sparkline } from "./Charts";

/** tone: "blue" | "red" | "green" | "amber"; trend "up"/"down"; good = whether that direction is desirable */
const ACCENT = {
  blue: "var(--blue-600)",
  red: "var(--red-600)",
  green: "var(--green-600)",
  amber: "var(--amber-600)",
};

export default function MetricCard({
  label,
  value,
  subtext,
  trend,
  trendValue,
  good = true,
  tone = "blue",
  spark,
}) {
  const sentiment = good ? "good" : "bad";
  return (
    <div className="erp-card metric" style={{ "--accent": ACCENT[tone] }}>
      <div className="d-flex justify-content-between align-items-start">
        <span className="metric-label">{label}</span>
        {trendValue && (
          <span className={`delta ${sentiment}`}>
            <Icon
              name={trend === "up" ? "up" : "down"}
              size={12}
              stroke={2.6}
            />
            {trendValue}
          </span>
        )}
      </div>
      <div className="d-flex justify-content-between align-items-end gap-2">
        <div>
          <div className="metric-value num">{value}</div>
          {subtext && <div className="metric-sub">{subtext}</div>}
        </div>
        {spark && <Sparkline data={spark} color={ACCENT[tone]} />}
      </div>
    </div>
  );
}
