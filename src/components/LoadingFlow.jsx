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
      setFade("fade-out");

      setTimeout(() => {
        navigate("/result", { state: { result: resultData } });
      }, 600);
    }, 500); // 최소 표시 시간
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
