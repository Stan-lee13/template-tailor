import React, { useState, useRef, useEffect } from "react";
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
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || window.innerWidth < 1024) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    const rX = (y - 0.5) * 20; // max 10 degrees
    const rY = (x - 0.5) * -20; // max 10 degrees
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "perspective-1000 transition-all duration-200 ease-out",
        containerClassName
      )}
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className={cn(
          "relative transition-all duration-200 ease-out preserve-3d",
          className
        )}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
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
      className={cn("transition-all duration-200 ease-out", className)}
      style={{
        transform: `translateZ(${translateZ}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
