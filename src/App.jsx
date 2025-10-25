import React, { useState } from "react";
import ChatFlow from "./components/ChatFlow";
import FlowerResult from "./components/FlowerResult";
import "./App.css";

export default function App() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNext = (key, value) => {
    setUserData({ ...userData, [key]: value });
    setStep(step + 1);
  };

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userData }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
    setStep(99);
  };

  return (
    <div className="App">
      <h1>🌸 AI Flower Shop 🌸</h1>

      {step <= 5 && (
        <ChatFlow step={step} onNext={handleNext} onGenerate={handleGenerate} />
      )}

      {loading && <p>AI가 꽃을 고르고 있어요... 🌷</p>}

      {step === 99 && result && <FlowerResult result={result} />}
    </div>
  );
}
