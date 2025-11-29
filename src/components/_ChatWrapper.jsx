import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatFlow from "./ChatFlow";

const steps = [
  { id: 1, type: "text", question: "누구를 위한 꽃인가요?", placeholder: "예: 엄마, 친구, 나 자신", key: "receiver" },
  { id: 2, type: "text", question: "그 사람을 떠올렸을 때 가장 먼저 떠오르는 장면은?", placeholder: "예: 힘든 날 조용히 옆에 있어줬던 순간", key: "memory" },
  { id: 3, type: "options", question: "당신의 마음은 어떤 방향으로 흐르고 있나요?", options: ["위로", "감사", "응원", "설렘", "축하"], key: "emotion" },
  { id: 4, type: "options", question: "말 대신 꽃으로 전한다면?", options: ["부드럽게", "따뜻하게", "기억에 남게", "조용하게"], key: "tone" },
  { id: 5, type: "options", question: "어떤 형태가 어울릴까요?", options: ["꽃다발", "화분", "드라이", "리스"], key: "form" },
  { id: 6, type: "options", question: "예산은 어느 정도가 편안한가요?", options: ["2만원 미만", "2~5만원", "5~10만원", "10만원 이상"], key: "budget" },
];

export default function ChatWrapper() {
  console.log("🐣 ChatWrapper 렌더링됨");

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleNext = (key, value) => {
    const newAnswers = { ...answers, [key]: value };

    if (step === steps.length) {
      // 마지막 단계 → 바로 generate
      handleGenerate(newAnswers);
    } else {
      setAnswers(newAnswers);
      setStep(step + 1);
    }
  };

  const handleGenerate = async (answersToSend) => {
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answersToSend),
      });

      const data = await res.json();
      console.log("🚀 navigate → /loading", data);

      navigate("/loading", { state: { result: data } });
    } catch (err) {
      console.error(err);
      alert("결과 생성 중 오류 발생");
    }
  };

  return <ChatFlow step={step} onNext={handleNext} />;
}
