const MARBLE_BG =
  "linear-gradient(rgba(10,10,10,0.85), rgba(10,10,10,0.95)), url('https://images.unsplash.com/photo-1617156062779-7f551130d22c?q=80&w=2000&auto=format&fit=crop')";

export default function MarbleBackground({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden ${className}`}>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: MARBLE_BG,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
