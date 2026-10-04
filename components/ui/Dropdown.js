"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "../erp/Icon";
import { cx } from "./cx";

/**
 * Action menu rendered in a portal (never clipped by table/overflow containers), auto-flips near the viewport edge.
 * items: [{ label, icon, onClick, danger, disabled }, { divider: true }, { header: "Section" }]
 * trigger: optional render fn ({ open, props }) => node. Spread `props` on your own button.
 */
export default function Dropdown({ items = [], trigger, align = "end", label = "More actions", className, menuClassName }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const wrap = useRef(null);
  const menu = useRef(null);
  const close = () => { setOpen(false); setPos(null); };

  useLayoutEffect(() => {
    if (!open || !menu.current || !wrap.current) return;
    const t = wrap.current.getBoundingClientRect();
    const m = menu.current.getBoundingClientRect();
    let top = t.bottom + 4;
    if (top + m.height > window.innerHeight - 8) top = Math.max(8, t.top - m.height - 4);
    let left = align === "end" ? t.right - m.width : t.left;
    left = Math.max(8, Math.min(left, window.innerWidth - m.width - 8));
    setPos({ top, left });
  }, [open, align]);

  useEffect(() => { if (pos) menu.current?.querySelector("button:not([disabled])")?.focus(); }, [pos]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!menu.current?.contains(e.target) && !wrap.current?.contains(e.target)) close(); };
    const onKey = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); close(); wrap.current?.querySelector("button")?.focus(); }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const b = [...(menu.current?.querySelectorAll("button:not([disabled])") || [])];
        const i = b.indexOf(document.activeElement);
        b[(i + (e.key === "ArrowDown" ? 1 : -1) + b.length) % b.length]?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey, true); // capture: beats an enclosing Modal/Drawer's Esc
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open]);

  const props = { onClick: () => (open ? close() : setOpen(true)), "aria-haspopup": "menu", "aria-expanded": open };

  return (
    <span ref={wrap} className={cx("ui-dd", className)}>
      {trigger ? trigger({ open, props }) : (
        <button type="button" className="ui-btn ui-btn-ghost ui-btn-sm ui-btn-icon" aria-label={label} {...props}><Icon name="more" size={15} stroke={2.6} /></button>
      )}
      {open && createPortal(
        <div ref={menu} role="menu" className={cx("ui-menu", menuClassName)}
          style={{ top: pos?.top ?? 0, left: pos?.left ?? 0, visibility: pos ? "visible" : "hidden" }}>
          {items.map((it, i) =>
            it.divider ? <hr key={`d${i}`} /> :
            it.header ? <div key={`h${i}`} className="ui-menu-h">{it.header}</div> : (
              <button key={it.key || it.label} type="button" role="menuitem" disabled={it.disabled} className={cx(it.danger && "danger")}
                onClick={() => { close(); it.onClick?.(); }}>
                {it.icon && <Icon name={it.icon} size={15} />}{it.label}
              </button>
            ))}
        </div>, document.body)}
    </span>
  );
}
