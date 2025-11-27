import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function SavedCards() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("flowCards") || "[]");
    setCards(saved.reverse()); // 최신 먼저
  }, []);

  const deleteCard = (id) => {
    const filtered = cards.filter(c => c.id !== id);
    setCards(filtered);
    localStorage.setItem("flowCards", JSON.stringify(filtered));
  };

  return (
    <div className="card-page">
      <h2>🌷 My Flow Garden</h2>
      <p className="card-sub">당신의 마음이 피어났던 순간들</p>

      <div className="card-list">
        {cards.map(card => (
          <div className="card-item" key={card.id}>
            <img className="card-image" src={card.imageUrl} alt="" />
            <ReactMarkdown className="card-md">{card.text}</ReactMarkdown>

            <div className="card-meta">
              <p>{new Date(card.createdAt).toLocaleDateString()}</p>
              <button onClick={() => deleteCard(card.id)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
