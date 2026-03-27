import { cn } from "@/lib/utils";

type BadgeVariant = "new" | "sale" | "limited" | "imported";

interface BadgeProps {
  variant: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  new:      "bg-primary text-on-primary",
  sale:     "bg-error text-on-error",
  limited:  "bg-on-surface text-surface",
  imported: "bg-primary-container text-on-primary",
};

const variantLabels: Record<BadgeVariant, string> = {
  new:      "Nuevo",
  sale:     "Oferta",
  limited:  "Limitado",
  imported: "Importado",
};

export function Badge({ variant, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase",
        variantClasses[variant],
        className
      )}
    >
      {variantLabels[variant]}
    </span>
  );
}
