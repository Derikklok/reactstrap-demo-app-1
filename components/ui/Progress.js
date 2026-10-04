import { cx } from "./cx";

/** tone: blue | red | green | amber */
export default function Progress({ value = 0, max = 100, tone = "blue", label, showValue = false, height = 6, className }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cx("ui-progress", className)}>
      {(label || showValue) && (
        <div className="d-flex justify-content-between mb-1" style={{ fontSize: ".74rem" }}>
          <span className="fw-semibold">{label}</span>{showValue && <span className="num text-secondary">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="track" style={{ height }} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <span data-tone={tone} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
