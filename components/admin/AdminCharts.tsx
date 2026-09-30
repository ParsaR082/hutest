"use client";

function SimpleBarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-48 items-end gap-1 sm:gap-2">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t bg-[#F97316]/80 transition-all"
            style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? "4px" : "0" }}
            title={String(d.value)}
          />
          <span className="max-w-full truncate text-[0.55rem] text-gray-600 sm:text-[0.65rem]">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  const recent = data.slice(-14);
  const chartData = recent.map((d) => ({
    label: d.date.slice(5),
    value: d.revenue,
  }));

  if (chartData.every((d) => d.value === 0)) {
    return <p className="text-sm text-gray-500">داده درآمدی در این بازه نیست</p>;
  }

  return <SimpleBarChart data={chartData} />;
}

export function StatusBreakdown({
  items,
}: {
  items: { status: string; count: number }[];
}) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">داده‌ای نیست</p>;
  }

  const total = items.reduce((s, i) => s + i.count, 0);

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.status} className="text-sm">
          <div className="mb-1 flex justify-between text-gray-400">
            <span>{item.status}</span>
            <span>{item.count}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-[#F97316]"
              style={{ width: `${(item.count / total) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
