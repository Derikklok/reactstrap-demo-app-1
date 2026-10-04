"use client";
import { useEffect, useMemo, useState } from "react";
import { Row, Col } from "reactstrap";
import PageHeader from "@/components/erp/PageHeader";
import MetricCard from "@/components/erp/MetricCard";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/erp/StatusBadge";
import {
  Alert, Avatar, Badge, Button, Chip, ConfirmDialog, Dropdown, EmptyState, Input, Select, Tabs, Toolbar, Tooltip, useToast,
} from "@/components/ui";
import POFormModal from "@/components/ui/POFormModal";
import PODetailsDrawer from "@/components/ui/PODetailsDrawer";
import { PRIORITIES, TODAY, WAREHOUSES, isOverdue, makeSeed, money, units } from "@/utils/data";

export default function PurchaseOrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState(makeSeed);
  const [loading, setLoading] = useState(true);

  // filters
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [wh, setWh] = useState("");
  const [prio, setPrio] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // overlays
  const [form, setForm] = useState({ open: false, order: null });
  const [detailsId, setDetailsId] = useState(null);
  const [voiding, setVoiding] = useState(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  // ----- derived data -----
  const base = useMemo(() => orders.filter((o) =>
    (!q || `${o.poNumber} ${o.supplier} ${o.requester}`.toLowerCase().includes(q.toLowerCase())) &&
    (!wh || o.warehouse === wh) && (!prio || o.priority === prio) &&
    (!from || o.orderDate >= from) && (!to || o.orderDate <= to)), [orders, q, wh, prio, from, to]);

  const rows = useMemo(() => tab === "all" ? base : tab === "overdue" ? base.filter(isOverdue) : base.filter((o) => o.status === tab), [base, tab]);
  const count = (fn) => base.filter(fn).length;
  const tabs = [
    { key: "all", label: "All", count: base.length },
    { key: "draft", label: "Draft", count: count((o) => o.status === "draft") },
    { key: "pending", label: "Pending approval", count: count((o) => o.status === "pending") },
    { key: "in_progress", label: "In progress", count: count((o) => o.status === "in_progress") },
    { key: "delayed", label: "Delayed", count: count((o) => o.status === "delayed"), tone: "danger" },
    { key: "fulfilled", label: "Fulfilled", count: count((o) => o.status === "fulfilled") },
  ];

  const open = orders.filter((o) => o.status !== "fulfilled" && o.status !== "draft");
  const overdueCount = orders.filter(isOverdue).length;
  const details = orders.find((o) => o.id === detailsId) || null;

  const chips = [
    wh && { label: wh, clear: () => setWh("") },
    prio && { label: `${prio[0].toUpperCase() + prio.slice(1)} priority`, clear: () => setPrio("") },
    from && { label: `From ${from}`, clear: () => setFrom("") },
    to && { label: `To ${to}`, clear: () => setTo("") },
  ].filter(Boolean);
  const clearFilters = () => { setQ(""); setWh(""); setPrio(""); setFrom(""); setTo(""); setTab("all"); };

  // ----- actions -----
  const nextId = () => Math.max(0, ...orders.map((o) => o.id)) + 1;
  const poFor = (id) => `PO-${90213 + id}`;

  const saveOrder = (data) => {
    if (data.id) {
      setOrders((l) => l.map((o) => (o.id === data.id ? { ...o, ...data } : o)));
      toast.success(`${data.poNumber} updated`);
    } else {
      const id = nextId();
      const po = { ...data, id, poNumber: poFor(id), requester: "Amara Kapoor" };
      setOrders((l) => [po, ...l]);
      toast.success(`${po.poNumber} created`, { message: po.status === "draft" ? "Saved as a draft." : po.status === "pending" ? "Sent for approval." : "Sent to the supplier." });
    }
    setForm({ open: false, order: null });
  };

  const approve = (o) => {
    setOrders((l) => l.map((x) => (x.id === o.id ? { ...x, status: "in_progress" } : x)));
    toast.success(`${o.poNumber} approved`, { message: `Sent to ${o.supplier}.` });
  };

  const duplicate = (o) => {
    const id = nextId();
    const copy = { ...o, id, poNumber: poFor(id), status: "draft", orderDate: TODAY, lines: o.lines.map((l) => ({ ...l, id: `${id}-${l.id}` })) };
    setOrders((l) => [copy, ...l]);
    toast.info(`${copy.poNumber} created as a draft`, { message: `Copied from ${o.poNumber}.` });
  };

  const confirmVoid = () => {
    const o = voiding;
    setOrders((l) => l.filter((x) => x.id !== o.id));
    setVoiding(null);
    if (detailsId === o.id) setDetailsId(null);
    toast.show({ tone: "success", title: `${o.poNumber} voided`, action: { label: "Undo", onClick: () => setOrders((l) => [o, ...l]) } });
  };

  const exportCsv = () => {
    const head = ["PO", "Supplier", "Warehouse", "Order date", "Expected", "Priority", "Status", "Total"];
    const lines = rows.map((o) => [o.poNumber, `"${o.supplier}"`, o.warehouse, o.orderDate, o.expectedDate, o.priority, o.status, o.amount].join(","));
    const url = URL.createObjectURL(new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: "purchase-orders.csv" }).click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${rows.length} orders`);
  };

  // ----- table columns -----
  const columns = [
    { key: "poNumber", header: "PO number", sortable: true, render: (r) => <span className="row-link num">{r.poNumber}</span> },
    { key: "supplier", header: "Supplier", sortable: true, render: (r) => (
      <div className="d-flex align-items-center gap-2">
        <Avatar name={r.supplier} size="sm" />
        <div><div className="fw-semibold">{r.supplier}</div><small className="text-secondary">{r.requester}</small></div>
      </div>
    )},
    { key: "lines", header: "Lines", align: "right", sortable: true, sortValue: (r) => r.lines.length, render: (r) => (
      <div><span className="num">{r.lines.length}</span> <small className="text-secondary">· {units(r.lines).toLocaleString("en-US")} units</small></div>
    )},
    { key: "amount", header: "Total", align: "right", sortable: true, render: (r) => <b className="num">{money(r.amount)}</b> },
    { key: "warehouse", header: "Warehouse", sortable: true, render: (r) => <span className="wh-tag mono">{r.warehouse}</span> },
    { key: "expectedDate", header: "Expected", sortable: true, render: (r) => (
      <div className="d-flex align-items-center gap-2">
        <span className={`num ${isOverdue(r) ? "text-danger fw-semibold" : "text-secondary"}`}>{r.expectedDate}</span>
        {isOverdue(r) && <Badge tone="red" size="sm">Overdue</Badge>}
      </div>
    )},
    { key: "priority", header: "Priority", sortable: true, render: (r) => (
      <Badge size="sm" tone={r.priority === "urgent" ? "red" : r.priority === "high" ? "amber" : "gray"} variant={r.priority === "urgent" ? "solid" : "soft"}>
        {r.priority[0].toUpperCase() + r.priority.slice(1)}
      </Badge>
    )},
    { key: "status", header: "Status", sortable: true, render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", header: "", align: "right", width: 56, render: (r) => (
      <Dropdown items={[
        { label: "View details", icon: "eye", onClick: () => setDetailsId(r.id) },
        { label: "Edit", icon: "edit", onClick: () => setForm({ open: true, order: r }) },
        { label: "Duplicate", icon: "copy", onClick: () => duplicate(r) },
        ...(r.status === "draft" || r.status === "pending" ? [{ label: "Approve and send", icon: "check", onClick: () => approve(r) }] : []),
        { divider: true },
        { label: "Void order", icon: "trash", danger: true, onClick: () => setVoiding(r) },
      ]} />
    )},
  ];

  return (
    <>
      <PageHeader
        title="Purchase orders"
        crumbs={[{ label: "Operations", href: "/" }, { label: "Purchase orders" }]}
        actions={
          <>
            <Button variant="ghost" icon="download" onClick={exportCsv}>Export</Button>
            <Button icon="plus" onClick={() => setForm({ open: true, order: null })}>New purchase order</Button>
          </>
        }
      />

      {overdueCount > 0 && tab !== "overdue" && (
        <Alert tone="warning" title={`${overdueCount} orders are past their expected delivery date.`} className="mb-3"
          action={<Button variant="ghost" size="sm" iconRight="arrowRight" onClick={() => setTab("overdue")}>Review overdue</Button>}>
          Contact the suppliers or move the dates to keep the schedule accurate.
        </Alert>
      )}

      <Row className="g-3 mb-3">
        <Col xs={12} sm={6} xl={3}><MetricCard tone="blue" label="Open order value" value={money(open.reduce((s, o) => s + o.amount, 0))} subtext={`${open.length} orders in flight`} spark={[40, 52, 49, 61, 58, 70, 76]} /></Col>
        <Col xs={12} sm={6} xl={3}><MetricCard tone="amber" label="Awaiting approval" value={orders.filter((o) => o.status === "pending").length} subtext="Finance sign-off needed" spark={[2, 3, 3, 5, 4, 6, 5]} /></Col>
        <Col xs={12} sm={6} xl={3}><MetricCard tone="red" label="Overdue" value={overdueCount} trend="up" trendValue="2" good={false} subtext="Past expected date" spark={[1, 2, 2, 3, 3, 4, overdueCount]} /></Col>
        <Col xs={12} sm={6} xl={3}><MetricCard tone="green" label="Fulfilled this month" value={orders.filter((o) => o.status === "fulfilled").length} trend="up" trendValue="12%" subtext="Avg. lead time 9 days" spark={[3, 4, 4, 5, 6, 6, 7]} /></Col>
      </Row>

      <Tabs aria-label="Order status" value={tab} onChange={setTab} className="mb-3"
        items={[...tabs, ...(tab === "overdue" ? [{ key: "overdue", label: "Overdue", count: count(isOverdue), tone: "danger" }] : [])]} />

      <Toolbar className="mb-2"
        left={
          <>
            <Input size="sm" type="search" startIcon="search" placeholder="Search PO, supplier or requester" aria-label="Search orders"
              wrapperStyle={{ width: 260 }} value={q} onChange={(e) => setQ(e.target.value)} />
            <Select size="sm" aria-label="Warehouse" wrapperStyle={{ width: 150 }} value={wh} onChange={(e) => setWh(e.target.value)} placeholder="All warehouses" options={WAREHOUSES} />
            <Select size="sm" aria-label="Priority" wrapperStyle={{ width: 130 }} value={prio} onChange={(e) => setPrio(e.target.value)} placeholder="Any priority" options={PRIORITIES} />
            <Input size="sm" type="date" aria-label="Ordered from" wrapperStyle={{ width: 140 }} value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input size="sm" type="date" aria-label="Ordered to" wrapperStyle={{ width: 140 }} value={to} onChange={(e) => setTo(e.target.value)} />
          </>
        }
        right={
          <Tooltip content="Print this list" side="bottom">
            <Button variant="ghost" size="sm" icon="print" aria-label="Print" onClick={() => window.print()} />
          </Tooltip>
        }
      />

      {chips.length > 0 && (
        <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
          <span className="text-secondary small">Filtered by</span>
          {chips.map((c) => <Chip key={c.label} onRemove={c.clear}>{c.label}</Chip>)}
          <Button variant="link" size="xs" onClick={clearFilters}>Clear all</Button>
        </div>
      )}

      <DataTable
        columns={columns} rows={rows} loading={loading} pageSize={8}
        defaultSort={{ key: "orderDate", dir: "desc" }}
        onRowClick={(r) => setDetailsId(r.id)}
        rowClassName={(r) => (isOverdue(r) ? "row-alert" : "")}
        bulkActions={({ selectedIds, clear }) => (
          <>
            <button onClick={() => { setOrders((l) => l.map((o) => (selectedIds.includes(o.id) && (o.status === "draft" || o.status === "pending") ? { ...o, status: "in_progress" } : o))); toast.success(`${selectedIds.length} orders approved`); clear(); }}>Approve</button>
            <button onClick={() => { setOrders((l) => l.filter((o) => !selectedIds.includes(o.id))); toast.success(`${selectedIds.length} orders voided`); clear(); }}>Void</button>
          </>
        )}
        emptyState={
          <EmptyState icon="filter" compact title="No purchase orders match"
            description="Change the status tab or filters, or create a new order."
            action={<div className="d-flex gap-2 justify-content-center"><Button variant="ghost" size="sm" onClick={clearFilters}>Clear filters</Button><Button size="sm" icon="plus" onClick={() => setForm({ open: true, order: null })}>New purchase order</Button></div>} />
        }
      />

      <PODetailsDrawer order={details} onClose={() => setDetailsId(null)} onVoid={setVoiding}
        onEdit={(o) => setForm({ open: true, order: o })} onApprove={approve} />

      <POFormModal open={form.open} order={form.order} onClose={() => setForm({ open: false, order: null })} onSave={saveOrder} />

      <ConfirmDialog open={!!voiding} onClose={() => setVoiding(null)} onConfirm={confirmVoid}
        title={`Void ${voiding?.poNumber}?`} confirmLabel="Void order">
        The order to {voiding?.supplier} will be removed from the active list. You can undo this right after.
      </ConfirmDialog>
    </>
  );
}