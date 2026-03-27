import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {}

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div className={cn("max-w-7xl mx-auto px-6 lg:px-8", className)} {...props}>
      {children}
    </div>
  );
}
