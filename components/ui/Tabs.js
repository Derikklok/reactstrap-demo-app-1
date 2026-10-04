"use client";
import Icon from "../erp/Icon";
import { cx } from "./cx";

/** items: [{ key, label, count?, tone?: "danger", icon? }]  variant: underline | pills */
export default function Tabs({
  items,
  value,
  onChange,
  variant = "underline",
  className,
  ...rest
}) {
  const onKey = (e, i) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n =
      (i + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length;
    onChange?.(items[n].key);
    e.currentTarget.parentElement.children[n]?.focus();
  };
  return (
    <div
      role="tablist"
      className={cx("ui-tabs", variant === "pills" && "pills", className)}
      {...rest}
    >
      {items.map((it, i) => (
        <button
          key={it.key}
          type="button"
          role="tab"
          className="ui-tab"
          aria-selected={it.key === value}
          tabIndex={it.key === value ? 0 : -1}
          onClick={() => onChange?.(it.key)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {it.icon && <Icon name={it.icon} size={14} />}
          {it.label}
          {it.count != null && (
            <span className={cx("count", it.tone)}>{it.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
