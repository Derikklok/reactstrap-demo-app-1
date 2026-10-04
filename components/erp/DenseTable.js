"use client";
import { Table, Button } from "reactstrap";
import StatusBadge from "./StatusBadge";

export default function DenseTable({ data = [] }) {
  return (
    <div className="table-responsive border rounded bg-white">
      <Table hover className="table-dense align-middle mb-0" striped>
        <thead>
          <tr>
            <th style={{ width: 35 }}>
              <input type="checkbox" className="form-check-input mt-0" />
            </th>
            <th>PO #</th>
            <th>Supplier</th>
            <th>SKU Count</th>
            <th>Total ($)</th>
            <th>Warehouse</th>
            <th>Order Date</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>
                <input type="checkbox" className="form-check-input mt-0" />
              </td>
              <td className="fw-semibold text-primary">{row.poNumber}</td>
              <td>{row.supplier}</td>
              <td>{row.items}</td>
              <td className="fw-medium">${row.amount.toLocaleString()}</td>
              <td>
                <span className="badge bg-light text-dark border font-monospace">
                  {row.warehouse}
                </span>
              </td>
              <td className="text-secondary">{row.date}</td>
              <td>
                <StatusBadge status={row.status} />
              </td>
              <td className="text-end">
                <Button color="light" className="btn-xs border me-1">
                  Edit
                </Button>
                <Button color="outline-danger" className="btn-xs">
                  Void
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
