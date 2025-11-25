import React from "react";
import { Link, useNavigate } from "react-router-dom";
import MotionPage from "../../components/MotionPage";
import Logo from "../../components/Logo";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <MotionPage>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-gray-900 p-10">

        {/* GLASS CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-xl text-white"
        >
          {/* LOGO + TITLE */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <Logo />
            <h1 className="text-4xl font-bold">StudyAI</h1>
          </motion.div>

          {/* HEADLINE */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-2xl font-semibold"
          >
            Smart study tools — notes, flashcards, mindmaps & tutor
          </motion.h2>

          {/* SUBTEXT */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-gray-300 mt-3 leading-relaxed"
          >
            Generate structured notes, export them to PDF, create flashcards,
            convert PDFs to mindmaps and chat with an AI tutor — all inside one powerful platform.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex gap-4 mt-6"
          >
            <motion.div whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition"
              >
                Login
              </Link>
            </motion.div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="px-5 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
              >
                Register
              </Link>
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition"
              onClick={() => navigate("/dashboard")}
            >
              Open Dashboard →
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </MotionPage>
  );
}
