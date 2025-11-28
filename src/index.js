import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Navigate } from "react-router-dom";

function RootRouter() {
  return (
    <BrowserRouter>
      {/* 첫 접속 시 무조건 /login으로 이동 */}
      <Navigate to="/login" replace />
      <App />
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RootRouter />
  </React.StrictMode>
);

reportWebVitals();
