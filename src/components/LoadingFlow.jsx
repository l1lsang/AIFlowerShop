import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoadingFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const answers = location.state?.answers ?? null; // ChatWrapper에서 받은 answers

  const [fade, setFade] = useState("fade-in");

  useEffect(() => {
    // answers가 없으면 경고 메시지
    if (!answers) return;

    // 페이드 아웃 애니메이션
    const timer = setTimeout(() => {
      setFade("fade-out");
    }, 60000); // 잠깐 보여주고 페이드아웃

    return () => clearTimeout(timer);
  }, [answers]);

  return (
    <div className={`loading-screen ${fade}`}>
      <h1 className="flow-logo">Flow</h1>
      <p className="flow-sub">꽃을 피우는 중... 🌸</p>
      <div className="spinner"></div>
    </div>
  );
}
