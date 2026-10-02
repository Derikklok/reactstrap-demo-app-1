"use client";

import { Container, Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import MetricCard from "@/components/erp/MetricCard";
import DenseToolbar from "@/components/erp/DenseToolbar";
import DenseTable from "@/components/erp/DenseTable";

const DUMMY_ORDERS = [
  { id: 1, poNumber: "PO-90214", supplier: "Acme Logistics", items: 42, amount: 18450, warehouse: "WH-East 01", date: "2026-03-28", status: "fulfilled" },
  { id: 2, poNumber: "PO-90215", supplier: "Global Steel Co", items: 120, amount: 92300, warehouse: "WH-Central 04", date: "2026-03-29", status: "pending" },
  { id: 3, poNumber: "PO-90216", supplier: "Apex Polymers", items: 15, amount: 4800, warehouse: "WH-East 01", date: "2026-03-29", status: "delayed" },
  { id: 4, poNumber: "PO-90217", supplier: "Precision Gears", items: 85, amount: 33150, warehouse: "WH-West 02", date: "2026-03-30", status: "in_progress" },
  { id: 5, poNumber: "PO-90218", supplier: "Delta Packaging", items: 210, amount: 6200, warehouse: "WH-East 01", date: "2026-03-30", status: "fulfilled" },
  { id: 6, poNumber: "PO-90219", supplier: "Dynasty Micro", items: 34, amount: 14700, warehouse: "WH-Central 04", date: "2026-03-31", status: "pending" },
];

export default function DashboardPage() {
  return (
    <Container fluid className="p-2 p-md-3">
      {/* Top Breadcrumb & Controls Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h6 className="mb-0 fw-bold">Inventory & Purchase Orders</h6>
          <small className="text-secondary">ERP Unit: Plant 04 (EMEA)</small>
        </div>
        <div className="text-secondary small">
          Last Synced: <span className="fw-semibold text-dark">Just now</span>
        </div>
      </div>

      {/* Row 1: Dense KPIs */}
      <Row className="g-2 mb-2">
        <Col xs={6} md={3}>
          <MetricCard label="Open POs" value="48" trend="up" trendValue="+8%" subtext="12 require sign-off" />
        </Col>
        <Col xs={6} md={3}>
          <MetricCard label="Committed Spend" value="$284.5k" trend="down" trendValue="-3.1%" subtext="Budget limit: $400k" />
        </Col>
        <Col xs={6} md={3}>
          <MetricCard label="Pending Receipts" value="16" trend="up" trendValue="+2" subtext="Dock 3 & 4" />
        </Col>
        <Col xs={6} md={3}>
          <MetricCard label="Backorders" value="3" trend="down" trendValue="-50%" subtext="Under SLA target" />
        </Col>
      </Row>

      {/* Row 2: Filtering Toolbar */}
      <DenseToolbar onSearch={(query) => console.log("Searching:", query)} />

      {/* Row 3: High-Density Table with mini side panel */}
      <Row className="g-2">
        <Col lg={9}>
          <DenseTable data={DUMMY_ORDERS} />
        </Col>

        {/* Dense Side Panel for ERP Insights / Quick Form */}
        <Col lg={3}>
          <Card className="erp-card mb-2">
            <CardHeader>Warehouse Capacity</CardHeader>
            <CardBody className="p-2">
              <div className="mb-2">
                <div className="d-flex justify-content-between text-muted" style={{ fontSize: "0.7rem" }}>
                  <span>WH-East 01</span>
                  <span>88%</span>
                </div>
                <div className="progress" style={{ height: 4 }}>
                  <div className="progress-bar bg-warning" style={{ width: "88%" }} />
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between text-muted" style={{ fontSize: "0.7rem" }}>
                  <span>WH-Central 04</span>
                  <span>42%</span>
                </div>
                <div className="progress" style={{ height: 4 }}>
                  <div className="progress-bar bg-success" style={{ width: "42%" }} />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="erp-card">
            <CardHeader>Quick Audit Log</CardHeader>
            <CardBody className="p-2" style={{ maxHeight: 220, overflowY: "auto" }}>
              <div className="text-secondary pb-1 border-bottom mb-1" style={{ fontSize: "0.68rem" }}>
                <strong>PO-90218</strong> received by WH-01 <br />
                <span className="text-muted">12m ago</span>
              </div>
              <div className="text-secondary pb-1 border-bottom mb-1" style={{ fontSize: "0.68rem" }}>
                <strong>PO-90216</strong> status marked Delayed <br />
                <span className="text-muted">34m ago</span>
              </div>
              <div className="text-secondary" style={{ fontSize: "0.68rem" }}>
                <strong>SKU-1029</strong> re-ordered (+500 qty) <br />
                <span className="text-muted">1h ago</span>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}