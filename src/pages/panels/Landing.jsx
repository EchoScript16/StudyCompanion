// src/pages/panels/Landing.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MotionPage from "../../components/MotionPage";

export default function Landing() {
  return (
    <MotionPage>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center">

        {/* ===== NAVBAR ===== */}
        <motion.nav
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-between items-center px-8 py-5 backdrop-blur bg-white/5 border-b border-white/10"
        >
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="logo" className="w-12" />
            <h1 className="text-2xl font-bold tracking-tight">StudyAI</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="px-4 py-2 rounded-lg hover:bg-white/10 transition">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 rounded-lg hover:bg-white/10 transition">
              Register
            </Link>

            <Link
              to="/dashboard"
              className="
                px-5 py-2 rounded-xl 
                bg-indigo-600 hover:bg-indigo-700 transition font-semibold
              "
            >
              Dashboard →
            </Link>
          </div>
        </motion.nav>

        {/* ===== HERO SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center px-6 max-w-4xl mt-24"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="
              text-5xl md:text-6xl font-extrabold 
              bg-gradient-to-r from-indigo-400 to-purple-500 
              bg-clip-text text-transparent
            "
          >
            Welcome to StudyAI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-300 mt-4 text-lg max-w-2xl"
          >
            Your all-in-one AI-powered learning companion: notes, flashcards, quizzes, tutor,
            and mindmaps — everything in one smart platform.
          </motion.p>

          {/* CTA BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex gap-4 mt-10"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="
                  px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl 
                  font-semibold transition
                "
              >
                Get Started →
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="
                  px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl 
                  border border-white/10 font-semibold transition
                "
              >
                Create Account
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ===== FOOTER ===== */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-gray-500 py-6 mt-24 border-t border-white/10 w-full text-center"
        >
          © {new Date().getFullYear()} StudyAI — Built for smarter learning.
        </motion.footer>

      </div>
    </MotionPage>
  );
}
