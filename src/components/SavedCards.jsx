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

    // Firestore 실시간 동기
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setCards(data);
    });

    return () => unsub();
  }, []);

  // 🔥 카드 삭제
  const deleteCard = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "cards", id));
  };

  return (
    <div className="card-page">

      <button className="back-btn" onClick={onBack}>
        ⬅️ 돌아가기
      </button>

      <h2>🌷 My Flow Garden</h2>
      <p className="card-sub">당신의 마음이 피어났던 순간들</p>

      {/* 카드 그리드 */}
      <div className="card-list">
        {cards.map((card) => (
          <div
            className="card-item"
            key={card.id}
            onClick={() => setSelectedCard(card)}
          >
            <img className="card-image" src={card.imageUrl} alt="flower" />
            <ReactMarkdown className="card-md">
              {card.description}
            </ReactMarkdown>

            <div className="card-meta">
              <p>{card.createdAt?.toDate?.().toLocaleDateString()}</p>
              <button
                className="del-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCard(card.id);
                }}
              >
                🗑 삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===========================
         🌸 상세보기 Modal
      ============================*/}
      {selectedCard && (
        <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <img src={selectedCard.imageUrl} className="modal-img" alt="flower" />

            <h3>🌸 My Flow</h3>

            <ReactMarkdown className="modal-text">
              {selectedCard.description}
            </ReactMarkdown>

            <p className="modal-date">
              {selectedCard.createdAt?.toDate?.().toLocaleString()}
            </p>

            <button className="close-btn" onClick={() => setSelectedCard(null)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
