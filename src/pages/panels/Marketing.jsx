import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MotionPage from "../../components/MotionPage";


export default function Marketing() {
  return (
    <MotionPage>
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white flex flex-col items-center">

        {/* ===== HERO SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mt-32 px-6"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent"
          >
            Welcome to StudyAI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-gray-300 mt-6 text-lg md:text-xl leading-relaxed"
          >
            Your all-in-one AI-powered learning companion:
            notes, flashcards, quizzes, tutor, and mindmaps —
            everything in one smart platform.
          </motion.p>

          {/* CTA BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col md:flex-row gap-4 mt-10 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-xl"
              >
                Get Started →
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/pricing"
                className="px-6 py-3 rounded-xl border border-white/40 hover:bg-white/10"
              >
                View Pricing
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ===== FEATURES SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-28 max-w-5xl px-6 mb-24"
        >
          {[
            {
              icon: "📝",
              title: "AI Notes",
              desc: "Get structured, clear notes for any topic in seconds."
            },
            {
              icon: "🎴",
              title: "Flashcards",
              desc: "Smart AI-generated flashcards to help you memorize fast."
            },
            {
              icon: "🧠",
              title: "Mindmaps",
              desc: "Create clean mindmaps instantly from topics or PDFs."
            }
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
              className="p-6 rounded-2xl border border-white/10 backdrop-blur-md text-center transition"
            >
              <div className="text-5xl">{f.icon}</div>
              <h3 className="mt-4 text-xl font-bold">{f.title}</h3>
              <p className="mt-2 text-gray-300 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ===== FOOTER ===== */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-gray-400 py-8 w-full text-center border-t border-white/10"
        >
          © {new Date().getFullYear()} StudyAI — Learn Smarter with Powerful AI.
        </motion.footer>
      </div>
    </MotionPage>
  );
}
