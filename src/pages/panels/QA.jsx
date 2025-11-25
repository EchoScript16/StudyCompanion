import React, { useState } from "react";
import api from "../../api/client";
import MotionPage from "../../components/MotionPage";
import { motion } from "framer-motion";

export default function QA() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);

    try {
      const res = await api.post("/ai/qa", { question });
      setAnswer(res.data.answer ?? res.data);
    } catch (e) {
      setAnswer("❌ Unable to get an answer right now.");
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
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Ask AI Anything 🤖
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Type your question below and get instant AI responses.
        </p>
      </motion.div>

      {/* 🔥 INPUT PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="app-panel p-6 flex flex-col md:flex-row gap-4 items-center rounded-xl"
      >
        {/* Input */}
        <input
          className="
            flex-1 p-3 rounded-xl 
            bg-white/5 dark:bg-white/10 
            border border-white/20 
            text-gray-900 dark:text-white
            focus:ring-2 focus:ring-yellow-400
            outline-none
            transition
          "
          placeholder="Type your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {/* Ask Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={!question || loading}
          onClick={askQuestion}
          className="
            px-6 py-3 rounded-xl font-semibold
            text-white
            bg-gradient-to-r from-yellow-500 to-orange-500
            hover:from-yellow-600 hover:to-orange-600
            disabled:opacity-40 disabled:cursor-not-allowed
            transition
          "
        >
          {loading ? "Thinking..." : "Ask"}
        </motion.button>
      </motion.div>

      {/* 🔥 ANSWER PANEL */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="app-panel p-6 min-h-[200px] rounded-xl"
      >
        {/* ⏳ Loading */}
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

        {/* 📭 Empty */}
        {!loading && !answer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center text-gray-500 dark:text-gray-400 py-12"
          >
            <div className="text-6xl mb-3">💬</div>
            <p>Answers will appear here.</p>
          </motion.div>
        )}

        {/* ✨ Answer */}
        {!loading && answer && (
          <motion.pre
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 text-sm leading-relaxed"
          >
            {answer}
          </motion.pre>
        )}
      </motion.div>

    </MotionPage>
  );
}
