import Link from "next/link";

export default function PageHeader({ title, crumbs = [], actions }) {
  return (
    <div className="page-header">
      <div>
        <div className="crumbs">
          {crumbs.map((c, i) => (
            <span key={c.label}>
              {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
              {i < crumbs.length - 1 && " / "}
            </span>
          ))}
        </div>
        <h1>{title}</h1>
      </div>
      <div className="d-flex align-items-center gap-2">{actions}</div>
    </div>
  );
}
