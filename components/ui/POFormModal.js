"use client";
import { useState } from "react";
import { Modal, Button, Input, Select, Textarea, Switch, SegmentedControl, Field, Alert } from "@/components/ui";
import { SUPPLIERS, WAREHOUSES, CATALOG, PRIORITIES, TODAY, orderTotal, money } from "../../utils/data";

let seq = 1000;
const blankLine = () => ({ id: `n${seq++}`, sku: "", name: "", qty: 1, price: 0 });
const LINE_COLS = "minmax(0,2.6fr) 84px 104px 96px 30px";

/** Create or edit a purchase order. Mounted only while open, so the form resets on every open. */
export default function POFormModal({ open, order, onClose, onSave }) {
  if (!open) return null;
  return <Inner order={order} onClose={onClose} onSave={onSave} />;
}

function Inner({ order, onClose, onSave }) {
  const editing = !!order;
  const [f, setF] = useState(() =>
    order
      ? { ...order, lines: order.lines.map((l) => ({ ...l })) }
      : { supplier: "", warehouse: "", orderDate: TODAY, expectedDate: "", priority: "normal", notes: "", requireApproval: true, lines: [blankLine()] }
  );
  const [errors, setErrors] = useState({});

  const bind = (k) => ({ value: f[k], onChange: (e) => setF((s) => ({ ...s, [k]: e.target.value })), error: errors[k] });
  const setLine = (id, patch) => setF((s) => ({ ...s, lines: s.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
  const pickSku = (id, sku) => {
    const c = CATALOG.find((x) => x.sku === sku);
    setLine(id, c ? { sku: c.sku, name: c.name, price: c.price } : { sku: "", name: "", price: 0 });
  };
  const total = orderTotal(f.lines);

  const submit = (asDraft) => {
    const e = {};
    if (!f.supplier) e.supplier = "Choose a supplier.";
    if (!f.warehouse) e.warehouse = "Choose a receiving warehouse.";
    if (!f.expectedDate) e.expectedDate = "Set an expected delivery date.";
    else if (f.expectedDate < f.orderDate) e.expectedDate = "Must be on or after the order date.";
    const lines = f.lines.filter((l) => l.sku && Number(l.qty) > 0);
    if (!lines.length) e.lines = "Add at least one line with an item and a quantity.";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({
      ...f, lines, amount: orderTotal(lines),
      status: editing ? order.status : asDraft ? "draft" : f.requireApproval ? "pending" : "in_progress",
    });
  };

  return (
    <Modal open onClose={onClose} size="lg"
      title={editing ? `Edit ${order.poNumber}` : "New purchase order"}
      subtitle={editing ? "Changes are saved to the order history." : "Fill in the details. You can save as a draft and finish later."}
      footer={
        <>
          <span className="me-auto text-secondary">Order total <b className="num text-dark ms-1" style={{ fontSize: "1rem" }}>{money(total)}</b></span>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          {!editing && <Button variant="ghost" onClick={() => submit(true)}>Save as draft</Button>}
          <Button onClick={() => submit(false)}>{editing ? "Save changes" : f.requireApproval ? "Submit for approval" : "Create order"}</Button>
        </>
      }>
      <div className="ui-grid-2">
        <Select label="Supplier" required placeholder="Select a supplier" options={SUPPLIERS} {...bind("supplier")} />
        <Select label="Receiving warehouse" required placeholder="Select a warehouse" options={WAREHOUSES} {...bind("warehouse")} />
        <Input label="Order date" type="date" {...bind("orderDate")} />
        <Input label="Expected delivery" type="date" required hint="Used to flag overdue orders." {...bind("expectedDate")} />
        <Field label="Priority">
          <SegmentedControl aria-label="Priority" options={PRIORITIES} value={f.priority} onChange={(v) => setF((s) => ({ ...s, priority: v }))} />
        </Field>
        <div className="d-flex align-items-end">
          <Switch label="Requires approval" description="Finance signs off before it is sent." checked={f.requireApproval} disabled={editing}
            onChange={(e) => setF((s) => ({ ...s, requireApproval: e.target.checked }))} />
        </div>

        <div className="span-2">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h3 className="ui-section-title">Line items</h3>
            <Button variant="soft" size="xs" icon="plus" onClick={() => setF((s) => ({ ...s, lines: [...s.lines, blankLine()] }))}>Add line</Button>
          </div>
          {errors.lines && <Alert tone="danger" className="mb-2">{errors.lines}</Alert>}
          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 560 }}>
              <div className="ui-row-grid mb-1" style={{ "--cols": LINE_COLS, fontSize: ".7rem", fontWeight: 700, color: "var(--ink-2)" }}>
                <span>Item</span><span>Qty</span><span>Unit price</span><span className="text-end">Line total</span><span />
              </div>
              {f.lines.map((l) => (
                <div key={l.id} className="ui-row-grid mb-2" style={{ "--cols": LINE_COLS }}>
                  <Select size="sm" aria-label="Item" value={l.sku} placeholder="Select item" onChange={(e) => pickSku(l.id, e.target.value)}
                    options={CATALOG.map((c) => ({ value: c.sku, label: `${c.sku} – ${c.name}` }))} />
                  <Input size="sm" type="number" min="1" aria-label="Quantity" value={l.qty} onChange={(e) => setLine(l.id, { qty: e.target.value })} />
                  <Input size="sm" type="number" min="0" step="0.01" aria-label="Unit price" value={l.price} onChange={(e) => setLine(l.id, { price: e.target.value })} />
                  <span className="num text-end fw-semibold">{money((Number(l.qty) || 0) * (Number(l.price) || 0))}</span>
                  <Button variant="soft-danger" size="xs" icon="trash" aria-label="Remove line" disabled={f.lines.length === 1}
                    onClick={() => setF((s) => ({ ...s, lines: s.lines.filter((x) => x.id !== l.id) }))} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <Textarea className="" wrapperClassName="span-2" label="Notes for the supplier" placeholder="Delivery instructions, packaging requirements, contacts" {...bind("notes")} />
      </div>
    </Modal>
  );
}
