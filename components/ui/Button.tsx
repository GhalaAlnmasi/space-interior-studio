import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "inverse";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-charcoal text-ivory hover:bg-bronze-deep",
  secondary: "border border-charcoal/25 bg-transparent text-charcoal hover:border-bronze",
  inverse: "bg-ivory text-charcoal hover:bg-sand",
};

export function Button({
  children,
  variant = "primary",
  className,
  href,
  type = "button",
  onClick,
  disabled = false,
}: ButtonProps) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center px-6 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors",
    variants[variant],
    disabled && "cursor-not-allowed opacity-40",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
