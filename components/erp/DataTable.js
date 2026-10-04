"use client";
import { useMemo, useState } from "react";
import { Table } from "reactstrap";
import Icon from "./Icon";

/**
 * columns: [{ key, header, align?, sortable?, render?(row) }]
 * Supports sorting, row selection with bulk bar, and pagination.
 */
export default function DataTable({
  columns,
  rows = [],
  pageSize = 8,
  rowKey = "id",
  onBulkDelete,
  emptyText = "No records match these filters.",
}) {
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());

  const sorted = useMemo(() => {
    if (!sort.key) return rows;
    const m = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort(
      (a, b) =>
        (a[sort.key] > b[sort.key] ? 1 : a[sort.key] < b[sort.key] ? -1 : 0) *
        m,
    );
  }, [rows, sort]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pages);
  const view = sorted.slice((current - 1) * pageSize, current * pageSize);
  const allOnPage =
    view.length > 0 && view.every((r) => selected.has(r[rowKey]));

  const toggleSort = (key) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  const toggleRow = (id) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const togglePage = () =>
    setSelected((s) => {
      const n = new Set(s);
      view.forEach((r) => (allOnPage ? n.delete(r[rowKey]) : n.add(r[rowKey])));
      return n;
    });

  return (
    <div className="erp-card" style={{ overflow: "hidden" }}>
      {selected.size > 0 && (
        <div className="bulk-bar" role="status">
          {selected.size} selected
          <button onClick={() => setSelected(new Set())}>Clear</button>
          {onBulkDelete && (
            <button
              onClick={() => {
                onBulkDelete([...selected]);
                setSelected(new Set());
              }}
            >
              Void selected
            </button>
          )}
        </div>
      )}
      <div className="table-responsive">
        <Table hover className="table-dense align-middle">
          <thead>
            <tr>
              <th style={{ width: 38 }}>
                <input
                  type="checkbox"
                  className="form-check-input mt-0"
                  checked={allOnPage}
                  onChange={togglePage}
                  aria-label="Select all on page"
                />
              </th>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={c.sortable ? "sortable" : ""}
                  style={{ textAlign: c.align }}
                  onClick={c.sortable ? () => toggleSort(c.key) : undefined}
                  aria-sort={
                    sort.key === c.key
                      ? sort.dir === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  {c.header}
                  {c.sortable && sort.key === c.key && (
                    <Icon
                      name={sort.dir === "asc" ? "up" : "down"}
                      size={12}
                      stroke={2.6}
                      style={{ marginLeft: 3 }}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-5 text-secondary"
                >
                  {emptyText}
                </td>
              </tr>
            )}
            {view.map((r) => (
              <tr
                key={r[rowKey]}
                className={selected.has(r[rowKey]) ? "selected" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    className="form-check-input mt-0"
                    checked={selected.has(r[rowKey])}
                    onChange={() => toggleRow(r[rowKey])}
                    aria-label={`Select row ${r[rowKey]}`}
                  />
                </td>
                {columns.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align }}>
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="table-foot">
        <span>
          Showing{" "}
          <b className="num">
            {sorted.length ? (current - 1) * pageSize + 1 : 0}–
            {Math.min(current * pageSize, sorted.length)}
          </b>{" "}
          of <b className="num">{sorted.length}</b>
        </span>
        <div className="pager">
          <button
            disabled={current === 1}
            onClick={() => setPage(current - 1)}
            aria-label="Previous page"
          >
            <Icon name="chevL" size={13} />
          </button>
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              className={current === i + 1 ? "on" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={current === pages}
            onClick={() => setPage(current + 1)}
            aria-label="Next page"
          >
            <Icon name="chevR" size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
