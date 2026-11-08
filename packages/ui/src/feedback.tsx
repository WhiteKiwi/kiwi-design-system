import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

const badge = cva("kiwi-badge", {
  variants: {
    tone: {
      brand: "kiwi-badge--brand",
      danger: "kiwi-badge--danger",
      info: "kiwi-badge--info",
      neutral: "kiwi-badge--neutral",
      success: "kiwi-badge--success",
      warning: "kiwi-badge--warning",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badge>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(badge({ tone }), className)}
      data-ui="badge"
    />
  );
}

const callout = cva("kiwi-callout", {
  variants: {
    tone: {
      danger: "kiwi-callout--danger",
      info: "kiwi-callout--info",
      neutral: "kiwi-callout--neutral",
      success: "kiwi-callout--success",
      warning: "kiwi-callout--warning",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export type CalloutProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof callout>;

export function Callout({ className, tone, ...props }: CalloutProps) {
  return (
    <aside
      {...props}
      className={cn(callout({ tone }), className)}
      data-ui="callout"
    />
  );
}

export type EmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title: ReactNode;
  description?: ReactNode;
};

/** The consumer distinguishes no results, no data, loading, and errors. */
export function EmptyState({
  title,
  description,
  children,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      {...props}
      className={cn("kiwi-empty-state", className)}
      data-ui="empty-state"
    >
      <h3 className="kiwi-empty-state__title">{title}</h3>
      {description ? (
        <div className="kiwi-empty-state__description">{description}</div>
      ) : null}
      {children ? (
        <div className="kiwi-empty-state__actions">{children}</div>
      ) : null}
    </div>
  );
}
