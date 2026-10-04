"use client";
import { useId } from "react";
import Icon from "../erp/Icon";
import { cx } from "./cx";

/** Label + control + hint/error wrapper. Use directly to wrap any custom control. */
export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  className,
  style,
  children,
}) {
  return (
    <div className={cx("ui-field", className)} style={style}>
      {label && (
        <label className="ui-label" htmlFor={htmlFor}>
          {label}
          {required && (
            <span className="ui-req" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </label>
      )}
      {children}
      {(error || hint) && (
        <div
          id={htmlFor ? `${htmlFor}-msg` : undefined}
          className={error ? "ui-error" : "ui-hint"}
          role={error ? "alert" : undefined}
        >
          {error || hint}
        </div>
      )}
    </div>
  );
}

const describedBy = (id, hint, error) =>
  hint || error ? `${id}-msg` : undefined;

/** Text-like input. size: sm | md. startIcon: icon name. endAdornment: any node (unit, button...). */
export function Input({
  label,
  hint,
  error,
  required,
  id,
  startIcon,
  endAdornment,
  size = "md",
  className,
  wrapperClassName,
  wrapperStyle,
  ...rest
}) {
  const gen = useId();
  const fid = id || gen;
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={fid}
      className={wrapperClassName}
      style={wrapperStyle}
    >
      <div className={cx("ui-input", size === "sm" && "sm")}>
        {startIcon && (
          <span className="ui-input-icon">
            <Icon name={startIcon} size={15} />
          </span>
        )}
        <input
          id={fid}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fid, hint, error)}
          className={cx(
            "form-control",
            startIcon && "with-start",
            endAdornment && "with-end",
            error && "is-invalid",
            className,
          )}
          {...rest}
        />
        {endAdornment && <span className="ui-input-end">{endAdornment}</span>}
      </div>
    </Field>
  );
}

/** options: ["A","B"] or [{ value, label }]. placeholder adds an empty first option. */
export function Select({
  label,
  hint,
  error,
  required,
  id,
  options = [],
  placeholder,
  size = "md",
  className,
  wrapperClassName,
  wrapperStyle,
  children,
  ...rest
}) {
  const gen = useId();
  const fid = id || gen;
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={fid}
      className={wrapperClassName}
      style={wrapperStyle}
    >
      <select
        id={fid}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fid, hint, error)}
        className={cx(
          "form-select",
          size === "sm" && "sm",
          error && "is-invalid",
          className,
        )}
        {...rest}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) =>
          typeof o === "string" ? (
            <option key={o} value={o}>
              {o}
            </option>
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ),
        )}
        {children}
      </select>
    </Field>
  );
}

export function Textarea({
  label,
  hint,
  error,
  required,
  id,
  rows = 3,
  className,
  wrapperClassName,
  wrapperStyle,
  ...rest
}) {
  const gen = useId();
  const fid = id || gen;
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={fid}
      className={wrapperClassName}
      style={wrapperStyle}
    >
      <textarea
        id={fid}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fid, hint, error)}
        className={cx("form-control", error && "is-invalid", className)}
        {...rest}
      />
    </Field>
  );
}

export function Checkbox({ label, description, id, className, ...rest }) {
  const gen = useId();
  const fid = id || gen;
  return (
    <label className={cx("ui-check", className)} htmlFor={fid}>
      <input id={fid} type="checkbox" className="form-check-input" {...rest} />
      <span>
        <b>{label}</b>
        {description && <small>{description}</small>}
      </span>
    </label>
  );
}

export function Switch({ label, description, className, ...rest }) {
  return (
    <label className={cx("ui-switch", className)}>
      <input type="checkbox" role="switch" {...rest} />
      <span className="track">
        <span className="knob" />
      </span>
      <span className="txt">
        <b>{label}</b>
        {description && <small>{description}</small>}
      </span>
    </label>
  );
}

/** options: ["A","B"] or [{ value, label }] */
export function SegmentedControl({
  options,
  value,
  onChange,
  size = "md",
  className,
  ...rest
}) {
  return (
    <div
      className={cx("ui-seg", size === "sm" && "sm", className)}
      role="radiogroup"
      {...rest}
    >
      {options.map((o) => {
        const opt = typeof o === "string" ? { value: o, label: o } : o;
        const on = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={on}
            className={on ? "on" : ""}
            onClick={() => onChange?.(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
