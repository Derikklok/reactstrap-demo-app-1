"use client";
import Icon from "../erp/Icon";
import { cx } from "./cx";

const ICONS = {
  info: "info",
  success: "checkCircle",
  warning: "alert",
  danger: "alert",
};

/** tone: info | success | warning | danger. action: node (e.g. a Button). */
export default function Alert({
  tone = "info",
  title,
  children,
  action,
  onDismiss,
  icon,
  className,
}) {
  return (
    <div
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      className={cx("ui-alert", tone, className)}
    >
      <Icon name={icon || ICONS[tone]} size={18} className="ic" />
      <div className="body">
        {title && <b>{title}</b>}
        {children && <div>{children}</div>}
      </div>
      {action}
      {onDismiss && (
        <button
          type="button"
          className="icon-btn"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <Icon name="x" size={15} />
        </button>
      )}
    </div>
  );
}
