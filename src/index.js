import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter, Navigate } from "react-router-dom";

function RootWrapper() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // 아직 로그인 상태 확인 전이면
  if (user === undefined) return <p>로딩중...</p>;

  // 로그인 안됨 → 자동 /login 이동
  if (!user) return <Navigate to="/login" replace />;

  // 로그인됨 → App 정상 실행
  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <RootWrapper />
  </BrowserRouter>
);

reportWebVitals();
