// src/components/FlowerResult.jsx

import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function FlowerResult({ result, onReset }) {
  const cardRef = useRef();

  // ===========================
  // ⭐ 1. PNG 다운로드
  // ===========================
  const handleDownload = async () => {
    const canvas = await html2canvas(cardRef.current, {
      useCORS: true,
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const img = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = img;
    link.download = `flow_card_${Date.now()}.png`;
    link.click();
  };

  // ===========================
  // ⭐ 2. Firestore 저장
  // ===========================
  const handleSaveToDB = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("로그인 후 저장할 수 있어요 🌱");
      return;
    }

    try {
      await addDoc(
        collection(db, "users", user.uid, "cards"),
        {
          description: result.description,
          imageUrl: result.imageUrl,
          createdAt: serverTimestamp(),
        }
      );

      alert("🌸 정원에 카드가 심어졌어요!");
    } catch (err) {
      console.error("🔥 Firestore 저장 오류:", err);
      alert("저장에 실패했습니다 😢");
    }
  };

  return (
    <div className="result-container">

      {/* 🌸 저장 가능한 카드 전체 캡쳐 대상 */}
      <div className="flow-card" ref={cardRef}>
        <img className="card-img" src={result.imageUrl} alt="flower" />

        <div className="card-body">
          <h2 className="card-title">🌸 Today's Flow</h2>
          <div className="card-description">{result.description}</div>
        </div>
      </div>

      {/* 🌼 버튼 영역 */}
      <div className="result-actions">
        <button className="save-btn" onClick={handleDownload}>
          📥 내 갤러리에 저장
        </button>

        <button className="garden-btn" onClick={handleSaveToDB}>
          🌱 정원에 심기
        </button>

        <button className="again-btn" onClick={onReset}>
          ✨ 새 Flow 만들기
        </button>
      </div>
    </div>
  );
}
