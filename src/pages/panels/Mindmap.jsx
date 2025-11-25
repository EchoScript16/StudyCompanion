import React, { useState } from "react";
import api from "../../api/client";
import MotionPage from "../../components/MotionPage";
import { motion } from "framer-motion";

export default function Mindmap() {
  const [topic, setTopic] = useState("");
  const [mindmap, setMindmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateMindmap = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ai/mindmap", { topic });
      setMindmap(res.data.mindmap ?? res.data);
    } catch (e) {
      console.error(e);
      alert("Failed to generate mindmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionPage className="space-y-10">

      {/* 🔥 Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          AI Mindmap 🧠
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Generate a structured mindmap based on any topic.
        </p>
      </motion.div>

      {/* 🔥 Input Panel */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="app-panel p-6 space-y-4"
      >
        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., Neural Networks)"
            className="
                flex-1 p-3 rounded-xl 
                bg-white/5 dark:bg-white/10 
                border border-white/20 
                focus:ring-2 focus:ring-blue-500
                outline-none
              "
          />

          <button
            onClick={generateMindmap}
            disabled={!topic || loading}
            className="
                px-6 py-3 rounded-xl font-semibold 
                text-white 
                bg-gradient-to-r from-blue-600 to-indigo-600
                hover:from-blue-700 hover:to-indigo-700
                disabled:opacity-40 disabled:cursor-not-allowed
                transition
              "
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </motion.div>

      {/* 🔥 Mindmap Output Panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="app-panel p-6 min-h-[200px]"
      >
        {/* Empty State */}
        {!mindmap && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-gray-400 dark:text-gray-500 text-center py-10"
          >
            <div className="text-5xl mb-3">🌿</div>
            <p>No mindmap yet. Enter a topic and click generate.</p>
          </motion.div>
        )}

        {/* Mindmap Result */}
        {mindmap && (
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
            className="
                whitespace-pre-wrap 
                text-sm 
                leading-relaxed 
                font-mono 
                text-gray-800 dark:text-gray-100
              "
          >
            {mindmap.ascii || JSON.stringify(mindmap, null, 2)}
          </motion.pre>
        )}

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ y: [0, -3, 0], repeat: Infinity, duration: 0.8 }}
            className="text-gray-400 dark:text-gray-500 text-center py-10"
          >
            Generating mindmap...
          </motion.div>
        )}
      </motion.div>

    </MotionPage>
  );
}
