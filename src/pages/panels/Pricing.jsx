import React from "react";
import { motion } from "framer-motion";
import MotionPage from "../../components/MotionPage";

export default function Pricing() {
  return (
    <MotionPage>
      <div className="min-h-screen px-6 py-12 text-white">

        {/* ===== TITLE ===== */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Pricing Plans
          </h1>
          <p className="text-gray-300 mt-3">
            Simple and transparent pricing for every student.
          </p>
        </motion.div>

        {/* ===== PLANS GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* FREE PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold">Free Plan</h2>
            <p className="text-gray-300 mt-2">Basic tools to get started.</p>

            <ul className="mt-4 text-gray-300 space-y-2">
              <li>✔ Notes</li>
              <li>✔ Flashcards</li>
              <li>✔ Tutor (Limited)</li>
            </ul>

            <div className="mt-6 text-3xl font-bold">₹0</div>
            <button className="w-full mt-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition">
              Get Started
            </button>
          </motion.div>

          {/* PRO PLAN (FEATURED) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl border border-white/20 scale-105"
          >
            <h2 className="text-2xl font-bold">Pro Plan</h2>
            <p className="text-white/90 mt-2">Everything unlimited.</p>

            <ul className="mt-4 space-y-2 text-white/90">
              <li>✔ Unlimited Notes</li>
              <li>✔ Unlimited Flashcards</li>
              <li>✔ Unlimited Tutor</li>
              <li>✔ Mindmap Generator</li>
            </ul>

            <div className="mt-6 text-3xl font-bold">₹199/month</div>
            <button className="w-full mt-4 py-2 rounded-xl bg-white text-indigo-600 font-semibold hover:bg-gray-200 transition">
              Upgrade Now
            </button>
          </motion.div>

          {/* TEAM PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold">Team Plan</h2>
            <p className="text-gray-300 mt-2">Built for groups & institutes.</p>

            <ul className="mt-4 text-gray-300 space-y-2">
              <li>✔ Team Dashboard</li>
              <li>✔ Shared Notes</li>
              <li>✔ Admin Analytics</li>
            </ul>

            <div className="mt-6 text-3xl font-bold">₹999/month</div>
            <button className="w-full mt-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition">
              Contact Sales
            </button>
          </motion.div>

        </div>

      </div>
    </MotionPage>
  );
}
