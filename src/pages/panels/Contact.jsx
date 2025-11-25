import React from "react";
import MotionPage from "../../components/MotionPage";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <MotionPage className="space-y-10">

      {/* ===== HEADER ===== */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Contact Us 📬
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Have questions? We’d love to help!
        </p>
      </motion.div>

      {/* ===== CONTACT INFO BOX ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="app-panel p-6 rounded-2xl space-y-4"
      >
        <p className="text-lg text-gray-300">Get in touch with us:</p>

        <div className="space-y-3 text-gray-200 dark:text-gray-300 text-md">
          <p className="flex items-center gap-2">
            <span className="text-2xl">📧</span>
            support@studyai.com
          </p>

          <p className="flex items-center gap-2">
            <span className="text-2xl">📞</span>
            +91 9876543210
          </p>

          <p className="flex items-center gap-2">
            <span className="text-2xl">📍</span>
            Pune, India
          </p>
        </div>
      </motion.div>

      {/* ===== MESSAGE BOX (NON-FUNCTIONAL UI) ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="app-panel p-6 rounded-2xl space-y-4"
      >
        <h3 className="text-xl font-semibold text-gray-200">Send us a message</h3>

        <input
          type="text"
          placeholder="Your name"
          className="w-full p-3 rounded-xl bg-white/5 dark:bg-white/10 border border-white/20 text-gray-200"
        />

        <input
          type="email"
          placeholder="Your email"
          className="w-full p-3 rounded-xl bg-white/5 dark:bg-white/10 border border-white/20 text-gray-200"
        />

        <textarea
          rows={4}
          placeholder="Your message..."
          className="w-full p-3 rounded-xl bg-white/5 dark:bg-white/10 border border-white/20 text-gray-200"
        ></textarea>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 
                     hover:from-blue-700 hover:to-indigo-700 text-white font-semibold w-full md:w-auto"
        >
          Send Message
        </motion.button>
      </motion.div>
    </MotionPage>
  );
}
