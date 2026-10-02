"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

const NAV = [
  { group: "Operations", items: [
    { href: "/", label: "Dashboard", icon: "grid" },
    { href: "/purchase-orders", label: "Purchase orders", icon: "cart", badge: 12 },
    { href: "/inventory", label: "Inventory", icon: "box" },
    { href: "/shipments", label: "Shipments", icon: "truck" },
  ]},
  { group: "Business", items: [
    { href: "/suppliers", label: "Suppliers", icon: "users" },
    { href: "/finance", label: "Finance", icon: "wallet" },
    { href: "/reports", label: "Reports", icon: "chart" },
  ]},
  { group: "System", items: [
    { href: "/settings", label: "Settings", icon: "settings" },
  ]},
];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  const toggle = () => {
    if (window.matchMedia("(max-width: 991.98px)").matches) setOpen((v) => !v);
    else setCollapsed((v) => !v);
  };

  return (
    <div className={`shell ${collapsed ? "collapsed" : ""} ${open ? "open" : ""}`}>
      <aside className="sidebar" aria-label="Primary">
        <Link href="/" className="brand">
          <span className="brand-mark">M</span>
          <span className="brand-name">Meridian<small>ERP Operations</small></span>
        </Link>

        <nav className="side-nav">
          {NAV.map((g) => (
            <div key={g.group}>
              <div className="nav-group">{g.group}</div>
              {g.items.map((it) => (
                <Link key={it.href} href={it.href} onClick={() => setOpen(false)}
                  className={`side-link ${pathname === it.href ? "active" : ""}`}
                  aria-current={pathname === it.href ? "page" : undefined} title={it.label}>
                  <Icon name={it.icon} size={17} />
                  <span>{it.label}</span>
                  {it.badge && <em className="pill">{it.badge}</em>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="side-foot">
          <div className="avatar">AK</div>
          <div className="side-foot-text"><b>Amara Kapoor</b><span>Plant 04 · EMEA</span></div>
        </div>
      </aside>
      <div className="backdrop" onClick={() => setOpen(false)} />

      <div className="main">
        <header className="topbar">
          <button className="icon-btn" onClick={toggle} aria-label="Toggle navigation"><Icon name="menu" size={18} /></button>
          <div className="search-box">
            <Icon name="search" size={15} />
            <input className="form-control form-control-sm" placeholder="Search orders, SKUs, suppliers" aria-label="Search" />
            <kbd>Ctrl K</kbd>
          </div>
          <div className="ms-auto d-flex align-items-center gap-1">
            <button className="icon-btn" aria-label="Notifications"><Icon name="bell" size={18} /><span className="dot" /></button>
            <div className="avatar ms-2" style={{ background: "var(--blue-700)" }}>AK</div>
          </div>
        </header>
        <main className="page">{children}</main>
      </div>
    </div>
  );
}