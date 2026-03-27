import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "btn-gradient text-on-primary font-semibold shadow-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200 cursor-pointer",
  secondary:
    "bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high active:scale-[0.98] transition-all duration-200 cursor-pointer",
  ghost:
    "text-primary font-semibold hover:bg-primary/8 active:scale-[0.98] transition-all duration-200 cursor-pointer",
  icon:
    "flex items-center justify-center rounded-full hover:bg-surface-container active:scale-95 transition-all duration-200 cursor-pointer",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-full",
  md: "px-6 py-3 text-sm rounded-full",
  lg: "px-8 py-4 text-base rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
