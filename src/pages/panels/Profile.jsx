import React, { useEffect, useState } from "react";
import api from "../../api/client";
import { motion } from "framer-motion";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api
      .get("/profile")
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Profile error:", err));
  }, []);

  if (!profile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 text-center text-gray-300"
      >
        Loading profile...
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-10 text-white"
    >
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Your Profile 👤
        </h1>
        <p className="text-gray-400 mt-1">View your StudyAI activity & details.</p>
      </div>

      {/* ===== PROFILE CARD ===== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/10"
      >
        <div className="space-y-3 text-gray-200">
          <p>
            <strong className="text-white">Email:</strong> {profile.email}
          </p>

          <p>
            <strong className="text-white">Joined:</strong>{" "}
            {new Date(profile.created_at).toLocaleString()}
          </p>
        </div>

        {/* ===== USAGE TITLE ===== */}
        <h3 className="text-2xl font-bold mt-6 mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Usage Summary
        </h3>

        {/* ===== USAGE GRID ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white/5 rounded-xl text-center border border-white/10 shadow"
          >
            <div className="text-3xl mb-1">📝</div>
            <p className="font-semibold text-white">{profile.stats.notes}</p>
            <p className="text-xs text-gray-400">Notes</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white/5 rounded-xl text-center border border-white/10 shadow"
          >
            <div className="text-3xl mb-1">🎴</div>
            <p className="font-semibold text-white">{profile.stats.flashcards}</p>
            <p className="text-xs text-gray-400">Flashcards</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white/5 rounded-xl text-center border border-white/10 shadow"
          >
            <div className="text-3xl mb-1">❓</div>
            <p className="font-semibold text-white">{profile.stats.quiz}</p>
            <p className="text-xs text-gray-400">Quiz</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white/5 rounded-xl text-center border border-white/10 shadow"
          >
            <div className="text-3xl mb-1">🤖</div>
            <p className="font-semibold text-white">{profile.stats.tutor}</p>
            <p className="text-xs text-gray-400">Tutor</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
