import React from "react";
import MotionPage from "../../components/MotionPage";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const faqs = [
    { q: "What is StudyAI?", a: "StudyAI is an AI-powered study toolkit that helps you generate notes, flashcards, quizzes, mindmaps, and get AI tutoring instantly." },
    { q: "Is it free?", a: "Yes! StudyAI offers a free plan with core features. Pro features require an upgrade." },
    { q: "Can I generate notes automatically?", a: "Absolutely! Just enter a topic and StudyAI will generate clean, structured notes in seconds." },
    { q: "Are my files secure?", a: "Yes. All uploads are processed securely and never shared." },
    { q: "Can I download notes as PDF?", a: "Yes, you can download generated notes instantly as high-quality PDFs." }
  ];

  return (
    <MotionPage className="space-y-10">

      {/* ===== HEADER ===== */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Frequently Asked Questions ❓
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Find answers to the most common questions about StudyAI.
        </p>
      </motion.div>

      {/* ===== FAQ ACCORDION ===== */}
      <div className="space-y-4">
        {faqs.map((item, idx) => (
          <FAQItem key={idx} q={item.q} a={item.a} />
        ))}
      </div>

    </MotionPage>
  );
}

/* ===========================================================
   Animated Accordion Component
=========================================================== */
function FAQItem({ q, a }) {
  const [open, setOpen] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl bg-white/5 border border-white/10 p-4"
    >
      {/* Summary */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center font-semibold text-left text-gray-200"
      >
        {q}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-xl"
        >
          ▼
        </motion.span>
      </button>

      {/* Animated Answer */}
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mt-3 text-gray-300 leading-relaxed"
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
