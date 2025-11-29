import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatFlow from "./ChatFlow";

export default function ChatWrapper() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleNext = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setStep(prev => prev + 1);
  };

  const handleGenerate = async () => {
    // 먼저 LoadingFlow로 이동
    navigate("/loading", { state: { answers } });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json();

      // 결과 도착 시 Result 페이지로 이동
      navigate("/result", { state: { result: data } });
    } catch (err) {
      console.error("결과 생성 실패:", err);
      alert("결과 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <ChatFlow
      step={step}
      onNext={handleNext}
      onGenerate={handleGenerate}
    />
  );
}
