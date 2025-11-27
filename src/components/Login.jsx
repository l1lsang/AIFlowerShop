import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

export default function Login({ onSignup, onLogin }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  // ⭐ 이메일 로그인
  const handleLogin = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pw);
      onLogin(res.user);
    } catch (err) {
      setError("로그인 실패! 이메일 또는 비밀번호를 확인하세요.");
    }
  };

  // ⭐ 구글 로그인
  const handleGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      onLogin(res.user);
    } catch (err) {
      setError("Google 로그인 실패!");
    }
  };

  return (
    <div className="login-wrap">
      <h2 className="flow-logo">Flow</h2>
      <p className="flow-sub">마음은 흐르고, 꽃은 피어납니다.</p>

      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />

      <button className="login-btn" onClick={handleLogin}>
        정원 입장하기
      </button>

      <button className="google-btn" onClick={handleGoogle}>
        🌼 Google 계정으로 시작
      </button>

      {error && <p className="error-msg">{error}</p>}

      <p className="change" onClick={onSignup}>
        아직 정원이 없나요? 🌱 회원가입
      </p>
    </div>
  );
}
