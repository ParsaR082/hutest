import type { ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";

interface AnimatedButtonProps {
  children: ReactNode;
  href?: string;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}

export function AnimatedButton({
  children,
  href,
  className,
  type = "button",
  onClick,
  disabled,
}: AnimatedButtonProps) {
  const styles = clsx(
    "group relative inline-flex items-center justify-center overflow-hidden",
    "border border-[#F97316] px-8 py-3",
    "text-sm font-semibold uppercase tracking-[0.18em] text-[#F97316]",
    "transition-colors duration-300",
    className
  );

  const inner = (
    <>
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 z-0 translate-y-full bg-[#F97316] transition-transform duration-300 ease-out group-hover:translate-y-0"
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={styles}>
      {inner}
    </button>
  );
}
