// src/components/Login.jsx
import React, { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ onLogin, onSignup }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const loginGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      onLogin(res.user);
    } catch (e) {
      console.error(e);
      alert("로그인 실패 😥");
    }
  };

  const loginEmail = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pw);
      onLogin(res.user);
    } catch (e) {
      console.error(e);
      alert("계정 정보가 올바르지 않습니다.");
    }
  };

  return (
    <div className="auth-wrap fade-in">
      <h1 className="flow-logo">Flow</h1>
      <p className="flow-sub">마음은 흐르고, 꽃은 피어납니다.</p>

      <div className="auth-box">
        <input
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          placeholder="비밀번호"
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
        />

        <button className="btn-primary" onClick={loginEmail}>
          🌿 로그인
        </button>
        <button className="btn-google" onClick={loginGoogle}>
          🌼 Google 로그인
        </button>

        <p className="auth-link">
          아직 계정이 없다면{" "}
          <span onClick={onSignup}>회원가입</span>
        </p>
      </div>
    </div>
  );
}
