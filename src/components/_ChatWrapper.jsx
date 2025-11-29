import React, { useState } from "react";
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
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      const data = await res.json();

      navigate("/loading", { state: { result: data } });
    } catch (err) {
      alert("오류 발생");
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
