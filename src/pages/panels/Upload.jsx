import React, { useState } from "react";
import api from "../../api/client";
import MotionPage from "../../components/MotionPage";
import { motion } from "framer-motion";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [mindmap, setMindmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please choose a PDF file");

    setLoading(true);
    setMindmap(null);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await api.post("/ai/mindmap/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMindmap(res.data.mindmap || res.data);
    } catch (err) {
      alert("Upload failed.");
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
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">
          Upload PDF → Mindmap 🧠
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Upload a PDF and StudyAI will automatically convert it into a structured mindmap.
        </p>
      </motion.div>

      {/* ===== UPLOAD PANEL ===== */}
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="app-panel p-6 rounded-2xl space-y-6"
      >
        {/* File Input */}
        <motion.label
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="
            w-full p-8 flex flex-col items-center justify-center gap-3 
            border-2 border-dashed border-gray-300 dark:border-gray-600
            rounded-xl cursor-pointer bg-white/5 dark:bg-white/10
            hover:border-indigo-500 hover:bg-white/10 dark:hover:bg-white/20
            transition
          "
        >
          <span className="text-4xl">📄</span>
          <span className="text-gray-700 dark:text-gray-300">
            {file ? file.name : "Click to choose a PDF file"}
          </span>

          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0])}
          />
        </motion.label>

        {/* Upload Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!file || loading}
          className="
            px-6 py-3 rounded-xl font-semibold w-full md:w-auto 
            text-white transition 
            bg-gradient-to-r from-indigo-600 to-purple-600 
            hover:from-indigo-700 hover:to-purple-700
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          {loading ? "Processing..." : "Upload & Convert"}
        </motion.button>
      </motion.form>

      {/* ===== RESULT PANEL ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="app-panel p-6 min-h-[200px] rounded-2xl"
      >
        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !mindmap && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-gray-400 dark:text-gray-500 py-16"
          >
            <div className="text-6xl mb-3">🗂️</div>
            <p>Your converted mindmap will appear here.</p>
          </motion.div>
        )}

        {/* Result */}
        {!loading && mindmap && (
          <motion.pre
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="
              whitespace-pre-wrap 
              text-gray-900 dark:text-gray-100 
              text-sm leading-relaxed font-mono
            "
          >
            {mindmap.ascii || JSON.stringify(mindmap, null, 2)}
          </motion.pre>
        )}
      </motion.div>
    </MotionPage>
  );
}
