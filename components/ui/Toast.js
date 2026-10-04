"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Icon from "../erp/Icon";

const Ctx = createContext(null);
const ICONS = { success: "checkCircle", danger: "alert", warning: "alert", info: "info" };

function ToastItem({ t, dismiss }) {
  useEffect(() => {
    if (!t.duration) return;
    const id = setTimeout(() => dismiss(t.id), t.duration);
    return () => clearTimeout(id);
  }, [t.id, t.duration, dismiss]);
  return (
    <div className="ui-toast" data-tone={t.tone} role="status">
      <Icon name={ICONS[t.tone] || "info"} size={18} className="ic" />
      <div className="flex-grow-1">
        {t.title && <b>{t.title}</b>}
        {t.message && <p>{t.message}</p>}
      </div>
      {t.action && <button type="button" className="act" onClick={() => { t.action.onClick?.(); dismiss(t.id); }}>{t.action.label}</button>}
      <button type="button" className="x" aria-label="Dismiss" onClick={() => dismiss(t.id)}><Icon name="x" size={14} /></button>
    </div>
  );
}

/** Mount once in app/layout.js */
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const dismiss = useCallback((id) => setItems((l) => l.filter((t) => t.id !== id)), []);
  const show = useCallback((opts) => {
    const o = typeof opts === "string" ? { title: opts } : opts;
    const id = Math.random().toString(36).slice(2);
    setItems((l) => [...l.slice(-3), { id, tone: "info", duration: 4500, ...o }]);
    return id;
  }, []);
  const api = useMemo(() => ({
    show, dismiss,
    success: (title, o) => show({ tone: "success", title, ...o }),
    error: (title, o) => show({ tone: "danger", title, ...o }),
    warning: (title, o) => show({ tone: "warning", title, ...o }),
    info: (title, o) => show({ tone: "info", title, ...o }),
  }), [show, dismiss]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="ui-toasts" aria-live="polite">
        {items.map((t) => <ToastItem key={t.id} t={t} dismiss={dismiss} />)}
      </div>
    </Ctx.Provider>
  );
}

/** const toast = useToast();  toast.success("Saved", { message, action: { label: "Undo", onClick } }) */
export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useToast must be used inside <ToastProvider>");
  return c;
}
