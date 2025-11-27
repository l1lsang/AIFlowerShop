// src/components/Signup.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Signup({ onBack, onLogin }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const signupEmail = async () => {
    if (pw !== pw2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, pw);
      onLogin(res.user);
    } catch (e) {
      console.error(e);
      alert("회원가입 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="auth-wrap fade-in">
      <h1 className="flow-logo">Flow</h1>
      <p className="flow-sub">당신의 마음을 위한 정원을 만들어드릴게요.</p>

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
        <input
          placeholder="비밀번호 확인"
          type="password"
          value={pw2}
          onChange={e => setPw2(e.target.value)}
        />

        <button className="btn-primary" onClick={signupEmail}>
          🌸 Flow Garden 만들기
        </button>

        <p className="auth-link">
          이미 계정이 있다면{" "}
          <span onClick={onBack}>로그인</span>
        </p>
      </div>
    </div>
  );
}
