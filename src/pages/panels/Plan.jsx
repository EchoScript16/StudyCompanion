import React, { useState } from "react";
import api from "../../api/client";
import MotionPage from "../../components/MotionPage";
import { motion } from "framer-motion";

export default function Plan() {
  const [topic, setTopic] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ai/plan", { topic });
      setPlan(res.data.plan ?? res.data);
    } catch (e) {
      alert("Error generating study plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionPage className="space-y-10">

      {/* 🔥 HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          AI Study Plan 📚
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Get a structured, personalized study plan for any topic.
        </p>
      </motion.div>

      {/* 🔥 INPUT PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="app-panel p-6 flex flex-col md:flex-row gap-4 items-center rounded-xl"
      >
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., Data Structures, Algebra)"
          className="
            flex-1 p-3 rounded-xl 
            bg-white/5 dark:bg-white/10
            border border-white/20 
            text-gray-900 dark:text-white
            focus:ring-2 focus:ring-green-400
            outline-none
            transition
          "
        />

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={generatePlan}
          disabled={!topic || loading}
          className={`
            px-6 py-3 rounded-xl font-semibold transition text-white
            ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}
          `}
        >
          {loading ? "Generating..." : "Generate"}
        </motion.button>
      </motion.div>

      {/* 🔥 STUDY PLAN RESULT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="app-panel p-6 min-h-[240px] max-h-[500px] overflow-y-auto rounded-xl"
      >
        {/* ⏳ Loading Skeleton */}
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
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
                className="h-4 bg-gray-300 dark:bg-gray-700 rounded"
              />
            ))}
          </motion.div>
        )}

        {/* 📭 Empty State */}
        {!loading && !plan && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center text-gray-500 dark:text-gray-400 py-16"
          >
            <div className="text-6xl mb-3">🗂️</div>
            <p>No study plan yet. Enter a topic above and generate.</p>
          </motion.div>
        )}

        {/* 📌 Study Plan */}
        {!loading && plan && (
          <motion.pre
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 text-sm leading-relaxed"
          >
            {plan}
          </motion.pre>
        )}
      </motion.div>

    </MotionPage>
  );
}
