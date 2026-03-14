"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 34,
    scale: 0.985,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.96,
      ease,
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.992,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.82,
      ease,
    },
  },
};

type MotionSectionProps = HTMLMotionProps<"section"> & {
  children: ReactNode;
};

export function MotionSection({
  children,
  className,
  ...props
}: MotionSectionProps) {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

type MotionBlockProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
};

export function MotionBlock({
  children,
  className,
  variants = itemVariants,
  ...props
}: MotionBlockProps) {
  return (
    <motion.div variants={variants} className={className} {...props}>
      {children}
    </motion.div>
  );
}
