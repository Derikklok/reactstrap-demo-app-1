import { cx } from "./cx";

/** CSS-only tooltip for short labels (icon buttons). Avoid inside overflow-hidden containers. side: top | bottom */
export default function Tooltip({
  content,
  side = "top",
  children,
  className,
}) {
  return (
    <span
      className={cx("ui-tip", side === "bottom" && "bottom", className)}
      data-tip={content}
    >
      {children}
    </span>
  );
}
