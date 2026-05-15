"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const liquidbuttonVariants = cva(
  "inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-medium disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:scale-[1.02] duration-300 transition text-[#f1ece4]",
        light: "bg-transparent hover:scale-[1.02] duration-300 transition text-[#0A0A0A]",
      },
      size: {
        default: "h-10 px-6 py-2",
        lg: "h-11 px-7",
        xl: "h-12 px-8",
      },
    },
    defaultVariants: { variant: "default", size: "lg" },
  }
);

export interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof liquidbuttonVariants> {
  asChild?: boolean;
}

export function LiquidButton({ className, variant, size, asChild = false, children, ...props }: LiquidButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn("relative", liquidbuttonVariants({ variant, size, className }))} {...props}>
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "0 0 6px rgba(0,0,0,0.03), 0 2px 6px rgba(0,0,0,0.08), inset 3px 3px 0.5px -3px rgba(255,255,255,0.85), inset -3px -3px 0.5px -3px rgba(255,255,255,0.6), inset 1px 1px 1px -0.5px rgba(255,255,255,0.5), inset -1px -1px 1px -0.5px rgba(255,255,255,0.5), inset 0 0 6px 6px rgba(255,255,255,0.07), 0 0 12px rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      />
      <span className="pointer-events-none relative z-10">{children}</span>
    </Comp>
  );
}

export { liquidbuttonVariants };
