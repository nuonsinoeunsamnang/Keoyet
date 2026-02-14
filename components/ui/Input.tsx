import { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      style={{
        padding: "0.5rem",
        width: "100%",
      }}
      {...props}
    />
  );
}
