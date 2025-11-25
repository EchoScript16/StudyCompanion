import React, { useState, useRef, useEffect } from "react";
import api from "../../api/client";
import MotionPage from "../../components/MotionPage";
import { motion } from "framer-motion";

export default function Tutor() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chat, loading]);

  const askTutor = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", text: message };
    setChat((c) => [...c, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/ai/tutor", { message });
      const aiText = res.data.reply ?? res.data;

      const aiMsg = { role: "ai", text: aiText };
      setChat((c) => [...c, aiMsg]);
    } catch (e) {
      setChat((c) => [
        ...c,
        { role: "ai", text: "❌ Tutor temporarily unavailable." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionPage className="space-y-10">

      {/* ===== HEADER ===== */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          StudyAI Tutor 🤖
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Ask questions and receive AI-powered explanations.
        </p>
      </motion.div>

      {/* ===== CHAT WINDOW ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="app-panel p-6 h-[420px] overflow-y-auto rounded-2xl"
      >
        {/* Empty State */}
        {chat.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-gray-400 dark:text-gray-500 py-20"
          >
            <div className="text-6xl mb-3">💬</div>
            <p>Start by asking something!</p>
          </motion.div>
        )}

        {/* Chat Messages */}
        {chat.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.role === "user" ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className={`
              my-3 p-4 rounded-xl max-w-[75%] whitespace-pre-wrap leading-relaxed
              ${msg.role === "user"
                ? "ml-auto bg-indigo-600 text-white rounded-br-none"
                : "mr-auto bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none"
              }
            `}
          >
            {msg.text}
          </motion.div>
        ))}

        {/* AI typing animation */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mr-auto bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 p-3 rounded-xl w-24"
          >
            <span className="animate-pulse">...</span>
          </motion.div>
        )}

        <div ref={chatEndRef}></div>
      </motion.div>

      {/* ===== INPUT PANEL ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="app-panel p-4"
      >
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something (e.g., Explain recursion)..."
          className="
            w-full p-3 rounded-xl 
            bg-white/5 dark:bg-white/10 
            border border-white/20 
            text-gray-900 dark:text-white
            focus:ring-2 focus:ring-indigo-400
            outline-none
            transition
          "
        ></textarea>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={askTutor}
          disabled={!message.trim() || loading}
          className="
            mt-3 px-6 py-3 w-full md:w-auto rounded-xl font-semibold 
            text-white transition 
            bg-gradient-to-r from-indigo-600 to-purple-600 
            hover:from-indigo-700 hover:to-purple-700 
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          {loading ? "Thinking..." : "Ask Tutor"}
        </motion.button>
      </motion.div>
    </MotionPage>
  );
}
