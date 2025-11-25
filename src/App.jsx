// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";

/* AUTH */
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

/* LAYOUT + PROTECTED */
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

/* PANELS */
import Dashboard from "./pages/panels/Dashboard";
import Notes from "./pages/panels/Notes";
import Flashcards from "./pages/panels/Flashcards";
import Quiz from "./pages/panels/Quiz";
import Plan from "./pages/panels/Plan";
import Mindmap from "./pages/panels/Mindmap";
import QA from "./pages/panels/QA";
import Tutor from "./pages/panels/Tutor";
import Upload from "./pages/panels/Upload";
import History from "./pages/panels/History";

/* PUBLIC */
import Landing from "./pages/panels/Landing";
import Marketing from "./pages/panels/Marketing";
import About from "./pages/panels/About";
import Pricing from "./pages/panels/Pricing";
import FAQ from "./pages/panels/FAQ";
import Contact from "./pages/panels/Contact";
import Home from "./pages/panels/Home";
import Profile from "./pages/panels/Profile";

export default function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      {/* AnimatePresence needs location + key for route transitions */}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>

          {/* PUBLIC */}
          <Route path="/" element={<Marketing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/home" element={<Home />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PRIVATE */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/mindmap" element={<Mindmap />} />
              <Route path="/qa" element={<QA />} />
              <Route path="/tutor" element={<Tutor />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}
