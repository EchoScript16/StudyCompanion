import React, { useState } from "react";
import api from "../../api/client";
import MotionPage from "../../components/MotionPage";
import { motion } from "framer-motion";

export default function Notes() {
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const generateNotes = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ai/notes", { topic });
      setNotes(res.data.notes || res.data);
    } catch (e) {
      setNotes("Error: " + (e?.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
  if (!notes) return;
  setPdfLoading(true);

  try {
    const res = await api.post(
      "/notes/pdf",
      { title: topic || "Notes", notes: notes },
      { responseType: "blob" }
    );

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic || "notes"}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert("PDF download failed.");
  } finally {
    setPdfLoading(false);
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
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          AI Notes Generator ✍️
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Enter a topic and let StudyAI generate clear, structured notes for you.
        </p>
      </motion.div>

      {/* 🔥 INPUT + BUTTON PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="app-panel p-6 flex flex-col md:flex-row gap-4 items-center rounded-xl"
      >
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., Operating System, Photosynthesis)"
          className="
            flex-1 p-3 rounded-xl 
            bg-white/5 dark:bg-white/10 
            border border-white/20 
            text-gray-900 dark:text-white
            focus:ring-2 focus:ring-indigo-400
            outline-none
            transition
          "
        />

        <button
          onClick={generateNotes}
          disabled={!topic || loading}
          className={`
            px-6 py-3 rounded-xl font-semibold transition text-white
            ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}
          `}
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        <button
          onClick={downloadPDF}
          disabled={!notes || pdfLoading}
          className={`
            px-6 py-3 rounded-xl font-semibold transition text-white
            ${pdfLoading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}
          `}
        >
          {pdfLoading ? "Preparing..." : "Download PDF"}
        </button>
      </motion.div>

      {/* 🔥 NOTES RESULT PANEL */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="app-panel p-6 min-h-[240px] max-h-[500px] overflow-y-auto rounded-xl"
      >
        {/* 🌀 Loading Skeleton */}
        {!notes && loading && (
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
                className="h-5 bg-gray-300 dark:bg-gray-700 rounded"
              />
            ))}
          </motion.div>
        )}

        {/* ✨ Notes Display */}
        {notes && !loading && (
          <motion.pre
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 text-sm leading-relaxed"
          >
            {notes}
          </motion.pre>
        )}
      </motion.div>

    </MotionPage>
  );
}
