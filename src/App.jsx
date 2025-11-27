import React, { useState } from "react";
import ChatFlow from "./components/ChatFlow";
import FlowerResult from "./components/FlowerResult";
import SavedCards from "./components/SavedCards";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { auth } from "./firebase";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(auth.currentUser);
  const [mode, setMode] = useState("login"); // login | signup

  // ---------------------------
  // 로그인 안 된 상태 → 무조건 로그인/회원가입
  // ---------------------------
  if (!user) {
    return mode === "login" ? (
      <Login
        onLogin={(u) => setUser(u)}
        onSignup={() => setMode("signup")}
      />
    ) : (
      <Signup
        onLogin={(u) => setUser(u)}
        onBack={() => setMode("login")}
      />
    );
  }

  // ---------------------------
  // 로그인 된 이후 Flow 기능 시작
  // ---------------------------
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNext = (key, value) => {
    setUserData(prev => ({ ...prev, [key]: value }));
    setStep(prev => prev + 1);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      setResult(data);
      setStep(99);
    } catch (e) {
      alert("AI 처리 중 문제가 발생했습니다.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setUserData({});
    setResult(null);
    setLoading(false);
  };

  return (
    <div className="App">
      <h1 className="flow-logo">Flow</h1>
      <p className="flow-sub">마음은 흐르고, 꽃은 피어납니다.</p>

      {/* 🌼 로그아웃 */}
      <button
        className="logout-btn"
        onClick={() => {
          auth.signOut();
          setUser(null);
        }}
      >
        로그아웃
      </button>

      {/* 🔥 카드 보기 버튼 */}
      {!loading && step !== 99 && step !== 100 && (
        <button className="view-cards-btn" onClick={() => setStep(100)}>
          🌸 My Flow Garden 보기
        </button>
      )}

      {/* 질문 단계 */}
      {step <= 6 && !loading && (
        <ChatFlow step={step} onNext={handleNext} onGenerate={handleGenerate} />
      )}

      {/* 로딩 */}
      {loading && (
        <div className="loading-wrap">
          <div className="flow-wave"></div>
          <p className="loading-text">🌿 감정을 꽃의 언어로 번역 중입니다...</p>
        </div>
      )}

      {/* 🌸 결과 페이지 */}
      {step === 99 && result && !loading && (
        <FlowerResult result={result} onReset={reset} />
      )}

      {/* 🌷 저장된 카드 보기 */}
      {step === 100 && !loading && (
        <SavedCards onBack={() => setStep(1)} />
      )}
    </div>
  );
}
