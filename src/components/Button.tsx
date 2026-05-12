import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: "bg-sunset-500 text-navy-950 shadow-sm hover:bg-sunset-400",
  secondary: "border border-navy-900/10 bg-white text-navy-950 shadow-sm hover:border-sunset-500",
  ghost: "bg-transparent text-navy-900 hover:bg-navy-950/5",
  danger: "bg-coral-500 text-white shadow-sm hover:bg-coral-500/90",
};

export function Button({ children, variant = "primary", fullWidth, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variantClass[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
