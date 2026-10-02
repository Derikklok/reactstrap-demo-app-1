"use client";
import { Card, CardBody } from "reactstrap";

export default function MetricCard({ label, value, subtext, trend, trendValue }) {
  const isPositive = trend === "up";

  return (
    <Card className="erp-card h-100">
      <CardBody className="d-flex flex-column justify-content-between p-2">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="text-secondary text-uppercase fw-semibold" style={{ fontSize: "0.68rem" }}>
            {label}
          </span>
          {trendValue && (
            <span
              className={`fw-semibold ${isPositive ? "text-success" : "text-danger"}`}
              style={{ fontSize: "0.7rem" }}
            >
              {isPositive ? "▲" : "▼"} {trendValue}
            </span>
          )}
        </div>
        <div>
          <h5 className="mb-0 fw-bold">{value}</h5>
          {subtext && <small className="text-muted" style={{ fontSize: "0.68rem" }}>{subtext}</small>}
        </div>
      </CardBody>
    </Card>
  );
}