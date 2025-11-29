// App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./components/Login";
import Signup from "./components/Signup";

import LoadingFlow from "./components/LoadingFlow";
import ChatWrapper from "./components/_ChatWrapper";
import FlowerResultWrapper from "./components/_FlowerResultWrapper";
import SavedCards from "./components/SavedCards";
import CardDetail from "./components/CardDetail";

export default function App() {
  console.log("🔥 App 렌더링됨");
  console.log("🧭 현재 path:", window.location.pathname);

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
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 로그인/회원가입 */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

        {/* 🌸 FLOW 과정 */}
        <Route
          path="/loading"
          element={user ? <LoadingFlow /> : <Navigate to="/login" />}
        />

        <Route
          path="/"
          element={user ? <ChatWrapper /> : <Navigate to="/login" />}
        />

        {/* 🌼 결과 페이지 */}
        <Route
          path="/result"
          element={user ? <FlowerResultWrapper /> : <Navigate to="/login" />}
        />

        {/* 🌿 나의 정원 */}
        <Route
          path="/garden"
          element={user ? <SavedCards /> : <Navigate to="/login" />}
        />

        {/* 🌱 카드 상세 */}
        <Route
          path="/card/:id"
          element={user ? <CardDetail /> : <Navigate to="/login" />}
        />

        {/* 기타 → /로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
