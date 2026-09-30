import type { ReactNode } from "react";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#F97316]">
          {eyebrow}
        </p>
        <h1 className="font-serif mt-2 text-3xl font-bold text-white">{title}</h1>
        {description && (
          <p className="mt-2 max-w-lg text-sm text-gray-500">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
