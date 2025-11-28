import React, { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    id: 1,
    type: "text",
    question: "누구를 위한 꽃인가요?",
    placeholder: "예: 엄마, 친구, 나 자신",
    key: "receiver",
  },
  {
    id: 2,
    type: "text",
    question: "그 사람을 떠올렸을 때 가장 먼저 떠오르는 장면은?",
    placeholder: "예: 힘든 날 조용히 옆에 있어줬던 순간",
    key: "memory",
  },
  {
    id: 3,
    type: "options",
    question: "당신의 마음은 어떤 방향으로 흐르고 있나요?",
    options: ["위로", "감사", "응원", "설렘", "축하"],
    key: "emotion",
  },
  {
    id: 4,
    type: "options",
    question: "말 대신 꽃으로 전한다면?",
    options: ["부드럽게", "따뜻하게", "기억에 남게", "조용하게"],
    key: "tone",
  },
  {
    id: 5,
    type: "options",
    question: "어떤 형태가 어울릴까요?",
    options: ["꽃다발", "화분", "드라이", "리스"],
    key: "form",
  },
  {
    id: 6,
    type: "options",
    question: "예산은 어느 정도가 편안한가요?",
    options: ["2만원 미만", "2~5만원", "5~10만원", "10만원 이상"],
    key: "budget",
  },
];

export default function ChatFlow({ step, onNext, onGenerate }) {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const current = steps.find((s) => s.id === step);

  if (!current) return null;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleNext = () => {
    if (!input) return;

    onNext(current.key, input);

    if (step === steps.length) {
      onGenerate();
    }

    setInput("");
  };

  const handleOptionClick = (option) => {
    setInput(option);
    onNext(current.key, option);
    if (step === steps.length) onGenerate();
  };

  return (
    <div className="flow-chat fade-in">

      {/* 🔥 상단 헤더 추가 */}
      <div className="flow-top-bar">
        <h1 className="flow-logo">Flow</h1>
        <button className="pretty-btn" onClick={() => navigate("/garden")}>
          🌿 나의 정원
        </button>

        <button className="top-btn logout" onClick={handleLogout}>
          로그아웃
        </button>
      </div>

      {/* 질문 */}
      <p className="flow-question">{current.question}</p>

      {/* 텍스트 입력 */}
      {current.type === "text" && (
        <input
          className="flow-input"
          placeholder={current.placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      )}

      {/* 옵션 선택 */}
      {current.type === "options" && (
        <div className="flow-options">
          {current.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`flow-option ${input === option ? "active" : ""}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* 다음 버튼 */}
      {current.type === "text" && (
        <button className="flow-next" disabled={!input} onClick={handleNext}>
          다음 →
        </button>
      )}
    </div>
  );
}
