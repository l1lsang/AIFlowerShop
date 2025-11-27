import React from "react";
import ReactMarkdown from "react-markdown";

export default function FlowerResult({ result, onReset }) {
  const saveCard = () => {
    const cards = JSON.parse(localStorage.getItem("flowCards") || "[]");

    const newCard = {
      ...result,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    cards.push(newCard);
    localStorage.setItem("flowCards", JSON.stringify(cards));
    alert("🌸 카드가 저장되었습니다.");
  };

  return (
    <div className="result fade-in">
      <img src={result.imageUrl} alt="flower" className="flower-img" />

      <div className="result-text">
        <ReactMarkdown>{result.text}</ReactMarkdown>
      </div>

      <div className="result-actions">
        <button className="reset-btn" onClick={onReset}>🌿 다른 마음 떠올리기</button>
        <button className="save-btn" onClick={saveCard}>💌 카드 저장하기</button>
      </div>
    </div>
  );
}
