"use client";
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  duration?: number;
  motionProps?: HTMLMotionProps<"span">;
  className?: string;
}

export default function WordRotate({ words, duration = 2500, motionProps, className }: WordRotateProps) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), duration);
    return () => clearInterval(id);
  }, [words, duration]);

  return (
    <span className={cn("inline-block overflow-hidden align-baseline", className)} style={{ minWidth: "fit-content" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className="inline-block"
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          {...motionProps}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
