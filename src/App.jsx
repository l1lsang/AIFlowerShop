// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ChatFlow from "./components/ChatFlow";
import FlowerResult from "./components/FlowerResult";
import SavedCards from "./components/SavedCards";
import CardDetail from "./components/CardDetail";
import LoadingFlow from "./components/LoadingFlow";

// ==============================
// 🪄 ChatFlow wrapper
// ==============================
function ChatWrapper() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleNext = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((prev) => prev + 1);
  };

  const handleGenerate = async () => {
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      const data = await res.json();
      console.log("AI 결과:", data);

      // LoadingFlow로 이동 → 결과 state 전달
      navigate("/loading", { state: { result: data } });
    } catch (err) {
      console.error("결과 생성 실패:", err);
      alert("결과 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <ChatFlow
      step={step}
      onNext={handleNext}
      onGenerate={handleGenerate}
    />
  );
}

// ==============================
// 🌼 FlowerResult Wrapper
// ==============================
function FlowerResultWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;

  // 새로고침 대비: 데이터 없으면 홈으로
  if (!result || !result.imageUrl) {
    return <Navigate to="/" />;
  }

  return <FlowerResult result={result} onReset={() => navigate("/")} />;
}

// ==============================
// 🌸 메인 App
// ==============================
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
        {/* 로그인/회원가입 */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

        {/* 챗 화면 */}
        <Route path="/" element={user ? <ChatWrapper /> : <Navigate to="/login" />} />

        {/* 로딩 화면 */}
        <Route path="/loading" element={user ? <LoadingFlow /> : <Navigate to="/login" />} />

        {/* 결과 페이지 */}
        <Route path="/result" element={user ? <FlowerResultWrapper /> : <Navigate to="/login" />} />

        {/* 정원 */}
        <Route path="/garden" element={user ? <SavedCards /> : <Navigate to="/login" />} />

        {/* 카드 상세 */}
        <Route path="/card/:id" element={user ? <CardDetail /> : <Navigate to="/login" />} />

        {/* 기타 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
