"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "../erp/Icon";
import { cx } from "./cx";

const stack = []; // supports nested overlays: only the top one reacts to Esc / Tab
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Low-level portal + backdrop + focus trap + Esc + scroll lock.
 * Modal and Drawer are built on this. Use it directly for custom overlays.
 * Children are only mounted while `open`, so form state inside resets on every open.
 */
export default function Overlay({
  open,
  onClose,
  label,
  align = "center",
  closeOnBackdrop = true,
  className,
  panelStyle,
  children,
}) {
  const panel = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const token = {};
    const opener = document.activeElement;
    if (stack.length === 0) {
      document.body.dataset.prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    stack.push(token);
    const el = panel.current;
    (
      el?.querySelector("[data-autofocus]") ||
      el?.querySelector(".ui-panel-body")?.querySelector(FOCUSABLE) ||
      el
    )?.focus();

    const onKey = (e) => {
      if (stack[stack.length - 1] !== token) return;
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current?.();
        return;
      }
      if (e.key === "Tab" && el) {
        const f = [...el.querySelectorAll(FOCUSABLE)];
        if (!f.length) return;
        const first = f[0],
          last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      stack.splice(stack.indexOf(token), 1);
      if (stack.length === 0)
        document.body.style.overflow = document.body.dataset.prevOverflow || "";
      opener?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className="ui-overlay" data-align={align}>
      <div
        className="ui-backdrop"
        onClick={closeOnBackdrop ? () => closeRef.current?.() : undefined}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cx("ui-panel", className)}
        style={panelStyle}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

/** Shared header / scrollable body / footer layout for Modal and Drawer */
export function PanelFrame({
  title,
  subtitle,
  onClose,
  hideClose,
  headerExtra,
  footer,
  children,
  bodyClassName,
  bodyStyle,
}) {
  return (
    <>
      {(title || !hideClose) && (
        <div className="ui-panel-head">
          <div style={{ minWidth: 0 }}>
            {title && <h2 className="ui-panel-title">{title}</h2>}
            {subtitle && <p className="ui-panel-sub">{subtitle}</p>}
            {headerExtra}
          </div>
          {!hideClose && (
            <button
              type="button"
              className="icon-btn"
              onClick={onClose}
              aria-label="Close"
            >
              <Icon name="x" size={18} />
            </button>
          )}
        </div>
      )}
      <div className={cx("ui-panel-body", bodyClassName)} style={bodyStyle}>
        {children}
      </div>
      {footer && <div className="ui-panel-foot">{footer}</div>}
    </>
  );
}
