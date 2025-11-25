// src/pages/panels/Flashcards.jsx
import React, { useState } from "react";
import api from "../../api/client";
import MotionPage from "../../components/MotionPage";
import { motion } from "framer-motion";

export default function Flashcards() {
  const [topic, setTopic] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setCards([]);
    try {
      const res = await api.post("/ai/flashcards", { topic, count: 8 });
      setCards(res.data.flashcards || res.data || []);
    } catch (e) {
      console.error("Flashcards error:", e);
      alert("Failed to generate flashcards");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionPage>
      <div className="space-y-8 p-4">

        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            AI Flashcard Generator 🎴
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Enter a topic and StudyAI will create helpful flashcards for revision.
          </p>
        </div>

        {/* Input Panel */}
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow flex flex-col md:flex-row gap-4 items-center">
          <input
            placeholder="Topic (e.g., Photosynthesis)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <button
            onClick={generate}
            disabled={!topic || loading}
            className={`px-5 py-3 rounded-lg font-semibold text-white transition ${
              loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Generating..." : "Generate Flashcards"}
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading &&
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ))}

          {!loading && cards.length === 0 && (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
              No flashcards yet. Enter a topic and click Generate.
            </div>
          )}

          {!loading &&
            cards.map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="relative p-0"
              >
                {/* Card (basic front/back flip using CSS classes if present) */}
                <div className="h-40 rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
                  <div className="text-sm text-gray-400">Question</div>
                  <div className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {card.q || card.question || "Untitled question"}
                  </div>

                  <details className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                    <summary className="cursor-pointer">Show answer</summary>
                    <div className="mt-2">
                      {card.a || card.answer || "No answer provided"}
                    </div>
                  </details>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </MotionPage>
  );
}
