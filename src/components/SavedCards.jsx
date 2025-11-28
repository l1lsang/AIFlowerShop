import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { auth, db } from "../firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

export default function SavedCards({ onBack }) {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "cards"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setCards(data);
    });

    return () => unsub();
  }, []);

  const deleteCard = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "cards", id));
  };

  const formatDate = (ts) => {
    try {
      return ts?.toDate()?.toLocaleDateString();
    } catch {
      return "";
    }
  };

  return (
    <div className="card-page">
      <button className="back-btn" onClick={onBack}>⬅ 돌아가기</button>

      <h2 className="garden-title">🌷 My Flow Garden</h2>
      <p className="garden-sub">당신의 마음이 피어났던 순간들</p>

      {/* 빈 상태 */}
      {cards.length === 0 && (
        <div className="empty-box fade-in">
          <p className="empty-title">아직 정원이 비어 있어요 🌱</p>
          <p className="empty-desc">
            마음을 담아 꽃을 추천받고  
            당신만의 작은 정원을 채워보세요 🌸
          </p>

          <a href="/" className="gradient-btn">
            🌼 꽃 추천 받으러 가기
          </a>
        </div>
      )}

      {/* 카드 그리드 */}
      <div className="card-list">
        {cards.map((card) => (
          <div
            className="card-item"
            key={card.id}
            onClick={() => setSelectedCard(card)}
          >
            {card.imageUrl ? (
              <img className="card-image" src={card.imageUrl} alt="flower" />
            ) : (
              <div className="image-placeholder">🌸</div>
            )}

            {/* 🔥 프리뷰: 마크다운 일부만 렌더링 */}
            <div className="card-preview">
              <ReactMarkdown>
                {card.description.length > 78
                  ? card.description.slice(0, 78) + "..."
                  : card.description}
              </ReactMarkdown>
            </div>

            <div className="card-meta">
              <p>{formatDate(card.createdAt)}</p>

              <button
                className="del-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCard(card.id);
                }}
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          🌸 상세보기 Modal
      ========================= */}
      {selectedCard && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedCard.imageUrl}
              className="modal-img"
              alt="flower"
            />

            <h3>🌸 My Flow</h3>

            <div className="modal-text">
              <ReactMarkdown>
                {selectedCard.description}
              </ReactMarkdown>
            </div>

            <p className="modal-date">
              {selectedCard.createdAt?.toDate?.().toLocaleString()}
            </p>

            <button
              className="close-btn"
              onClick={() => setSelectedCard(null)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
