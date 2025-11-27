import React, { useRef } from "react";
import html2canvas from "html2canvas";

export default function FlowerResult({ result, onReset }) {
  const cardRef = useRef();

  const handleDownload = async () => {
    const canvas = await html2canvas(cardRef.current, {
      useCORS: true,
      scale: 2, // 고해상도
    });

    const imgData = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imgData;
    link.download = `flow_card_${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="result-container">

      {/* 🌼 다운로드 가능한 카드 */}
      <div className="flow-card" ref={cardRef}>
        <img className="card-img" src={result.imageUrl} alt="flower" />
        <div className="card-text">
          <h2>🌸 Today’s Flow</h2>
          <pre>{result.description}</pre>
        </div>
      </div>

      <div className="result-buttons">
        <button onClick={handleDownload}>📥 카드 저장하기</button>
        <button onClick={onReset}>🔄 다시 만들기</button>
      </div>
    </div>
  );
}
