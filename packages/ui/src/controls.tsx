"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { useId } from "react";
import { cn } from "./cn";

const button = cva("kiwi-button", {
  variants: {
    size: {
      compact: "kiwi-button--compact",
      normal: "kiwi-button--normal",
    },
    variant: {
      danger: "kiwi-button--danger",
      ghost: "kiwi-button--ghost",
      primary: "kiwi-button--primary",
      secondary: "kiwi-button--secondary",
    },
  },
  defaultVariants: {
    size: "normal",
    variant: "primary",
  },
});

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export function Button({
  className,
  size,
  variant,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn(button({ size, variant }), className)}
      data-ui="button"
    />
  );
}

export function TextLink({
  children,
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={cn("kiwi-text-link", className)}
      data-ui="text-link"
    >
      <span>{children}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  hint?: string;
  label: ReactNode;
};

export function TextField({
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  className,
  error,
  hint,
  id,
  label,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;
  const descriptionIds =
    [describedBy, hint || error ? descriptionId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={cn("kiwi-field", className)} data-ui="text-field">
      <label className="kiwi-field__label" htmlFor={fieldId}>
        {label}
      </label>
      <input
        {...props}
        aria-describedby={descriptionIds}
        aria-invalid={error ? true : invalid}
        className="kiwi-field__input"
        id={fieldId}
      />
      {hint || error ? (
        <span
          className={cn(
            "kiwi-field__description",
            error && "kiwi-field__error",
          )}
          id={descriptionId}
        >
          {error ?? hint}
        </span>
      ) : null}
    </div>
  );
}
