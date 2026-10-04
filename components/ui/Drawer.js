"use client";
import Overlay, { PanelFrame } from "./Overlay";
import { cx } from "./cx";

const WIDTHS = { sm: 400, md: 520, lg: 680, xl: 860 };

/** Right-side sheet. width: sm | md | lg | xl | number (px). `title` may be a node. */
export default function Drawer({ open, onClose, width = "md", title, subtitle, headerExtra, footer, children, hideClose, closeOnBackdrop = true, className, bodyClassName }) {
  const w = typeof width === "number" ? width : WIDTHS[width] || WIDTHS.md;
  return (
    <Overlay open={open} onClose={onClose} align="end" label={typeof title === "string" ? title : "Details"}
      closeOnBackdrop={closeOnBackdrop} className={cx("ui-drawer", className)} panelStyle={{ "--w": `${w}px` }}>
      <PanelFrame title={title} subtitle={subtitle} headerExtra={headerExtra} onClose={onClose} hideClose={hideClose} footer={footer} bodyClassName={bodyClassName}>
        {children}
      </PanelFrame>
    </Overlay>
  );
}
