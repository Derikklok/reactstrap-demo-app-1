"use client";
import { Input } from "reactstrap";
import Icon from "./Icon";

export default function DenseToolbar({
  onSearch,
  onWarehouse,
  onStatus,
  onExport,
  onPrint,
  onCreate,
}) {
  return (
    <div className="erp-card d-flex flex-wrap gap-2 align-items-center justify-content-between p-2 mb-2">
      <div className="d-flex flex-wrap gap-2 align-items-center">
        <Input
          type="search"
          bsSize="sm"
          className="form-control-xs"
          style={{ width: 240 }}
          placeholder="Filter by PO, supplier or warehouse"
          aria-label="Filter orders"
          onChange={(e) => onSearch?.(e.target.value)}
        />
        <Input
          type="select"
          bsSize="sm"
          className="form-select-xs"
          style={{ width: 150 }}
          aria-label="Warehouse"
          onChange={(e) => onWarehouse?.(e.target.value)}
        >
          <option value="">All warehouses</option>
          <option>WH-East 01</option>
          <option>WH-Central 04</option>
          <option>WH-West 02</option>
        </Input>
        <Input
          type="select"
          bsSize="sm"
          className="form-select-xs"
          style={{ width: 130 }}
          aria-label="Status"
          onChange={(e) => onStatus?.(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In progress</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="delayed">Delayed</option>
        </Input>
      </div>
      <div className="d-flex gap-2">
        <button
          className="btn btn-xs btn-ghost d-inline-flex align-items-center gap-1"
          onClick={onPrint}
        >
          <Icon name="print" size={13} />
          Print
        </button>
        <button
          className="btn btn-xs btn-ghost d-inline-flex align-items-center gap-1"
          onClick={onExport}
        >
          <Icon name="download" size={13} />
          Export CSV
        </button>
        <button
          className="btn btn-xs btn-primary d-inline-flex align-items-center gap-1"
          onClick={onCreate}
        >
          <Icon name="plus" size={13} stroke={2.4} />
          New purchase order
        </button>
      </div>
    </div>
  );
}
