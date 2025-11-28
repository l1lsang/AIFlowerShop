// src/components/Signup.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const signup = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pw);
      const user = res.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          createdAt: new Date(),
        },
        { merge: true }
      );
    } catch {
      setErr("회원가입 실패");
    }
  };

  return (
    <div className="auth-wrap">
      <h1 className="flow-logo">Flow</h1>
      <p className="flow-sub">나만의 정원을 만들어 보세요 🌿</p>

      <div className="auth-box">
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
        <button className="btn-primary" onClick={signup}>
          🌱 나만의 정원 만들기
        </button>
      </div>

      {err && <p className="error-msg">{err}</p>}

      <p className="auth-link">
        이미 계정이 있나요? <span><a href="/login">로그인</a></span>
      </p>
    </div>
  );
}

