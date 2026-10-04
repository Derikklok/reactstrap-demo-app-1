"use client";
import Overlay, { PanelFrame } from "./Overlay";
import { cx } from "./cx";

const SIZES = { sm: 420, md: 560, lg: 760, xl: 960 };

/** size: sm | md | lg | xl | number (px). footer: node (buttons). */
export default function Modal({
  open,
  onClose,
  size = "md",
  title,
  subtitle,
  footer,
  children,
  hideClose,
  closeOnBackdrop = true,
  className,
  bodyClassName,
  bodyStyle,
}) {
  const w = typeof size === "number" ? size : SIZES[size] || SIZES.md;
  return (
    <Overlay
      open={open}
      onClose={onClose}
      label={typeof title === "string" ? title : undefined}
      closeOnBackdrop={closeOnBackdrop}
      className={cx("ui-modal", className)}
      panelStyle={{ "--w": `${w}px` }}
    >
      <PanelFrame
        title={title}
        subtitle={subtitle}
        onClose={onClose}
        hideClose={hideClose}
        footer={footer}
        bodyClassName={bodyClassName}
        bodyStyle={bodyStyle}
      >
        {children}
      </PanelFrame>
    </Overlay>
  );
}
