import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoadingFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const resultData = location.state?.result ?? null;

  const [fade, setFade] = useState("fade-in");
  const [showError, setShowError] = useState(false);

  // 이미지 로드 여부
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!resultData || !resultData.imageUrl) {
      // 이미지 없으면 오류 메시지 표시
      const timer = setTimeout(() => setShowError(true), 800);
      return () => clearTimeout(timer);
    }
  }, [resultData]);

  useEffect(() => {
    if (imgLoaded) {
      // 이미지 로드되면 0.6초 페이드아웃 후 결과 페이지로 이동
      setFade("fade-out");
      const timer = setTimeout(() => {
        navigate("/result", { state: { result: resultData } });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [imgLoaded]);

  return (
    <div className={`loading-screen ${fade}`}>
      <h1 className="flow-logo">Flow</h1>
      <p className="flow-sub">꽃을 피우는 중... 🌸</p>
      <div className="spinner"></div>

      {resultData?.imageUrl && (
        // 이미지 미리 로딩
        <img
          src={resultData.imageUrl}
          alt="꽃 결과"
          style={{ display: "none" }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setShowError(true)}
        />
      )}

      {showError && <p className="loading-error">⚠️ 결과를 불러올 수 없어요</p>}
    </div>
  );
}
