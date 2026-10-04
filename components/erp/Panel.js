/** Standard card with title/subtitle/actions header */
export default function Panel({
  title,
  subtitle,
  actions,
  children,
  bodyClassName = "erp-card-body",
  className = "",
}) {
  return (
    <section className={`erp-card ${className}`}>
      <div className="erp-card-header">
        <div>
          <h3 className="erp-card-title">{title}</h3>
          {subtitle && <p className="erp-card-sub">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
