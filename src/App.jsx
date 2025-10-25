import React, { useState } from "react";
import "./App.css";

const steps = [
  {
    id: 1,
    question: "어떤 제품을 찾고 계신가요?",
    options: ["생화 꽃다발", "말린 꽃", "화분", "꽃 선물세트"],
    key: "productType",
  },
  {
    id: 2,
    question: "꽃을 어떤 상황에 선물하시나요?",
    options: ["생일", "기념일 / 연인 선물", "집 장식", "그냥 기분 전환"],
    key: "situation",
  },
  {
    id: 3,
    question: "예산은 어느 정도 생각하고 계신가요?",
    options: ["1만원 이하", "1~3만원", "3~5만원", "5만원 이상"],
    key: "budget",
  },
  {
    id: 4,
    question: "꽃의 색감은 어떤 느낌이 좋으신가요?",
    options: ["레드/핑크", "그린", "보라/블루", "랜덤 / 믹스"],
    key: "color",
  },
  {
    id: 5,
    question: "특별히 선호하는 꽃이 있으신가요?",
    options: ["장미", "튤립", "해바라기", "프리지아", "직접 입력"],
    key: "flowerPreference",
  },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userChoices, setUserChoices] = useState({});
  const [finished, setFinished] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const handleOptionClick = (key, value) => {
    if (value === "직접 입력") {
      setCustomInput(""); // 입력창 활성화
    } else {
      nextStep(key, value);
    }
  };

  const nextStep = (key, value) => {
    setUserChoices({ ...userChoices, [key]: value });
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="chat-container">
      <h1>🌸 AI Flower Shop</h1>

      {!finished ? (
        <div className="chat-step">
          <div className="ai-bubble">{steps[currentStep].question}</div>
          <div className="options">
            {steps[currentStep].options.map((option) => (
              <button
                key={option}
                onClick={() =>
                  handleOptionClick(steps[currentStep].key, option)
                }
              >
                {option}
              </button>
            ))}
          </div>

          {customInput !== undefined &&
            steps[currentStep].options.includes("직접 입력") &&
            !finished &&
            currentStep === 4 && ( // id: 5이므로 index는 4
              <div className="input-box">
                <input
                  type="text"
                  placeholder="좋아하는 꽃을 입력해주세요 🌷"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                />
                <button
                  onClick={() =>
                    nextStep(steps[currentStep].key, customInput || "없음")
                  }
                >
                  확인
                </button>
              </div>
            )}

          <div className="step-indicator">
            Step {currentStep + 1}/{steps.length}
          </div>
        </div>
      ) : (
        <div className="ai-bubble">
          추천 꽃을 준비 중이에요! 🌼 <br />
          선택 내용: {JSON.stringify(userChoices, null, 2)}
        </div>
      )}
    </div>
  );
}
