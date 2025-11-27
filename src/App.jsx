import React, { useState } from "react";
import ChatFlow from "./components/ChatFlow";
import FlowerResult from "./components/FlowerResult";
import SavedCards from "./components/SavedCards";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { auth } from "./firebase";
import "./App.css";

export default function App() {
  // 🔥 1) 훅은 항상 최상단
  const [user, setUser] = useState(auth.currentUser);
  const [mode, setMode] = useState("login");

  // 🔥 2) Flow 관련 상태 — 조건과 관계없이 항상 선언
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // 함수들 (훅과 같은 레벨, 조건 X)
  // -----------------------------
  const handleNext = (key, value) => {
    setUserData((prev) => ({ ...prev, [key]: value }));
    setStep((prev) => prev + 1);
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
      console.error(e);
      alert("AI 처리 중 문제가 발생했습니다.");
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

  // ============================================================
  // 🔥 3) 여기서부터는 "오직 JSX 분기만" — Hook 호출 X
  // ============================================================

  // 🧡 로그인 안 된 상태
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

  // 🌱 로그인 O → Flow 메인 UI
  return (
    <div className="App">
      <h1 className="flow-logo">Flow</h1>
      <p className="flow-sub">마음은 흐르고, 꽃은 피어납니다.</p>

      {/* 로그아웃 */}
      <button
        className="logout-btn"
        onClick={() => {
          auth.signOut();
          setUser(null);
        }}
      >
        로그아웃
      </button>

      {/* My Garden 버튼 */}
      {!loading && step !== 99 && step !== 100 && (
        <button className="view-cards-btn" onClick={() => setStep(100)}>
          🌸 My Flow Garden 보기
        </button>
      )}

      {/* 질문 */}
      {step <= 6 && !loading && (
        <ChatFlow step={step} onNext={handleNext} onGenerate={handleGenerate} />
      )}

      {/* 로딩 */}
      {loading && (
        <div className="loading-wrap">
          <div className="flow-wave"></div>
          <p className="loading-text">
            🌿 감정을 꽃의 언어로 번역 중입니다...
          </p>
        </div>
      )}

      {/* 결과 */}
      {step === 99 && result && !loading && (
        <FlowerResult result={result} onReset={reset} />
      )}

      {/* 저장된 카드 목록 */}
      {step === 100 && !loading && (
        <SavedCards onBack={() => setStep(1)} />
      )}
    </div>
  );
}
