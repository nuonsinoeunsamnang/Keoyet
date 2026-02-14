import { ButtonHTMLAttributes } from "react";

export function Button({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      style={{
        padding: "0.5rem 1rem",
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.6 : 1,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
