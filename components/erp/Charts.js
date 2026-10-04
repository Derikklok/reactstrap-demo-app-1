"use client";

/** Tiny inline trend line for KPI cards */
export function Sparkline({
  data,
  color = "var(--blue-600)",
  width = 96,
  height = 34,
}) {
  const max = Math.max(...data),
    min = Math.min(...data);
  const x = (i) => (i / (data.length - 1)) * width;
  const y = (v) => height - 3 - ((v - min) / (max - min || 1)) * (height - 6);
  const line = data
    .map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(" ");
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <path
        d={`${line} L${width},${height} L0,${height} Z`}
        fill={color}
        opacity="0.1"
      />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={x(data.length - 1)}
        cy={y(data[data.length - 1])}
        r="2.6"
        fill={color}
      />
    </svg>
  );
}

/** Two-series area chart: series = [{ name, color, values }] */
export function AreaChart({ labels, series, height = 240 }) {
  const W = 720,
    H = height,
    pad = { t: 12, r: 12, b: 26, l: 40 };
  const all = series.flatMap((s) => s.values);
  const max = Math.ceil(Math.max(...all) / 50) * 50;
  const iw = W - pad.l - pad.r,
    ih = H - pad.t - pad.b;
  const x = (i) => pad.l + (i / (labels.length - 1)) * iw;
  const y = (v) => pad.t + ih - (v / max) * ih;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      role="img"
      aria-label="Spend trend chart"
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <defs>
        {series.map((s, i) => (
          <linearGradient key={i} id={`ag-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={pad.l}
            x2={W - pad.r}
            y1={y(t)}
            y2={y(t)}
            stroke="#e8edf6"
          />
          <text
            x={pad.l - 8}
            y={y(t) + 4}
            textAnchor="end"
            className="chart-tip"
          >
            {t}k
          </text>
        </g>
      ))}
      {labels.map((l, i) => (
        <text
          key={l}
          x={x(i)}
          y={H - 6}
          textAnchor="middle"
          className="chart-tip"
        >
          {l}
        </text>
      ))}
      {series.map((s, si) => {
        const d = s.values
          .map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`)
          .join(" ");
        return (
          <g key={s.name}>
            <path
              d={`${d} L${x(s.values.length - 1)},${y(0)} L${x(0)},${y(0)} Z`}
              fill={`url(#ag-${si})`}
            />
            <path
              d={d}
              fill="none"
              stroke={s.color}
              strokeWidth="2.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {s.values.map((v, i) => (
              <circle
                key={i}
                cx={x(i)}
                cy={y(v)}
                r="3"
                fill="#fff"
                stroke={s.color}
                strokeWidth="2"
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/** Donut chart: segments = [{ label, value, color }] */
export function DonutChart({
  segments,
  size = 168,
  thickness = 22,
  centerLabel,
  centerValue,
}) {
  const r = (size - thickness) / 2,
    c = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + s.value, 0);
  const offsets = segments.reduce(
    (acc, s) => {
      acc.push(acc.at(-1) + (s.value / total) * c);
      return acc;
    },
    [0],
  );
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Order status breakdown"
    >
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#eef1f7"
          strokeWidth={thickness}
        />
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          return (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${Math.max(len - 3, 0)} ${c - len + 3}`}
              strokeDashoffset={-offsets[i]}
            />
          );
        })}
      </g>
      <text
        x="50%"
        y="48%"
        textAnchor="middle"
        fontSize="22"
        fontWeight="800"
        fill="var(--ink)"
      >
        {centerValue}
      </text>
      <text
        x="50%"
        y="62%"
        textAnchor="middle"
        fontSize="11"
        fill="var(--ink-3)"
      >
        {centerLabel}
      </text>
    </svg>
  );
}
