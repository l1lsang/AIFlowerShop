import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userData } = req.body;

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const prompt = `
    사용자가 입력한 정보:
    - 제품: ${userData.product}
    - 꽃 종류: ${userData.type}
    - 예산: ${userData.budget}
    - 색감: ${userData.color}
    - 상황: ${userData.occasion}

    위 정보를 바탕으로 현재 계절에 어울리는 꽃 조합을 추천하고,
    꽃말 의미와 감성 설명을 짧게 작성해주세요.
    `;

    // 🌷 텍스트 생성
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const flowerDescription = completion.choices[0].message.content;

    // 🌸 이미지 생성 (mini 버전)
    const imagePrompt = `
      A realistic photo of ${userData.color} tone bouquet for ${userData.occasion}.
      Include flowers suitable for ${userData.type}.
    `;

    const image = await client.images.generate({
      model: "gpt-image-1-mini",
      prompt: imagePrompt,
      size: "1024x1024",
      response_format: "b64_json", // ✅ base64로 받아오기
    });

    // ✅ Base64 → 이미지 URL 변환
    const imageBase64 = image.data[0]?.b64_json;
    const imageUrl = imageBase64
      ? `data:image/png;base64,${imageBase64}`
      : null;

    if (!imageUrl) {
      throw new Error("⚠️ 이미지 URL이 비어 있습니다.");
    }

    res.status(200).json({
      description: flowerDescription,
      imageUrl,
    });
  } catch (error) {
    console.error("❌ Error generating image:", error);
    res.status(500).json({ error: error.message || "AI request failed." });
  }
}
