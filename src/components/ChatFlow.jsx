import React, { useState } from "react";

const steps = [
  {
    id: 1,
    question: "어떤 제품을 원하시나요?",
    options: ["꽃다발", "화분", "리스"],
    key: "product",
  },
  {
    id: 2,
    question: "어떤 종류의 꽃을 원하시나요?",
    options: ["생화", "조화", "말린꽃"],
    key: "type",
  },
  {
    id: 3,
    question: "예산은 어느 정도인가요?",
    options: ["2~5만원", "5~10만원", "10만원 이상"],
    key: "budget",
  },
  {
    id: 4,
    question: "선호하는 색감은 어떤가요?",
    options: ["파스텔톤", "비비드", "화이트톤", "따뜻한 컬러"],
    key: "color",
  },
  {
    id: 5,
    question: "어떤 상황인가요?",
    options: ["생일", "위로", "감사", "사랑 고백", "인테리어"],
    key: "occasion",
  },
];

export default function ChatFlow({ step, onNext, onGenerate }) {
  const [selected, setSelected] = useState(null);
  const current = steps.find((s) => s.id === step);

  const handleSelect = (option) => {
    setSelected(option);
  };

  const handleNextClick = () => {
    onNext(current.key, selected);
    if (step === steps.length) {
      onGenerate();
    }
  };

  return (
    <div className="chat-container">
      <p className="question">{current.question}</p>
      <div className="options">
        {current.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={selected === option ? "selected" : ""}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        disabled={!selected}
        onClick={handleNextClick}
        className="next-btn"
      >
        다음 ➡️
      </button>
    </div>
  );
}
