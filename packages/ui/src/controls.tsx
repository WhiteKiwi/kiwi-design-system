"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  FieldsetHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  Ref,
  SelectHTMLAttributes,
} from "react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "./cn";
import {
  applyThemeDom,
  assertThemeStorageKey,
  commitThemePreference,
  effectiveThemePreference,
  prefersDark,
  resolvedTheme,
  subscribeThemePreference,
  type ThemePreference,
  themeToggleLabel,
} from "./theme";

import { themeGlyphMarkup } from "./theme-glyphs";

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

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  ref?: Ref<HTMLSelectElement>;
  error?: string;
  hint?: string;
  label: ReactNode;
};

/** Native selection keeps browser keyboard, form, and mobile picker behavior. */
export function Select({
  ref,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  className,
  error,
  hint,
  id,
  label,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;
  const descriptionIds =
    [describedBy, hint || error ? descriptionId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div className={cn("kiwi-field", className)} data-ui="select">
      <label className="kiwi-field__label" htmlFor={fieldId}>
        {label}
      </label>
      <select
        {...props}
        ref={ref}
        id={fieldId}
        className="kiwi-field__input"
        aria-describedby={descriptionIds}
        aria-invalid={error ? true : invalid}
      />
      {hint || error ? (
        <span
          id={descriptionId}
          className={cn(
            "kiwi-field__description",
            error && "kiwi-field__error",
          )}
        >
          {error || hint}
        </span>
      ) : null}
    </div>
  );
}

export type SegmentedControlOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};
export type SegmentedControlProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "onChange" | "children"
> & {
  label: ReactNode;
  hideLabel?: boolean;
  options: readonly SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
};

/** A single choice, not a tablist or navigation. Native radios own selection. */
export function SegmentedControl({
  label,
  hideLabel = false,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  className,
  required,
  form,
  ...props
}: SegmentedControlProps) {
  const generatedName = useId();
  return (
    <fieldset
      {...props}
      form={form}
      className={cn("kiwi-segmented", className)}
      data-ui="segmented-control"
    >
      <legend className={hideLabel ? "kiwi-sr-only" : "kiwi-field__label"}>
        {label}
      </legend>
      <div className="kiwi-segmented__options">
        {options.map((option) => (
          <label className="kiwi-segmented__option" key={option.value}>
            <input
              className="kiwi-sr-only"
              type="radio"
              name={name ?? generatedName}
              form={form}
              value={option.value}
              disabled={option.disabled}
              required={required}
              checked={value === undefined ? undefined : value === option.value}
              defaultChecked={
                value === undefined ? defaultValue === option.value : undefined
              }
              onChange={
                onValueChange
                  ? (event) => onValueChange(event.currentTarget.value)
                  : undefined
              }
            />
            <span className="kiwi-segmented__label">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export type ThemeControlProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  storageKey: string;
  onPreferenceChange?: (preference: ThemePreference) => void;
};

function serverThemeSnapshot(): string {
  return "auto:light";
}

/** Icon button toggling the resolved page theme. */
export function ThemeControl({
  storageKey,
  className,
  onPreferenceChange,
  ...props
}: ThemeControlProps) {
  assertThemeStorageKey(storageKey);
  const subscribe = useCallback(
    (onStoreChange: () => void) =>
      subscribeThemePreference(storageKey, onStoreChange),
    [storageKey],
  );
  const glyphId = useId();
  const [motionKey, setMotionKey] = useState<string | null>(null);
  useEffect(() => {
    setMotionKey(null);
    let frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => setMotionKey(storageKey));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [storageKey]);
  const getSnapshot = useCallback(() => {
    const preference = effectiveThemePreference(storageKey);
    return `${preference}:${resolvedTheme(preference, prefersDark())}`;
  }, [storageKey]);
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    serverThemeSnapshot,
  );
  const [, theme] = snapshot.split(":") as [ThemePreference, "light" | "dark"];
  useLayoutEffect(() => {
    applyThemeDom(effectiveThemePreference(storageKey));
  }, [storageKey]);

  const name = themeToggleLabel(theme);
  const buttonProps = { ...props };
  delete buttonProps["aria-pressed"];
  return (
    <button
      {...buttonProps}
      type="button"
      className={cn(
        "kiwi-theme kiwi-theme--icon",
        motionKey === storageKey && "kiwi-theme--motion",
        className,
      )}
      data-ui="theme-control"
      data-resolved-theme={theme}
      aria-label={name}
      title={name}
      onClick={() => {
        const next = theme === "light" ? "dark" : "light";
        commitThemePreference(storageKey, next);
        onPreferenceChange?.(next);
      }}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: fixed shared SVG geometry with a React-generated useId suffix only
      dangerouslySetInnerHTML={{
        __html: themeGlyphMarkup(`kiwi-theme-${glyphId}`),
      }}
    />
  );
}
