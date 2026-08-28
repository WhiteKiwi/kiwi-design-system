import { cva, type VariantProps } from "class-variance-authority";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";
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

export function Button({ className, size, variant, ...props }: ButtonProps) {
  return (
    <button
      {...props}
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

export type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "aria-describedby"
> & {
  error?: string;
  hint?: string;
  label: ReactNode;
};

export function TextField({
  className,
  error,
  hint,
  id,
  label,
  ...props
}: TextFieldProps) {
  const fieldId = id ?? props.name;
  const descriptionId = fieldId ? `${fieldId}-description` : undefined;

  return (
    <label className={cn("kiwi-field", className)} data-ui="text-field">
      <span className="kiwi-field__label">{label}</span>
      <input
        {...props}
        aria-describedby={hint || error ? descriptionId : undefined}
        aria-invalid={error ? true : undefined}
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
    </label>
  );
}
