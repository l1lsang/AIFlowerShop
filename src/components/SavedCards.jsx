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
      {/* 뒤로가기 */}
      <button className="back-btn" onClick={onBack}>⬅️ 돌아가기</button>

      <h2>🌷 My Flow Garden</h2>
      <p className="card-sub">당신의 마음이 피어났던 순간들</p>

      {/* 빈 상태 */}
      {cards.length === 0 && (
        <p className="empty-text">
          아직 정원에 꽃이 없어요 🌱  
          Flow를 통해 마음을 심어보세요 🌸
        </p>
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

            {/* 🔥 프리뷰 Only (첫 78자) */}
            <div className="card-preview">
              {card.description.slice(0, 78)}...
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

            <ReactMarkdown className="modal-text">
              {selectedCard.description}
            </ReactMarkdown>

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
