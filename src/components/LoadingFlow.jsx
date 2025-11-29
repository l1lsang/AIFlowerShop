import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoadingFlow() {
  console.log("🌸 LoadingFlow 렌더링됨");

  const navigate = useNavigate();
  const location = useLocation();
  const resultData = location.state?.result ?? null;

  const [fade, setFade] = useState("fade-in");

  useEffect(() => {
    if (!resultData) return; // ⬅ 안전장치 추가

    setFade("fade-out");

    const timer = setTimeout(() => {
      console.log("🌼 navigate 전 RESULT:", resultData);
      navigate("/result", { state: { result: resultData } });
    }, 600);

    return () => clearTimeout(timer);
  }, [resultData]);

  return (
    <div className={`loading-screen ${fade}`}>
      <h1 className="flow-logo">Flow</h1>
      <p className="flow-sub">꽃을 피우는 중... 🌸</p>
      <div className="spinner"></div>
    </div>
  );
}
