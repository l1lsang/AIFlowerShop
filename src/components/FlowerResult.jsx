// src/components/FlowerResult.jsx
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export default function FlowerResult({ result, onReset }) {
  const cardRef = useRef();
  const [saving, setSaving] = useState(false);

  if (!result) {
    return (
      <div className="error-page">
        <h2>⚠️ 결과를 불러올 수 없어요</h2>
        <a href="/">다시 Flow 시작</a>
      </div>
    );
  }
  // ===============================
  // 📥 카드 PNG 다운로드
  // ===============================
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

  // ===============================
  // 🌿 Firestore 저장
  // ===============================
  const handleSaveToDB = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("로그인이 필요합니다 🌱");
      return;
    }

    setSaving(true);

    try {
      // 1) Firebase Storage 업로드
      const storageRef = ref(
        storage,
        `users/${user.uid}/cards/${Date.now()}.png`
      );

      // base64 이미지 업로드
      await uploadString(storageRef, result.imageUrl, "data_url");

      // 2) Storage URL 가져오기
      const downloadURL = await getDownloadURL(storageRef);

      // 3) Firestore 저장
      await addDoc(
        collection(db, "users", user.uid, "cards"),
        {
          description: result.description,
          imageUrl: downloadURL,
          createdAt: serverTimestamp(),
        }
      );

      alert("🌸 정원에 카드가 심어졌어요!");
    } catch (err) {
      console.error("🔥 카드 저장 실패:", err);
      alert("저장 실패 😢 다시 시도해주세요");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="result-container">

      {/* ===============================
           🌸 카드 영역 (캡쳐 대상)
      =============================== */}
      <div className="flow-card" ref={cardRef}>
        <img className="card-img" src={result.imageUrl} alt="flower" />

        <div className="card-body">
          <h2 className="card-title">🌸 Today's Flow</h2>

          <div className="card-description">
            {result.description}
          </div>
        </div>
      </div>

      {/* ===============================
          버튼 UI
      =============================== */}
      <div className="result-actions">
        <button className="save-btn" onClick={handleDownload}>
          📥 카드 다운로드
        </button>

        <button
          className="garden-btn"
          onClick={handleSaveToDB}
          disabled={saving}
        >
          {saving ? "🌱 저장 중..." : "🌷 정원에 심기"}
        </button>

        <button className="again-btn" onClick={onReset}>
          ✨ 새 Flow 만들기
        </button>
      </div>
    </div>
  );
}
