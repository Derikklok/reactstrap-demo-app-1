"use client";
import Link from "next/link";
import Icon from "../erp/Icon";
import { cx } from "./cx";

/**
 * variant: primary | danger | ghost | soft | soft-danger | link
 * size: xs | sm | md | lg
 * icon / iconRight: icon names. No children = square icon-only button (pass aria-label).
 * href: renders a Next <Link>. Everything else is forwarded to the element.
 */
export default function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading = false,
  block = false,
  href,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}) {
  const px = size === "xs" ? 13 : size === "lg" ? 17 : 15;
  const cls = cx(
    "ui-btn",
    `ui-btn-${variant}`,
    `ui-btn-${size}`,
    !children && "ui-btn-icon",
    block && "w-100",
    loading && "is-loading",
    className,
  );
  const content = (
    <>
      {loading ? (
        <span className="ui-spinner" aria-hidden="true" />
      ) : (
        icon && <Icon name={icon} size={px} />
      )}
      {children && <span>{children}</span>}
      {iconRight && !loading && <Icon name={iconRight} size={px} />}
    </>
  );
  if (href)
    return (
      <Link href={href} className={cls} {...rest}>
        {content}
      </Link>
    );
  return (
    <button
      type={type}
      className={cls}
      disabled={disabled || loading}
      {...rest}
    >
      {content}
    </button>
  );
}
