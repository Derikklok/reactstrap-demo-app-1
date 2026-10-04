import { cx } from "./cx";

/** items: [{ title, description?, time?, tone?: blue|red|green|amber|gray }] */
export default function Timeline({ items, className }) {
  return (
    <ol className={cx("ui-timeline", className)}>
      {items.map((it, i) => (
        <li key={i} data-tone={it.tone || "blue"}>
          <span className="pt" />
          <div>
            <b>{it.title}</b>
            {it.description && <p>{it.description}</p>}
            {it.time && <time>{it.time}</time>}
          </div>
        </li>
      ))}
    </ol>
  );
}
