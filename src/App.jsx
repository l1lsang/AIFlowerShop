import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ChatFlow from "./components/ChatFlow";
import FlowerResult from "./components/FlowerResult";
import SavedCards from "./components/SavedCards";
import CardDetail from "./components/CardDetail";

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Firebase 로그인 유지
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

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

        {/* 🔓 비 로그인 접근 가능 */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />

        {/* 🔒 로그인 필수 영역 */}
        <Route
          path="/"
          element={user ? <ChatFlow /> : <Navigate to="/login" />}
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

        {/* 나머지 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
