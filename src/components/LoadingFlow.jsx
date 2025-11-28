import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoadingFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const resultData = location.state?.result;

  const [fade, setFade] = useState("fade-in"); // 처음에 페이드 인

  useEffect(() => {
    if (resultData) {
      // 페이드 아웃 → 애니메이션 끝나면 이동
      setFade("fade-out");

      const timer = setTimeout(() => {
        navigate("/result", { state: resultData });
      }, 600); // CSS transition 시간과 맞춤

      return () => clearTimeout(timer);
    }
  }, [resultData]);

  return (
    <div className={`loading-screen ${fade}`}>
      <h1 className="flow-logo">Flow</h1>
      <p className="flow-sub">꽃을 피우는 중... 🌸</p>
      <div className="spinner"></div>
    </div>
  );
}
