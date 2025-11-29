import { useLocation, Navigate, useNavigate } from "react-router-dom";
import FlowerResult from "./FlowerResult";

export default function FlowerResultWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return <Navigate to="/" />;
  }

  return <FlowerResult result={result} onReset={() => navigate("/")} />;
}
