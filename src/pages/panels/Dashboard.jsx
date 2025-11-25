// src/pages/panels/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/client";
import MotionPage from "../../components/MotionPage";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Sidebar state
  const [sideOpen, setSideOpen] = useState(false);

  const sidebarVariants = {
    closed: { x: -260, opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.4 },
    }),
  };

  return (
    <>
      {/* ======= FLOATING SIDEBAR TOGGLE BUTTON ======= */}
      <motion.button
        onClick={() => setSideOpen(!sideOpen)}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed top-28 left-4 z-50 rounded-full shadow-xl 
          bg-indigo-600 text-white w-12 h-12 flex items-center justify-center
          hover:bg-indigo-700 transition ${
            sideOpen ? "translate-x-56" : ""
          }`}
      >
        {sideOpen ? "✖" : "☰"}
      </motion.button>

      {/* ======= MODERN GLASS SIDEBAR ======= */}
      <motion.div
        variants={sidebarVariants}
        animate={sideOpen ? "open" : "closed"}
        initial="closed"
        transition={{ duration: 0.3 }}
        className="
          fixed top-20 left-0 h-[80vh] w-60 
          bg-white/10 dark:bg-gray-800/40 
          backdrop-blur-xl border-r border-white/20 
          shadow-2xl rounded-r-2xl p-5 z-40
        "
      >
        <h3 className="text-lg font-bold mb-4 text-white drop-shadow-md">
          Quick Menu
        </h3>

        <div className="flex flex-col gap-4 text-white/90">
          <a href="/notes" className="hover:text-indigo-300 transition">✍ Create Notes</a>
          <a href="/flashcards" className="hover:text-indigo-300 transition">🎴 Flashcards</a>
          <a href="/quiz" className="hover:text-indigo-300 transition">❓ Quizzes</a>
          <a href="/plan" className="hover:text-indigo-300 transition">🧭 Study Plan</a>
          <a href="/mindmap" className="hover:text-indigo-300 transition">🧠 Mindmaps</a>
          <a href="/tutor" className="hover:text-indigo-300 transition">🤖 Tutor</a>
        </div>
      </motion.div>

      {/* ======= MAIN DASHBOARD ======= */}
      <MotionPage className="space-y-10">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Hello Learner 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Here's your personalized AI-powered study dashboard
          </p>
        </motion.div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Quick Actions */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className="rounded-2xl p-6 shadow-xl 
              bg-gradient-to-br from-indigo-50 to-white 
              dark:from-[#1d1d2b] dark:to-[#171721]
              border border-gray-200/50 dark:border-gray-700/40
              hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Quick Actions</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Jump right into learning</p>

            <div className="mt-4 flex flex-col gap-3">
              <a href="/notes" className="w-full text-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
                ✍ Create Notes
              </a>
              <a href="/flashcards" className="w-full text-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition">
                🎴 Flashcards
              </a>
              <a href="/quiz" className="w-full text-center px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition">
                ❓ Start Quiz
              </a>
            </div>
          </motion.div>

          {/* Activity */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className="rounded-2xl p-6 shadow-xl 
              bg-white dark:bg-gray-800 
              border border-gray-200/50 dark:border-gray-700/40
              hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Your Activity</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">AI tools you used</p>

            {loading ? (
              <div className="animate-pulse mt-4">Loading...</div>
            ) : stats ? (
              <div className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                <p>📝 Notes Generated: <b>{stats.per_feature?.notes ?? 0}</b></p>
                <p>🎴 Flashcards Created: <b>{stats.per_feature?.flashcards ?? 0}</b></p>
                <p>❓ Quizzes Taken: <b>{stats.per_feature?.quiz ?? 0}</b></p>
                <p>🤖 Tutor Messages: <b>{stats.per_feature?.tutor ?? 0}</b></p>
              </div>
            ) : (
              <p className="mt-4 text-red-500">Unable to load stats.</p>
            )}
          </motion.div>

          {/* Progress */}
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className="rounded-2xl p-6 shadow-xl 
              bg-gradient-to-br from-purple-50 to-white 
              dark:from-[#242437] dark:to-[#151521]
              border border-gray-200/50 dark:border-gray-700/40
              hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Study Progress</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Total AI interactions</p>

            {loading ? (
              <div className="animate-pulse mt-6 h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            ) : (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
                className="mt-6 text-center"
              >
                <div className="text-5xl font-extrabold text-purple-600 dark:text-purple-400">
                  {stats.total}
                </div>
                <p className="text-gray-500 mt-1">Total Activity</p>
              </motion.div>
            )}
          </motion.div>

        </div>

        {/* Last 7 Days Summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl p-6 shadow-xl 
            bg-white dark:bg-gray-800 
            border border-gray-200/50 dark:border-gray-700/40"
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
            Last 7 Days Summary 📆
          </h3>

          {!stats ? (
            <p className="text-gray-500">No data available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-700 dark:text-gray-300">
              <div className="p-4 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 text-center">
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {stats.per_feature.notes}
                </p>
                <p className="text-sm opacity-70">Notes</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-100 dark:bg-purple-900/20 text-center">
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {stats.per_feature.flashcards}
                </p>
                <p className="text-sm opacity-70">Flashcards</p>
              </div>

              <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900/20 text-center">
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {stats.per_feature.quiz}
                </p>
                <p className="text-sm opacity-70">Quizzes</p>
              </div>

              <div className="p-4 rounded-xl bg-pink-100 dark:bg-pink-900/20 text-center">
                <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
                  {stats.per_feature.tutor}
                </p>
                <p className="text-sm opacity-70">Tutor Chats</p>
              </div>
            </div>
          )}
        </motion.div>

      </MotionPage>
    </>
  );
}
