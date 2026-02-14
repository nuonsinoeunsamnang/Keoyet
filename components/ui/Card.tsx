export function Card({
  children,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "1rem",
        background: "var(--background)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
