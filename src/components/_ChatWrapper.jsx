import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatFlow from "./ChatFlow";

export default function ChatWrapper() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleNext = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((prev) => prev + 1);
  };

  const handleGenerate = async () => {
    try {
      // LoadingFlow로 바로 이동
      navigate("/loading", { state: { result: answers } });
    } catch (err) {
      console.error("생성 오류:", err);
    }
  };

  // 마지막 단계 체크 → 자동 이동
  useEffect(() => {
    if (step > 6) {
      handleGenerate();
    }
  }, [step]);

  return (
    <ChatFlow
      step={step}
      onNext={handleNext}
      onGenerate={handleGenerate}
    />
  );
}
