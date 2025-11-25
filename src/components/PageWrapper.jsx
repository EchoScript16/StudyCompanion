import React from "react";
import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      {children}
    </motion.div>
  );
}
