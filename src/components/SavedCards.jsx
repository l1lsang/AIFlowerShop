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

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "cards"),
      orderBy("createdAt", "desc")
    );

    // 📌 Firestore 실시간 동기화
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
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
    await deleteDoc(doc(db, "users", user.uid, "cards", id));
  };

  return (
    <div className="card-page">

      <button className="back-btn" onClick={onBack}>
        ⬅️ 돌아가기
      </button>

      <h2>🌷 My Flow Garden</h2>
      <p className="card-sub">당신의 마음이 피어났던 순간들</p>

      <div className="card-list">
        {cards.map((card) => (
          <div className="card-item" key={card.id}>
            <img className="card-image" src={card.imageUrl} alt="flower" />

            <ReactMarkdown className="card-md">
              {card.description}
            </ReactMarkdown>

            <div className="card-meta">
              <p>{card.createdAt?.toDate?.().toLocaleDateString()}</p>
              <button className="del-btn" onClick={() => deleteCard(card.id)}>
                🗑 삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
