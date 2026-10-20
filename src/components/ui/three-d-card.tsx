import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export const ThreeDCard = ({
  children,
  className,
  containerClassName,
}: ThreeDCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const latestPoint = useRef({ x: 0, y: 0 });

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const applyRotation = () => {
    frameRef.current = null;
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `rotateX(${latestPoint.current.x}deg) rotateY(${latestPoint.current.y}deg)`;
  };

  const scheduleRotation = (rotateX: number, rotateY: number) => {
    latestPoint.current = { x: rotateX, y: rotateY };
    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(applyRotation);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || window.innerWidth < 1024) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    scheduleRotation((y - 0.5) * 20, (x - 0.5) * -20);
  };

  const handleMouseLeave = () => {
    scheduleRotation(0, 0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("perspective-1000", containerClassName)}
      style={{ perspective: "1000px" }}
    >
      <div
        ref={cardRef}
        className={cn(
          "relative preserve-3d transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform",
          className
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </div>
  );
};

export const ThreeDCardItem = ({
  children,
  className,
  translateZ = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  translateZ?: number;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className={cn("transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]", className)}
      style={{
        transform: `translateZ(${translateZ}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
