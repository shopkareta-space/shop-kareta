"use client";

import { motion } from "framer-motion";
import { slideUp } from "@/lib/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="animate"
      className="w-full h-full flex flex-col min-h-screen"
    >
      {children}
    </motion.div>
  );
}
