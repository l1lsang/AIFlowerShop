// src/components/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const loginEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pw);
    } catch {
      setErr("이메일 또는 비밀번호 오류");
    }
  };

  const loginGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName,
        createdAt: new Date(),
      }, { merge: true });
    } catch {
      setErr("Google 로그인 실패");
    }
  };

  return (
    <div className="login-wrap">
      <h1 className="flow-logo">Flow</h1>
      <p className="flow-sub">마음은 흐르고, 꽃은 피어납니다.</p>

      <input placeholder="이메일" onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" placeholder="비밀번호" onChange={(e)=>setPw(e.target.value)} />

      <button onClick={loginEmail}>정원 입장하기</button>
      <button onClick={loginGoogle}>🌼 Google 계정으로 시작</button>

      {err && <p className="error-msg">{err}</p>}

      <a href="/signup">🌱 회원가입</a>
    </div>
  );
}
