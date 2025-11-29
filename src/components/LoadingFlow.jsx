// src/components/LoadingFlow.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoadingFlow() {
  console.log("🌸 LoadingFlow 렌더링됨");

  const navigate = useNavigate();
  const location = useLocation();
  const resultData = location.state?.result ?? null;

  const [fade, setFade] = useState("fade-in");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (resultData && resultData.imageUrl) {
        // result가 있으면 /result로 이동
        console.log("🌼 navigate → /result", resultData);
        navigate("/result", { state: { result: resultData } });
      } else {
        // result 없으면 홈으로
        console.log("🌼 navigate → /");
        navigate("/", { replace: true });
      }
    }, 1000); // 원하는 로딩 시간(ms)

    return () => clearTimeout(timer);
  }, [resultData, navigate]);

  return (
    <div className={`loading-screen ${fade}`}>
      <h1 className="flow-logo">Flow</h1>
      <p className="flow-sub">꽃을 피우는 중... 🌸</p>
      <div className="spinner"></div>
    </div>
  );
}
