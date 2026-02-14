export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning";
}) {
  const styles: Record<string, React.CSSProperties> = {
    default: { padding: "0.2rem 0.5rem", borderRadius: 4, fontSize: "0.875rem" },
    success: { padding: "0.2rem 0.5rem", borderRadius: 4, fontSize: "0.875rem", background: "#dcfce7" },
    warning: { padding: "0.2rem 0.5rem", borderRadius: 4, fontSize: "0.875rem", background: "#fef3c7" },
  };
  return <span style={styles[variant]}>{children}</span>;
}
