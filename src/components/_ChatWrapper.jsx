// ChatWrapper.jsx
const handleGenerate = async () => {
  // 로딩 페이지 먼저 띄우기
  navigate("/loading");

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });
    const data = await res.json();
    // 결과 도착하면 LoadingFlow에서 Result로 이동
    navigate("/result", { state: { result: data } });
  } catch (err) {
    console.error(err);
    alert("결과 생성 실패");
  }
};
