"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";
import { elegantEase } from "@/lib/motion";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
}

export default function BlurFade({
  children,
  className,
  delay = 0,
  yOffset = 24,
  inView = true,
  inViewMargin = "-50px",
  blur = "6px",
}: BlurFadeProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: inViewMargin as `${number}px` });
  const shouldAnimate = inView ? isInView : true;

  const variants: Variants = {
    hidden: { 
      y: yOffset, 
      opacity: 0, 
      filter: `blur(${blur})` 
    },
    visible: { 
      y: 0, 
      opacity: 1, 
      filter: "blur(0px)" 
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={variants}
      transition={{
        delay: delay,
        ...elegantEase
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
