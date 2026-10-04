// Demo data + helpers. Replace with your API layer later; the UI only depends on the shapes below.
export const TODAY = "2026-04-03";

export const SUPPLIERS = ["Acme Logistics", "Global Steel Co", "Apex Polymers", "Precision Gears", "Delta Packaging", "Dynasty Micro", "Northwind Metals", "Helix Fasteners", "Orion Electronics", "Summit Chemicals", "Bluefin Freight", "Crestline Tools"];
export const WAREHOUSES = ["WH-East 01", "WH-Central 04", "WH-West 02"];
export const REQUESTERS = ["Amara Kapoor", "Liam Ortega", "Noor Haddad", "Jonas Weber"];
export const PRIORITIES = [{ value: "normal", label: "Normal" }, { value: "high", label: "High" }, { value: "urgent", label: "Urgent" }];

export const CATALOG = [
  { sku: "SKU-1029", name: "Hex bolt M10 (box of 100)", price: 42 },
  { sku: "SKU-2044", name: "Steel sheet 2 mm, 1 x 2 m", price: 118 },
  { sku: "SKU-3310", name: "Polymer pellets, 25 kg", price: 64 },
  { sku: "SKU-4127", name: "Spur gear 48T", price: 89 },
  { sku: "SKU-5002", name: "Corrugated carton 40 x 30", price: 2.4 },
  { sku: "SKU-6150", name: "Microcontroller board", price: 23.5 },
];

export const RECEIVED_PCT = { draft: 0, pending: 0, in_progress: 55, delayed: 25, fulfilled: 100 };

export const money = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
export const orderTotal = (lines) => lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.price) || 0), 0);
export const units = (lines) => lines.reduce((s, l) => s + (Number(l.qty) || 0), 0);
export const isOverdue = (o) => o.status !== "fulfilled" && o.status !== "draft" && o.expectedDate < TODAY;

export function addDays(iso, d) {
  const t = new Date(iso + "T00:00:00Z");
  t.setUTCDate(t.getUTCDate() + d);
  return t.toISOString().slice(0, 10);
}

const STATUS = ["fulfilled", "pending", "delayed", "in_progress", "fulfilled", "pending", "in_progress", "draft", "delayed", "fulfilled", "pending", "in_progress", "draft", "pending", "in_progress", "fulfilled"];
const PRIORITY = ["normal", "high", "normal", "normal", "urgent", "high"];

export function makeSeed() {
  return Array.from({ length: 16 }, (_, i) => {
    const lines = [0, 1, 2].slice(0, 1 + (i % 3)).map((k) => {
      const c = CATALOG[(i + k * 2) % CATALOG.length];
      return { id: `${i}-${k}`, sku: c.sku, name: c.name, price: c.price, qty: (10 + ((i * 7 + k * 13) % 90)) * (c.price < 5 ? 10 : 1) };
    });
    const orderDate = addDays("2026-03-20", i);
    return {
      id: i + 1, poNumber: `PO-${90214 + i}`, supplier: SUPPLIERS[i % SUPPLIERS.length], warehouse: WAREHOUSES[i % 3],
      orderDate, expectedDate: addDays(orderDate, 7 + (i % 5) * 2), status: STATUS[i], priority: PRIORITY[i % PRIORITY.length],
      requester: REQUESTERS[i % REQUESTERS.length], notes: "", requireApproval: true, lines, amount: orderTotal(lines),
    };
  });
}
