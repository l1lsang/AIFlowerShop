import { useLocation, useNavigate } from "react-router-dom";
import FlowerResult from "./FlowerResult";

export default function FlowerResultWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result ?? null;

  if (!result || !result.imageUrl) {
    // 새로고침 시 안전하게 홈으로
    return <FlowerResult result={null} onReset={() => navigate("/")} />;
  }

  return <FlowerResult result={result} onReset={() => navigate("/")} />;
}
