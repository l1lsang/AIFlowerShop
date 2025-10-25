// /api/generate.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userData } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OPENAI_API_KEY in environment variables");
    return res.status(500).json({ error: "Server API key not configured." });
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    console.log("🌼 Step 1: Generating text with GPT...");
    const prompt = `
    사용자가 입력한 정보:
    - 제품: ${userData.product}
    - 꽃 종류: ${userData.type}
    - 예산: ${userData.budget}
    - 색감: ${userData.color}
    - 상황: ${userData.occasion}

    위 정보를 바탕으로 현재 계절에 어울리는 꽃 조합을 추천하고,
    꽃들의 꽃말 의미와 감성 설명을 짧게 작성해주세요.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const flowerDescription = completion.choices[0]?.message?.content?.trim() || "꽃 설명 생성 실패 😢";
    console.log("✅ Step 1 완료: 텍스트 생성 성공");

    // 🌸 Step 2: 이미지 생성
    console.log("🌷 Step 2: Generating image...");
    const imagePrompt = `
    A realistic and aesthetically pleasing ${userData.color} tone bouquet for ${userData.occasion}.
    Include flowers suitable for ${userData.type}, styled for the current season.
    Professional photography lighting, high quality, soft background.
    `;

    const image = await client.images.generate({
      model: "gpt-image-1",
      prompt: imagePrompt,
      size: "1024x1024",
      quality: "high",
    });

    const imageUrl = image.data?.[0]?.url;
    console.log("✅ Step 2 완료: 이미지 생성 성공", imageUrl);

    if (!imageUrl) {
      console.warn("⚠️ 이미지 URL이 비어 있습니다.");
    }

    // ✅ 최종 응답
    res.status(200).json({
      description: flowerDescription,
      imageUrl: imageUrl || null,
    });
  } catch (error) {
    console.error("❌ AI 처리 중 오류 발생:", error?.message || error);
    if (error?.response) {
      console.error("🔍 OpenAI Response Error:", error.response.data);
    }

    res.status(500).json({
      error: "AI request failed.",
      details: error?.message || "Unknown error",
    });
  }
}
