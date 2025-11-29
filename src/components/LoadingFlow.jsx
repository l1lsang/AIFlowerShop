import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoadingFlow() {
  console.log("🌸 LoadingFlow 렌더링됨");

  const navigate = useNavigate();
  const location = useLocation();
  const resultData = location.state?.result ?? null;

  const [fade, setFade] = useState("fade-in");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // 결과가 없으면 잠시 후 에러 메시지
    if (!resultData) {
      const timer = setTimeout(() => setShowError(true), 80000); // 0.8초 후 에러 메시지
      return () => clearTimeout(timer);
    }

    // 결과가 있으면 페이드아웃 후 result 페이지 이동
    const timer = setTimeout(() => {
      setFade("fade-out");
      setTimeout(() => {
        navigate("/result", { state: { result: resultData } });
      }, 600); // CSS 페이드 시간과 맞춤
    }, 1200); // 로딩창 최소 1.2초 표시
    return () => clearTimeout(timer);
  }, [resultData]);

  return (
    <div className={`loading-screen ${fade}`}>
      <h1 className="flow-logo">Flow</h1>
      <p className="flow-sub">꽃을 피우는 중... 🌸</p>
      <div className="spinner"></div>

      {showError && <p className="loading-error">⚠️ 결과를 불러올 수 없어요</p>}
    </div>
  );
}
