"use client";
import Icon from "../erp/Icon";
import { cx } from "./cx";

/** tone: blue | red | green | amber | gray   variant: soft | solid | outline   size: sm | md */
export function Badge({ tone = "gray", variant = "soft", size = "md", icon, className, children }) {
  return (
    <span className={cx("ui-badge", tone, variant, size, className)}>
      {icon && <Icon name={icon} size={11} stroke={2.4} />}{children}
    </span>
  );
}

/** Removable filter chip */
export function Chip({ children, onRemove, className }) {
  return (
    <span className={cx("ui-chip", className)}>
      {children}
      {onRemove && <button type="button" onClick={onRemove} aria-label={`Remove ${typeof children === "string" ? children : "filter"}`}><Icon name="x" size={12} stroke={2.4} /></button>}
    </span>
  );
}
