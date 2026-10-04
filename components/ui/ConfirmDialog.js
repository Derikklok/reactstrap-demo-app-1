"use client";
import Modal from "./Modal";
import Button from "./Button";
import Icon from "../erp/Icon";

/** tone: danger | primary. Cancel is focused first so Enter never confirms by accident. */
export default function ConfirmDialog({ open, onClose, onConfirm, title = "Are you sure?", children, confirmLabel = "Confirm", cancelLabel = "Cancel", tone = "danger", loading = false, icon }) {
  return (
    <Modal open={open} onClose={onClose} size="sm" hideClose
      footer={
        <>
          <Button variant="ghost" onClick={onClose} data-autofocus>{cancelLabel}</Button>
          <Button variant={tone === "danger" ? "danger" : "primary"} loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }>
      <div className="ui-confirm">
        <span className={`ui-confirm-icon ${tone}`}><Icon name={icon || (tone === "danger" ? "alert" : "info")} size={20} /></span>
        <div>
          <h3>{title}</h3>
          <div className="text-secondary">{children}</div>
        </div>
      </div>
    </Modal>
  );
}
