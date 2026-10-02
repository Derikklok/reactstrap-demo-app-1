"use client";
import { Input, Button, ButtonGroup } from "reactstrap";

export default function DenseToolbar({ onSearch, onExport }) {
  return (
    <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between bg-white p-2 border rounded erp-card mb-2">
      <div className="d-flex gap-2 align-items-center flex-grow-1">
        <Input
          type="text"
          placeholder="Filter by SKU / Order / Client..."
          bsSize="sm"
          className="form-control-xs"
          style={{ maxWidth: 220 }}
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
        <Input type="select" bsSize="sm" className="form-select-xs" style={{ maxWidth: 140 }}>
          <option value="">All Warehouses</option>
          <option value="wh1">WH-East 01</option>
          <option value="wh2">WH-Central 04</option>
        </Input>
        <Input type="select" bsSize="sm" className="form-select-xs" style={{ maxWidth: 110 }}>
          <option value="">Status</option>
          <option value="pending">Pending</option>
          <option value="fulfilled">Fulfilled</option>
        </Input>
      </div>

      <div className="d-flex gap-1">
        <ButtonGroup>
          <Button color="light" className="btn-xs border">Print</Button>
          <Button color="light" className="btn-xs border" onClick={onExport}>Export CSV</Button>
        </ButtonGroup>
        <Button color="primary" className="btn-xs fw-semibold">+ New PO</Button>
      </div>
    </div>
  );
}