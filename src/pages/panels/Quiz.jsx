import React, { useState } from "react";
import api from "../../api/client";
import MotionPage from "../../components/MotionPage";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

export default function Quiz() {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // 🔥 Generate Quiz
  const generateQuiz = async () => {
    setLoading(true);
    setQuiz([]);
    setSelected({});
    setScore(null);
    setSubmitted(false);

    try {
      const res = await api.post("/ai/quiz", { topic });
      setQuiz(res.data.quiz ?? res.data);
    } catch (e) {
      alert("Error generating quiz");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Select an answer
  const chooseOption = (qIndex, oIndex) => {
    if (submitted) return; // Prevent changes after submit
    setSelected({ ...selected, [qIndex]: oIndex });
  };

  // 🔥 Submit Quiz & Calculate Score
  const submitQuiz = () => {
    let points = 0;

    quiz.forEach((q, i) => {
      if (selected[i] === q.answer) points++;
    });

    setScore(points);
    setSubmitted(true);
  };

  // 🔥 Retry Quiz
  const retryQuiz = () => {
    setSelected({});
    setScore(null);
    setSubmitted(false);
  };

  // 🔥 Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Quiz: ${topic}`, 10, 10);

    let y = 20;

    quiz.forEach((q, i) => {
      doc.text(`${i + 1}. ${q.q}`, 10, y);
      y += 8;

      q.options.forEach((opt, idx) => {
        doc.text(`   ${String.fromCharCode(65 + idx)}. ${opt}`, 10, y);
        y += 6;
      });

      doc.text(`✔ Correct: ${String.fromCharCode(65 + q.answer)}`, 10, y);
      y += 6;

      doc.text(`Explanation: ${q.explanation}`, 10, y);
      y += 12;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`${topic}_quiz.pdf`);
  };

  return (
    <MotionPage className="space-y-10">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          AI Quiz Generator ❓
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Enter any topic and get AI-generated objective questions instantly.
        </p>
      </motion.div>

      {/* INPUT AREA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="app-panel p-6 flex flex-col md:flex-row gap-4 items-center"
      >
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., DBMS, Computer Networks)"
          className="
            flex-1 p-3 rounded-xl 
            bg-white/5 dark:bg-white/10 
            border border-white/20 
            text-gray-900 dark:text-white
            focus:ring-2 focus:ring-purple-400
            outline-none
            transition
          "
        />

        <button
          onClick={generateQuiz}
          disabled={!topic || loading}
          className={`px-6 py-3 rounded-xl font-semibold text-white transition 
            ${loading ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"}
          `}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </motion.div>

      {/* SCORE PANEL */}
      {submitted && score !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-xl text-center shadow-lg bg-green-100 text-green-800"
        >
          <h2 className="text-2xl font-bold">Your Score: {score} / {quiz.length}</h2>
          <p className="mt-2">
            {score === 10 ? "Outstanding! 🌟" :
             score >= 7 ? "Great job! Keep it up! 💪" :
             score >= 4 ? "Good try! Review and retry! 📘" :
             "Don’t worry, keep practicing! 🔁"}
          </p>

          <div className="flex gap-4 justify-center mt-4">
            <button onClick={retryQuiz} className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
              Retry Quiz
            </button>

            <button onClick={downloadPDF} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Download PDF
            </button>
          </div>
        </motion.div>
      )}

      {/* QUIZ QUESTIONS */}
      <div className="space-y-6">
        {!loading &&
          quiz.map((q, qIndex) => {
            const correct = q.answer;
            const selectedOption = selected[qIndex];

            return (
              <motion.div
                key={qIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg"
              >
                <div className="font-semibold text-lg dark:text-white">
                  {qIndex + 1}. {q.q}
                </div>

                <div className="mt-4 space-y-2">
                  {q.options.map((option, oIndex) => {
                    const isCorrect = submitted && oIndex === correct;
                    const isWrong = submitted && selectedOption === oIndex && oIndex !== correct;

                    return (
                      <motion.div
                        key={oIndex}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => chooseOption(qIndex, oIndex)}
                        className={`
                          p-3 rounded-xl cursor-pointer transition border 
                          ${
                            isCorrect
                              ? "bg-green-500 text-white border-green-600"
                              : isWrong
                              ? "bg-red-500 text-white border-red-600"
                              : selectedOption === oIndex
                              ? "bg-purple-600 text-white border-purple-700"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                          }
                        `}
                      >
                        <b>{String.fromCharCode(65 + oIndex)}.</b> {option}
                      </motion.div>
                    );
                  })}
                </div>

                {submitted && q.explanation && (
                  <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 italic border-t pt-3">
                    📘 <b>Explanation:</b> {q.explanation}
                  </div>
                )}
              </motion.div>
            );
          })}

        {/* Submit Button */}
        {!submitted && quiz.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={submitQuiz}
              className="px-8 py-3 mt-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold"
            >
              Submit Quiz
            </button>
          </div>
        )}
      </div>
    </MotionPage>
  );
}
