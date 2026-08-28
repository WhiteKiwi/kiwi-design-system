"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { cva, type VariantProps } from "class-variance-authority";
import type {
  AnchorHTMLAttributes,
  ComponentPropsWithoutRef,
  ReactNode,
} from "react";
import { cn } from "./cn";

const surface = cva("kiwi-card", {
  variants: {
    padding: {
      compact: "kiwi-card--padding-compact",
      normal: "kiwi-card--padding-normal",
      spacious: "kiwi-card--padding-spacious",
    },
    tone: {
      brand: "kiwi-card--brand",
      inverse: "kiwi-card--inverse",
      neutral: "kiwi-card--neutral",
      raised: "kiwi-card--raised",
    },
  },
  defaultVariants: {
    padding: "normal",
    tone: "neutral",
  },
});

type StaticCardProps = ComponentPropsWithoutRef<"article"> &
  VariantProps<typeof surface>;

export function StaticCard({
  className,
  padding,
  tone,
  ...props
}: StaticCardProps) {
  return (
    <article
      {...props}
      className={cn(surface({ padding, tone }), className)}
      data-interactive="false"
      data-ui="static-card"
    />
  );
}

type LinkedCardProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof surface> & {
    arrowLabel?: string;
  };

export function LinkedCard({
  arrowLabel = "OPEN",
  children,
  className,
  padding,
  tone,
  ...props
}: LinkedCardProps) {
  return (
    <a
      {...props}
      className={cn(surface({ padding, tone }), "kiwi-card-link", className)}
      data-interactive="true"
      data-ui="linked-card"
    >
      <span>{children}</span>
      <span aria-hidden="true" className="kiwi-card-link__arrow">
        {arrowLabel} ↗
      </span>
    </a>
  );
}

type SectionHeadingProps = {
  className?: string;
  description: ReactNode;
  eyebrow: ReactNode;
  id: string;
  title: ReactNode;
};

export function SectionHeading({
  className,
  description,
  eyebrow,
  id,
  title,
}: SectionHeadingProps) {
  return (
    <header className={cn("kiwi-section-heading", className)}>
      <p className="kiwi-section-heading__eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      <p className="kiwi-section-heading__description">{description}</p>
    </header>
  );
}

export function CollectionHeading({
  end,
  start,
}: {
  end: ReactNode;
  start: ReactNode;
}) {
  return (
    <header className="kiwi-collection-heading">
      <span>{start}</span>
      <span>{end}</span>
    </header>
  );
}

type DisclosureProps = {
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  label: ReactNode;
  summary?: ReactNode;
};

export function Disclosure({
  children,
  className,
  defaultOpen = false,
  label,
  summary,
}: DisclosureProps) {
  return (
    <Collapsible.Root
      className={cn("kiwi-disclosure", className)}
      defaultOpen={defaultOpen}
    >
      <Collapsible.Trigger className="kiwi-disclosure__trigger">
        <span>
          <strong>{label}</strong>
          {summary ? <small>{summary}</small> : null}
        </span>
        <i aria-hidden="true" />
      </Collapsible.Trigger>
      <Collapsible.Content className="kiwi-disclosure__content">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
