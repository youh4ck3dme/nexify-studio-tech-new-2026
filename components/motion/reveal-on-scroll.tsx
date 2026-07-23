"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
};

const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 38,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
};

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  amount = 0.18,
}: RevealOnScrollProps) {
  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:blur-none",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
