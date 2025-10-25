import React from "react";

export default function FlowerResult({ result }) {
    if (!result || !result.imageUrl) {
    return <p>이미지를 불러오는 중이에요... 🌼</p>;
  }

  return (
    <div className="result">
      <h2>🌷 AI 추천 결과 🌷</h2>
      <img
        src={result.imageUrl}
        alt="AI generated flower"
        className="flower-image"
      />
      <p>{result.description}</p>
    </div>
  );
}
