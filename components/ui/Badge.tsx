import { theme } from "@/lib/theme";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "info"
  | "purple";

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  const styles: Record<BadgeVariant, React.CSSProperties> = {
    default: {
      padding: "0.25rem 0.5rem",
      borderRadius: 9999,
      fontSize: "0.75rem",
      fontWeight: 500,
      background: theme.grayBadgeBg,
      color: theme.grayBadgeText,
    },
    success: {
      padding: "0.25rem 0.5rem",
      borderRadius: 9999,
      fontSize: "0.75rem",
      fontWeight: 500,
      background: theme.greenLighter,
      color: theme.greenText,
    },
    warning: {
      padding: "0.25rem 0.5rem",
      borderRadius: 9999,
      fontSize: "0.75rem",
      fontWeight: 500,
      background: theme.amberLight,
      color: theme.amberText,
    },
    info: {
      padding: "0.25rem 0.5rem",
      borderRadius: 9999,
      fontSize: "0.75rem",
      fontWeight: 500,
      background: theme.blueLighter,
      color: theme.blueText,
    },
    purple: {
      padding: "0.25rem 0.5rem",
      borderRadius: 9999,
      fontSize: "0.75rem",
      fontWeight: 500,
      background: theme.purpleLight,
      color: theme.purple,
    },
  };
  return <span style={styles[variant]}>{children}</span>;
}
