import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
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
