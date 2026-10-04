import { cx } from "./cx";

/** items: [{ label, value, span? }]  columns: 1 | 2 | 3 */
export default function DescriptionList({ items, columns = 2, className }) {
  return (
    <dl className={cx("ui-dl", className)} style={{ "--cols": columns }}>
      {items.map((it) => (
        <div
          key={it.label}
          style={it.span ? { gridColumn: `span ${it.span}` } : undefined}
        >
          <dt>{it.label}</dt>
          <dd>{it.value ?? "-"}</dd>
        </div>
      ))}
    </dl>
  );
}
