import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";

export default function Signup() {
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [err,setErr]=useState("");

  const signup = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth,email,pw);
      const user = res.user;

      await setDoc(doc(db,"users",user.uid),{
        email:user.email,
        createdAt:new Date()
      });
    } catch {
      setErr("회원가입 실패");
    }
  };

  return (
    <div className="signup-wrap">
      <h2>회원가입</h2>

      <input placeholder="이메일" onChange={(e)=>setEmail(e.target.value)}/>
      <input type="password" placeholder="비밀번호" onChange={(e)=>setPw(e.target.value)}/>
      <button onClick={signup}>🌱 나만의 정원 만들기</button>
      {err&&<p>{err}</p>}
      <a href="/login">로그인</a>
    </div>
  );
}
