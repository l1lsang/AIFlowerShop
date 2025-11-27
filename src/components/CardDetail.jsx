// src/components/CardDetail.jsx
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export default function CardDetail() {
  const { id } = useParams();        // URL 카드ID
  const nav = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firestore에서 카드 정보 불러오기
  useEffect(() => {
    const fetchCard = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid, "cards", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("🌱 존재하지 않는 카드입니다.");
        return nav("/garden");
      }

      setCard({ id: snap.id, ...snap.data() });
      setLoading(false);
    };

    fetchCard();
  }, [id, nav]);

  // 카드 삭제
  const deleteCard = async () => {
    if (!window.confirm("이 카드를 삭제할까요? 🌙")) return;

    const user = auth.currentUser;
    await deleteDoc(doc(db, "users", user.uid, "cards", id));

    alert("🗑 꽃을 정원에서 정리했습니다.");
    nav("/garden");
  };

  if (loading) return <p className="loading">🌿 꽃을 불러오는 중...</p>;

  return (
    <div className="detail-page">

      {/* 뒤로가기 */}
      <button className="back-btn" onClick={() => nav(-1)}>
        ⬅️ 돌아가기
      </button>

      <h2 className="detail-title">🌸 My Flow</h2>

      {/* 이미지 */}
      {card.imageUrl ? (
        <img src={card.imageUrl} className="detail-img" alt="flower" />
      ) : (
        <div className="image-placeholder">🌸</div>
      )}

      {/* 텍스트 */}
      <ReactMarkdown className="detail-text">
        {card.description}
      </ReactMarkdown>

      {/* 날짜 */}
      <p className="detail-date">
        {card.createdAt?.toDate?.().toLocaleString() ?? ""}
      </p>

      {/* 버튼 */}
      <div className="detail-actions">
        <button className="del-btn" onClick={deleteCard}>🗑 삭제</button>
        <button className="garden-btn" onClick={() => nav("/garden")}>
          🌷 정원으로
        </button>
      </div>
    </div>
  );
}
