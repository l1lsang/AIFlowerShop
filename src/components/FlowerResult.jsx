// src/components/FlowerResult.jsx

import React, { useRef } from "react";
import html2canvas from "html2canvas";

export default function FlowerResult({ result, onReset }) {
  const cardRef = useRef();

  const handleDownload = async () => {
    const canvas = await html2canvas(cardRef.current, {
      useCORS: true,
      scale: 2, // 고해상도
      backgroundColor: "#ffffff",
    });

    const img = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = img;
    link.download = `flow_card_${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="result-container">

      {/* 🌸 저장 가능한 카드 */}
      <div className="flow-card" ref={cardRef}>
        
        <img className="card-img" src={result.imageUrl} alt="flower" />

        <div className="card-body">
          <h2 className="card-title">🌸 Today's Flow</h2>

          {/* 핵심: div + pre-wrap → 텍스트 100% 보임 */}
          <div className="card-description">
            {result.description}
          </div>
        </div>

      </div>

      <div className="result-actions">
        <button className="save-btn" onClick={handleDownload}>
          📥 나의 Flow 카드 저장
        </button>
        <button className="again-btn" onClick={onReset}>
          ✨ 새 Flow 만들기
        </button>
      </div>
    </div>
  );
}
