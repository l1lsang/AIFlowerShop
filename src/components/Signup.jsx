import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Signup({ onBack, onLogin }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (pw !== pw2) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, pw);
      onLogin(res.user);
    } catch (err) {
      setError("회원가입 실패. 이메일을 확인하세요.");
    }
  };

  return (
    <div className="login-wrap">
      <h2 className="flow-logo">Flow</h2>
      <p className="flow-sub">나만의 정원을 만들어보세요 🌷</p>

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

      <input
        type="password"
        placeholder="비밀번호 확인"
        value={pw2}
        onChange={(e) => setPw2(e.target.value)}
      />

      <button className="login-btn" onClick={handleSignup}>
        정원 만들기
      </button>

      {error && <p className="error-msg">{error}</p>}

      <p className="change" onClick={onBack}>
        이미 정원이 있나요? 🌺 돌아가기
      </p>
    </div>
  );
}
