export function Card({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        padding: "1rem",
        background: "var(--background)",
      }}
      {...props}
    >
      {children}
    </div>
  );
}
