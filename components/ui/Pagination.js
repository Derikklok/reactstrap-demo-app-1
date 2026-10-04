"use client";
import Icon from "../erp/Icon";
import { cx } from "./cx";

function windowed(p, n) {
  if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1);
  const out = [1], s = Math.max(2, p - 1), e = Math.min(n - 1, p + 1);
  if (s > 2) out.push("l");
  for (let i = s; i <= e; i++) out.push(i);
  if (e < n - 1) out.push("r");
  out.push(n);
  return out;
}

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange, pageSizeOptions = [10, 25, 50], className }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = total ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, total);
  return (
    <div className={cx("table-foot", className)}>
      <div className="d-flex align-items-center gap-3">
        <span>Showing <b className="num">{start}–{end}</b> of <b className="num">{total}</b></span>
        {onPageSizeChange && (
          <label className="d-flex align-items-center gap-2 mb-0">
            Rows
            <select className="form-select form-select-sm" style={{ width: 70, fontSize: ".74rem" }} value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
              {pageSizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        )}
      </div>
      <div className="pager">
        <button disabled={page === 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page"><Icon name="chevL" size={13} /></button>
        {windowed(page, pages).map((p) => typeof p === "string"
          ? <span key={p} className="px-1 text-secondary">…</span>
          : <button key={p} className={page === p ? "on" : ""} aria-current={page === p ? "page" : undefined} onClick={() => onPageChange(p)}>{p}</button>)}
        <button disabled={page === pages} onClick={() => onPageChange(page + 1)} aria-label="Next page"><Icon name="chevR" size={13} /></button>
      </div>
    </div>
  );
}
