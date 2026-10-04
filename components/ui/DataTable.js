"use client";
import { useMemo, useState } from "react";
import Icon from "./Icon";
import Pagination from "../ui/Pagination";
import EmptyState from "../ui/EmptyState";
import Skeleton from "../ui/Skeleton";
import { cx } from "../ui/cx";

/**
 * columns: [{ key, header, align?, width?, sortable?, sortValue?(row), render?(row), cellClassName?, hidden? }]
 *
 * Common customisation points
 *  - selectable / selectedIds + onSelectionChange (controlled selection)
 *  - bulkActions({ selectedIds, clear }) => node      (custom bulk bar buttons)
 *  - onRowClick(row), rowClassName(row)
 *  - loading, emptyState (node), defaultSort { key, dir }
 *  - density: "compact" | "comfortable", stickyHeader + maxHeight
 *  - pageSize, pageSizeOptions, showFooter, className
 *  - onBulkDelete(ids): legacy shortcut that adds a "Void selected" button
 */
export default function DataTable({
  columns, rows = [], rowKey = "id",
  pageSize: initialPageSize = 10, pageSizeOptions = [10, 25, 50], showFooter = true,
  selectable = true, selectedIds, onSelectionChange, bulkActions, onBulkDelete,
  onRowClick, rowClassName, loading = false, emptyState, defaultSort,
  density = "compact", stickyHeader = false, maxHeight, className, ...rest
}) {
  const cols = columns.filter((c) => !c.hidden);
  const [sort, setSort] = useState(defaultSort || { key: null, dir: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [internal, setInternal] = useState([]);

  const selIds = selectedIds ?? internal;
  const sel = useMemo(() => new Set(selIds), [selIds]);
  const setSel = (set) => { const arr = [...set]; setInternal(arr); onSelectionChange?.(arr); };
  const activeSel = rows.filter((r) => sel.has(r[rowKey])).map((r) => r[rowKey]);

  const sorted = useMemo(() => {
    if (!sort.key) return rows;
    const col = columns.find((c) => c.key === sort.key);
    const get = col?.sortValue || ((r) => r[sort.key]);
    const m = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = get(a), y = get(b);
      if (x == null) return 1;
      if (y == null) return -1;
      return (typeof x === "string" ? x.localeCompare(y) : x - y) * m;
    });
  }, [rows, columns, sort]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pages);
  const view = sorted.slice((current - 1) * pageSize, current * pageSize);
  const allOnPage = view.length > 0 && view.every((r) => sel.has(r[rowKey]));

  const toggleSort = (key) => setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  const toggleRow = (id) => { const n = new Set(sel); n.has(id) ? n.delete(id) : n.add(id); setSel(n); };
  const togglePage = () => { const n = new Set(sel); view.forEach((r) => (allOnPage ? n.delete(r[rowKey]) : n.add(r[rowKey]))); setSel(n); };
  const clear = () => setSel(new Set());

  const handleRowClick = (e, row) => {
    if (!onRowClick || e.target.closest("button,a,input,label,select,textarea,[data-no-row-click]")) return;
    onRowClick(row);
  };

  const colSpan = cols.length + (selectable ? 1 : 0);

  return (
    <div className={cx("erp-card", className)} style={{ overflow: "visible" }} {...rest}>
      {selectable && activeSel.length > 0 && (
        <div className="bulk-bar" role="status">
          {activeSel.length} selected
          <button onClick={clear}>Clear</button>
          {bulkActions?.({ selectedIds: activeSel, clear })}
          {onBulkDelete && <button onClick={() => { onBulkDelete(activeSel); clear(); }}>Void selected</button>}
        </div>
      )}
      <div className="table-responsive" style={maxHeight ? { maxHeight } : undefined}>
        <table className={cx("table table-dense align-middle", density === "comfortable" && "comfortable", stickyHeader && "sticky")}>
          <thead>
            <tr>
              {selectable && (
                <th style={{ width: 38 }}>
                  <input type="checkbox" className="form-check-input mt-0" checked={allOnPage} onChange={togglePage} aria-label="Select all rows on this page" />
                </th>
              )}
              {cols.map((c) => (
                <th key={c.key} className={c.sortable ? "sortable" : ""} style={{ textAlign: c.align, width: c.width }}
                  onClick={c.sortable ? () => toggleSort(c.key) : undefined}
                  aria-sort={sort.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}>
                  {c.header}
                  {c.sortable && sort.key === c.key && <Icon name={sort.dir === "asc" ? "up" : "down"} size={12} stroke={2.6} style={{ marginLeft: 3 }} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 6 }, (_, i) => (
              <tr key={`s${i}`}>
                {Array.from({ length: colSpan }, (_, j) => <td key={j}><Skeleton w={j === 0 && selectable ? 14 : `${55 + ((i + j) % 4) * 10}%`} /></td>)}
              </tr>
            ))}
            {!loading && view.length === 0 && (
              <tr><td colSpan={colSpan}>{emptyState ?? <EmptyState compact title="No records found" description="Try changing or clearing your filters." />}</td></tr>
            )}
            {!loading && view.map((r) => (
              <tr key={r[rowKey]} className={cx(sel.has(r[rowKey]) && "selected", onRowClick && "clickable", rowClassName?.(r))}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={(e) => handleRowClick(e, r)}
                onKeyDown={onRowClick ? (e) => { if (e.key === "Enter" && e.target === e.currentTarget) onRowClick(r); } : undefined}>
                {selectable && (
                  <td><input type="checkbox" className="form-check-input mt-0" checked={sel.has(r[rowKey])} onChange={() => toggleRow(r[rowKey])} aria-label={`Select row ${r[rowKey]}`} /></td>
                )}
                {cols.map((c) => (
                  <td key={c.key} className={c.cellClassName} style={{ textAlign: c.align }}>{c.render ? c.render(r) : r[c.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showFooter && (
        <Pagination page={current} pageSize={pageSize} total={sorted.length} pageSizeOptions={pageSizeOptions}
          onPageChange={setPage} onPageSizeChange={(n) => { setPageSize(n); setPage(1); }} />
      )}
    </div>
  );
}
