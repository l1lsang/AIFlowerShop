// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// 🔥 Pages
import Login from "./components/Login";
import Signup from "./components/Signup";
import ChatFlow from "./components/ChatFlow";
import FlowerResult from "./components/FlowerResult";
import SavedCards from "./components/SavedCards";
import CardDetail from "./components/CardDetail";

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // --------------------------------------
  // 🟢 Firebase 로그인 상태 유지
  // --------------------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // 🕊 로그인 상태 파악 중
  if (authLoading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h3>정원을 불러오는 중 🌿...</h3>
      </div>
    );
  }

  return (
    <Router>
      <Routes>

        {/* ===========================================
            🟡 로그인 안된 상태
        =========================================== */}
        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 그 외 URL 접근 시 로그인으로 */}
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}

        {/* ===========================================
            💚 로그인 된 상태
        =========================================== */}
        {user && (
          <>
            <Route path="/" element={<ChatFlow />} />
            <Route path="/result" element={<FlowerResult />} />
            <Route path="/garden" element={<SavedCards />} />
            <Route path="/card/:id" element={<CardDetail />} />

            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}

      </Routes>
    </Router>
  );
}
