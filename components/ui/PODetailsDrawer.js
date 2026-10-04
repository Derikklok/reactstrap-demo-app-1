"use client";
import { Drawer, Button, Badge, DescriptionList, Progress, Timeline, Avatar } from "@/components/ui";
import StatusBadge from "@/components/erp/StatusBadge";
import { RECEIVED_PCT, isOverdue, money, units, addDays } from "../../utils/data";

function buildTimeline(o) {
  const t = [{ title: "Order created", description: `Raised by ${o.requester}`, time: o.orderDate, tone: "blue" }];
  if (o.status !== "draft") t.push({ title: "Approved and sent to supplier", description: o.supplier, time: o.orderDate, tone: "blue" });
  if (["in_progress", "delayed", "fulfilled"].includes(o.status)) t.push({ title: "Shipment confirmed", description: "Carrier assigned by supplier", time: addDays(o.orderDate, 2), tone: "blue" });
  if (o.status === "delayed") t.push({ title: "Supplier reported a delay", description: "New delivery date requested", time: addDays(o.orderDate, 5), tone: "red" });
  if (o.status === "fulfilled") t.push({ title: `Received at ${o.warehouse}`, description: "All lines checked in", time: o.expectedDate, tone: "green" });
  return t.reverse();
}

export default function PODetailsDrawer({ order, onClose, onEdit, onVoid, onApprove }) {
  if (!order) return null;
  const overdue = isOverdue(order);
  const canApprove = order.status === "draft" || order.status === "pending";
  const pct = RECEIVED_PCT[order.status];

  return (
    <Drawer open onClose={onClose} width="lg"
      title={<span className="num">{order.poNumber}</span>} subtitle={order.supplier}
      headerExtra={
        <div className="d-flex gap-2 align-items-center mt-2 flex-wrap">
          <StatusBadge status={order.status} />
          <Badge tone={order.priority === "urgent" ? "red" : order.priority === "high" ? "amber" : "gray"} variant={order.priority === "urgent" ? "solid" : "soft"} size="sm">
            {order.priority[0].toUpperCase() + order.priority.slice(1)} priority
          </Badge>
          {overdue && <Badge tone="red" size="sm" icon="clock">Overdue</Badge>}
        </div>
      }
      footer={
        <>
          <Button variant="soft-danger" icon="trash" className="me-auto" onClick={() => onVoid(order)}>Void order</Button>
          <Button variant="ghost" icon="edit" onClick={() => onEdit(order)}>Edit</Button>
          {canApprove && <Button icon="check" onClick={() => onApprove(order)}>Approve and send</Button>}
        </>
      }>
      <DescriptionList columns={2} items={[
        { label: "Order total", value: <span className="num" style={{ fontSize: "1.15rem" }}>{money(order.amount)}</span> },
        { label: "Units", value: <span className="num">{units(order.lines).toLocaleString("en-US")}</span> },
        { label: "Warehouse", value: order.warehouse },
        { label: "Requested by", value: <span className="d-inline-flex align-items-center gap-2"><Avatar name={order.requester} size="xs" />{order.requester}</span> },
        { label: "Order date", value: <span className="num">{order.orderDate}</span> },
        { label: "Expected delivery", value: <span className={`num ${overdue ? "text-danger" : ""}`}>{order.expectedDate}</span> },
      ]} />

      <hr className="my-4" style={{ borderColor: "var(--line)", opacity: 1 }} />
      <Progress label="Received so far" showValue value={pct} tone={order.status === "delayed" ? "red" : pct === 100 ? "green" : "blue"} height={8} />

      <h3 className="ui-section-title mt-4 mb-2">Line items</h3>
      <div className="border rounded overflow-hidden">
        <table className="table table-dense mb-0">
          <thead><tr><th>Item</th><th className="text-end">Qty</th><th className="text-end">Unit</th><th className="text-end">Total</th></tr></thead>
          <tbody>
            {order.lines.map((l) => (
              <tr key={l.id}>
                <td><div className="fw-semibold">{l.name}</div><small className="text-secondary mono">{l.sku}</small></td>
                <td className="text-end num">{Number(l.qty).toLocaleString("en-US")}</td>
                <td className="text-end num">{money(l.price)}</td>
                <td className="text-end num fw-semibold">{money(l.qty * l.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {order.notes && (<><h3 className="ui-section-title mt-4 mb-1">Notes</h3><p className="text-secondary mb-0">{order.notes}</p></>)}

      <h3 className="ui-section-title mt-4 mb-3">Activity</h3>
      <Timeline items={buildTimeline(order)} />
    </Drawer>
  );
}
