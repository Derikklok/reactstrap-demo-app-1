import Icon from "../erp/Icon";
import { cx } from "./cx";

export default function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
  compact = false,
  className,
}) {
  return (
    <div className={cx("ui-empty", compact && "compact", className)}>
      <span className="ui-empty-icon">
        <Icon name={icon} size={compact ? 20 : 24} />
      </span>
      {title && <h4>{title}</h4>}
      {description && <p>{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
