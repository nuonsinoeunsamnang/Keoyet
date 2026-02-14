/**
 * Shared dashboard palette so colors stay consistent across components.
 * Aligned with the TenderFlow-style reference.
 */
export const theme = {
  // Primary blue – Create Tender, Open link, sidebar active, Answer questions
  blue: "#2563eb",
  blueLight: "#eff6ff",
  blueCard: "#dbeafe", // more saturated for card background
  blueLighter: "#dbeafe",
  blueBorder: "#bfdbfe",
  blueText: "#1e40af",
  blueTitle: "#1d4ed8",

  // Orange – Verify vendors card and button, Pending (orange) badge
  orange: "#ea580c",
  orangeLight: "#fff7ed",
  orangeCard: "#ffedd5", // more saturated for card background
  orangeLighter: "#ffedd5",
  orangeBorder: "#fed7aa",
  orangeText: "#9a3412",
  orangeTitle: "#c2410c", // dark orange for title on card

  // Green – Review submissions card, Published status
  green: "#16a34a",
  greenLight: "#f0fdf4",
  greenCard: "#dcfce7",
  greenLighter: "#dcfce7",
  greenBorder: "#bbf7d0",
  greenText: "#166534",
  greenTitle: "#15803d",

  // Yellow/amber – Submission Closed status, Pending (warning) badge
  amber: "#d97706",
  amberLight: "#fef3c7",
  amberText: "#92400e",

  // Gray – Draft status, muted text, borders, sidebar bg
  grayMuted: "#64748b",
  grayBorder: "#e5e7eb",
  grayInputBorder: "#d1d5db", // form inputs, stepper inactive (match reference)
  grayBg: "#f9fafb",
  grayBadgeBg: "#f1f5f9",
  grayBadgeText: "#475569",

  // Purple – Evaluation status
  purple: "#5b21b6",
  purpleLight: "#ede9fe",

  // Red – Rejected / error
  redLight: "#fee2e2",
  redText: "#991b1b",

  // White for buttons
  white: "#ffffff",
} as const;
