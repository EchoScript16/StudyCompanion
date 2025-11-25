// src/pages/panels/About.jsx
import React from "react";
import MotionPage from "../../components/MotionPage";

export default function About() {
  return (
    <MotionPage className="p-8">

      <h1 className="text-4xl font-extrabold bg-gradient-to-r 
                     from-indigo-500 to-purple-500 
                     bg-clip-text text-transparent mb-4">
        About StudyAI 🚀
      </h1>

      <p className="text-gray-700 dark:text-gray-300 text-lg">
        Learn how StudyAI helps you study smarter, faster, and better.
      </p>

      <div className="mt-6 p-6 rounded-2xl 
                      bg-white dark:bg-gray-800 
                      shadow-lg">
        
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          <strong>StudyAI</strong> is an AI-powered learning platform designed to make studying
          simple, fast, and effective. We combine modern AI tools with an intuitive
          interface so students can focus on learning — not searching.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Whether you're preparing for exams, building notes, creating flashcards,
          or exploring new topics, StudyAI provides everything in one place.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          From AI-generated notes to quizzes, PDF mindmaps, and an AI tutor —
          StudyAI transforms the entire learning experience.
        </p>

        <p className="mt-6 font-semibold text-indigo-600 dark:text-indigo-400">
          Learn smarter. Study faster. Achieve more.
        </p>
      </div>

    </MotionPage>
  );
}
