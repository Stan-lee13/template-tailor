"use client";
import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.06em",
      shimmerDuration = "2.4s",
      borderRadius = "9999px",
      background = "#00D4FF",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-2.5 text-white",
          "[background:var(--bg)] [border-radius:var(--radius)]",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          className
        )}
        {...props}
      >
        {/* shimmer */}
        <div className="absolute inset-0 -z-30 overflow-visible blur-[1px] [container-type:size]">
          <div className="absolute inset-0 h-[100cqh] animate-rf-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            <div className="absolute -inset-full w-auto rotate-0 animate-rf-spin-around [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>
        {children}
        {/* highlight */}
        <div className="absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]" />
        <style>{`
          @keyframes rf-shimmer-slide { to { transform: translate(calc(100cqw - 100%), 0); } }
          @keyframes rf-spin-around { 0% { transform: translateZ(0) rotate(0); } 15%,35% { transform: translateZ(0) rotate(90deg); } 65%,85% { transform: translateZ(0) rotate(270deg); } 100% { transform: translateZ(0) rotate(360deg); } }
          .animate-rf-shimmer-slide { animation: rf-shimmer-slide var(--speed) ease-in-out infinite alternate; }
          .animate-rf-spin-around { animation: rf-spin-around calc(var(--speed)*2) infinite linear; }
          @media (prefers-reduced-motion: reduce) { .animate-rf-shimmer-slide, .animate-rf-spin-around { animation: none; } }
        `}</style>
      </button>
    );
  }
);
ShimmerButton.displayName = "ShimmerButton";
export default ShimmerButton;
