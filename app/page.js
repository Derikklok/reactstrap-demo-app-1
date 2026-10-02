"use client";
import { useMemo, useState } from "react";
import { Row, Col } from "reactstrap";
import PageHeader from "@/components/erp/PageHeader";
import MetricCard from "@/components/erp/MetricCard";
import Panel from "@/components/erp/Panel";
import DenseToolbar from "@/components/erp/DenseToolbar";
import DataTable from "@/components/erp/DataTable";
import StatusBadge from "@/components/erp/StatusBadge";
import { AreaChart, DonutChart } from "@/components/erp/Charts";

const SEED = [
  ["PO-90214", "Acme Logistics", 42, 18450, "WH-East 01", "2026-03-28", "fulfilled"],
  ["PO-90215", "Global Steel Co", 120, 92300, "WH-Central 04", "2026-03-29", "pending"],
  ["PO-90216", "Apex Polymers", 15, 4800, "WH-East 01", "2026-03-29", "delayed"],
  ["PO-90217", "Precision Gears", 85, 33150, "WH-West 02", "2026-03-30", "in_progress"],
  ["PO-90218", "Delta Packaging", 210, 6200, "WH-East 01", "2026-03-30", "fulfilled"],
  ["PO-90219", "Dynasty Micro", 34, 14700, "WH-Central 04", "2026-03-31", "pending"],
  ["PO-90220", "Northwind Metals", 64, 41800, "WH-West 02", "2026-04-01", "in_progress"],
  ["PO-90221", "Helix Fasteners", 300, 9600, "WH-East 01", "2026-04-01", "draft"],
  ["PO-90222", "Orion Electronics", 18, 57200, "WH-Central 04", "2026-04-02", "delayed"],
  ["PO-90223", "Summit Chemicals", 52, 23900, "WH-West 02", "2026-04-02", "fulfilled"],
  ["PO-90224", "Bluefin Freight", 9, 3100, "WH-East 01", "2026-04-03", "pending"],
  ["PO-90225", "Crestline Tools", 77, 28450, "WH-Central 04", "2026-04-03", "in_progress"],
];
const ORDERS = SEED.map(([poNumber, supplier, items, amount, warehouse, date, status], i) => ({
  id: i + 1, poNumber, supplier, items, amount, warehouse, date, status,
}));

const COLUMNS = [
  { key: "poNumber", header: "PO number", sortable: true, render: (r) => <a href="#" className="row-link num">{r.poNumber}</a> },
  { key: "supplier", header: "Supplier", sortable: true },
  { key: "items", header: "SKUs", sortable: true, align: "right", render: (r) => <span className="num">{r.items}</span> },
  { key: "amount", header: "Total", sortable: true, align: "right", render: (r) => <b className="num">${r.amount.toLocaleString("en-US")}</b> },
  { key: "warehouse", header: "Warehouse", sortable: true, render: (r) => <span className="wh-tag mono">{r.warehouse}</span> },
  { key: "date", header: "Order date", sortable: true, render: (r) => <span className="num text-secondary">{r.date}</span> },
  { key: "status", header: "Status", sortable: true, render: (r) => <StatusBadge status={r.status} /> },
  { key: "actions", header: "", align: "right", render: () => (
    <div className="d-flex gap-1 justify-content-end">
      <button className="btn btn-xs btn-ghost">Edit</button>
      <button className="btn btn-xs btn-soft-danger">Void</button>
    </div>
  )},
];

const FEED = [
  { c: "var(--green-600)", t: <><b>PO-90218</b> received at WH-East 01</>, when: "12 min ago" },
  { c: "var(--red-600)", t: <><b>PO-90216</b> marked delayed by Apex Polymers</>, when: "34 min ago" },
  { c: "var(--blue-600)", t: <><b>SKU-1029</b> reordered, +500 units</>, when: "1 hr ago" },
  { c: "var(--amber-600)", t: <><b>PO-90215</b> waiting for finance sign-off</>, when: "2 hr ago" },
];

export default function DashboardPage() {
  const [q, setQ] = useState("");
  const [wh, setWh] = useState("");
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState(ORDERS);

  const filtered = useMemo(() => orders.filter((o) =>
    (!q || `${o.poNumber} ${o.supplier} ${o.warehouse}`.toLowerCase().includes(q.toLowerCase())) &&
    (!wh || o.warehouse === wh) && (!status || o.status === status)), [orders, q, wh, status]);

  const exportCsv = () => {
    const head = ["PO", "Supplier", "SKUs", "Total", "Warehouse", "Date", "Status"];
    const lines = filtered.map((o) => [o.poNumber, o.supplier, o.items, o.amount, o.warehouse, o.date, o.status].join(","));
    const url = URL.createObjectURL(new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: "purchase-orders.csv" }).click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Inventory & purchase orders"
        crumbs={[{ label: "Operations", href: "/" }, { label: "Dashboard" }]}
        actions={<span className="sync-chip"><i className="live-dot" />Synced just now · Plant 04 (EMEA)</span>}
      />

      <Row className="g-3 mb-3">
        <Col xs={12} sm={6} xl={3}><MetricCard tone="blue" label="Open purchase orders" value="48" trend="up" trendValue="8%" subtext="12 need sign-off" spark={[22, 26, 25, 30, 34, 41, 48]} /></Col>
        <Col xs={12} sm={6} xl={3}><MetricCard tone="green" label="Committed spend" value="$284.5k" trend="down" trendValue="3.1%" subtext="of $400k budget" spark={[330, 310, 305, 298, 292, 288, 284]} /></Col>
        <Col xs={12} sm={6} xl={3}><MetricCard tone="amber" label="Pending receipts" value="16" trend="up" trendValue="2" good={false} subtext="Docks 3 and 4" spark={[9, 11, 10, 12, 14, 13, 16]} /></Col>
        <Col xs={12} sm={6} xl={3}><MetricCard tone="red" label="Backorders" value="3" trend="down" trendValue="50%" subtext="Under SLA target" spark={[9, 8, 8, 6, 5, 4, 3]} /></Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col lg={8}>
          <Panel title="Spend vs. receipts" subtitle="Last 7 months, in thousands of USD"
            actions={<div className="legend"><span><i style={{ background: "var(--blue-600)" }} />Committed</span><span><i style={{ background: "var(--red-600)" }} />Received</span></div>}>
            <AreaChart labels={["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]} series={[
              { name: "Committed", color: "var(--blue-600)", values: [180, 210, 195, 260, 240, 275, 284] },
              { name: "Received", color: "var(--red-600)", values: [150, 170, 185, 205, 215, 230, 241] },
            ]} />
          </Panel>
        </Col>
        <Col lg={4}>
          <Panel title="Order status" subtitle="All open and recent orders" className="h-100">
            <div className="d-flex flex-column align-items-center gap-3">
              <DonutChart centerValue="124" centerLabel="orders" segments={[
                { label: "Fulfilled", value: 58, color: "var(--blue-600)" },
                { label: "In progress", value: 32, color: "var(--blue-500)" },
                { label: "Pending", value: 22, color: "#b9cdf5" },
                { label: "Delayed", value: 12, color: "var(--red-600)" },
              ]} />
              <div className="legend flex-wrap justify-content-center">
                <span><i style={{ background: "var(--blue-600)" }} />Fulfilled</span>
                <span><i style={{ background: "var(--blue-500)" }} />In progress</span>
                <span><i style={{ background: "#b9cdf5" }} />Pending</span>
                <span><i style={{ background: "var(--red-600)" }} />Delayed</span>
              </div>
            </div>
          </Panel>
        </Col>
      </Row>

      <DenseToolbar onSearch={setQ} onWarehouse={setWh} onStatus={setStatus} onExport={exportCsv} onPrint={() => window.print()} />

      <Row className="g-3">
        <Col xl={9}>
          <DataTable columns={COLUMNS} rows={filtered} pageSize={8}
            onBulkDelete={(ids) => setOrders((o) => o.filter((r) => !ids.includes(r.id)))} />
        </Col>
        <Col xl={3}>
          <div className="d-flex flex-column gap-3">
            <Panel title="Warehouse capacity">
              {[["WH-East 01", 88, "var(--red-600)"], ["WH-West 02", 64, "var(--blue-500)"], ["WH-Central 04", 42, "var(--blue-600)"]].map(([n, v, c]) => (
                <div key={n} className="mb-3 last-mb-0">
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: ".74rem" }}>
                    <span className="fw-semibold">{n}</span><span className="num text-secondary">{v}%</span>
                  </div>
                  <div className="meter"><span style={{ width: `${v}%`, background: c }} /></div>
                </div>
              ))}
              <small className="text-secondary">WH-East 01 is near its limit. Consider rerouting inbound.</small>
            </Panel>
            <Panel title="Recent activity" bodyClassName="px-3 py-1">
              {FEED.map((f, i) => (
                <div className="feed-item" key={i}>
                  <span className="feed-dot" style={{ background: f.c }} />
                  <div>{f.t}<time>{f.when}</time></div>
                </div>
              ))}
            </Panel>
          </div>
        </Col>
      </Row>
    </>
  );
}