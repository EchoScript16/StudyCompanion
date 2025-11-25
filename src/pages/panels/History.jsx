import React, { useEffect, useState } from "react";
import api from "../../api/client";
import MotionPage from "../../components/MotionPage";
import { motion } from "framer-motion";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const featureIcons = {
    notes: "📝",
    flashcards: "🎴",
    quiz: "❓",
    tutor: "🤖",
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/activity/history");
        setHistory(res.data.history || []);
      } catch (e) {
        console.error(e);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <MotionPage className="space-y-10">

      {/* 🔥 HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
          Activity History 📜
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          See what you recently generated using StudyAI.
        </p>
      </motion.div>

      {/* 🔄 LOADING SKELETON */}
      {loading && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.12 } },
          }}
          className="space-y-4"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
              className="h-20 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"
            />
          ))}
        </motion.div>
      )}

      {/* 📭 EMPTY STATE */}
      {!loading && history.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="text-center py-20 opacity-80"
        >
          <motion.div
            initial={{ rotate: -8 }}
            animate={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-6xl mb-4"
          >
            📭
          </motion.div>

          <p className="text-lg text-gray-500 dark:text-gray-400">
            No history yet. Start generating notes, flashcards, or quizzes!
          </p>
        </motion.div>
      )}

      {/* 📜 HISTORY LIST */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.12 } },
        }}
        className="space-y-6"
      >
        {history.map((item, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="flex items-start gap-4 p-5 rounded-2xl shadow-lg 
                       bg-white dark:bg-gray-800 hover:bg-gray-100 
                       dark:hover:bg-gray-700 transition"
          >
            {/* Icon */}
            <div className="text-3xl">{featureIcons[item.feature] || "📌"}</div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold dark:text-white capitalize">
                {item.feature}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                {item.details || "No details available."}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </MotionPage>
  );
}
