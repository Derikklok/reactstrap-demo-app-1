import { cx } from "./cx";

/** Layout shell for filters (left) and actions (right). Put any controls inside. */
export default function Toolbar({ left, right, children, className }) {
  return (
    <div className={cx("ui-toolbar erp-card", className)}>
      <div className="l">
        {left}
        {children}
      </div>
      {right && <div className="r">{right}</div>}
    </div>
  );
}
