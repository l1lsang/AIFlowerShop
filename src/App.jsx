// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ChatFlow from "./components/ChatFlow";
import FlowerResult from "./components/FlowerResult";
import SavedCards from "./components/SavedCards";
import CardDetail from "./components/CardDetail";

function ChatWrapper() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleNext = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((prev) => prev + 1);
  };

  const handleGenerate = () => {
    console.log("최종 답변:", answers);
    navigate("/result");
  };

  return (
    <ChatFlow step={step} onNext={handleNext} onGenerate={handleGenerate} />
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  if (authLoading) {
    return (
      <div className="splash-wrap">
        <h1 className="flow-logo">Flow</h1>
        <p className="flow-sub">정원을 불러오는 중 🌿...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />

        <Route
          path="/"
          element={user ? <ChatWrapper /> : <Navigate to="/login" />}
        />

        <Route
          path="/result"
          element={user ? <FlowerResult /> : <Navigate to="/login" />}
        />
        <Route
          path="/garden"
          element={user ? <SavedCards /> : <Navigate to="/login" />}
        />
        <Route
          path="/card/:id"
          element={user ? <CardDetail /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
