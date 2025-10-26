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
    // 🌷 1️⃣ 텍스트 설명 생성
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
    });

    const flowerDescription = completion.choices[0].message.content.trim();

    // 🌸 2️⃣ 이미지 프롬프트 생성
    const imagePrompt = `
    A realistic, detailed, soft lighting photo of a ${userData.color} tone bouquet 
    for ${userData.occasion}, including flowers suitable for ${userData.type}. 
    Beautiful composition, gentle bokeh background.
    `;

    // 🌼 3️⃣ 이미지 생성 (b64_json으로 반환됨)
    const image = await client.images.generate({
      model: "gpt-image-1-mini",
      prompt: imagePrompt,
      size: "1024x1024",
    });

    // base64 데이터 추출
    const imageBase64 = image.data[0]?.b64_json;

    if (!imageBase64) {
      console.error("⚠️ 이미지 데이터가 비어 있습니다:", image);
      return res.status(500).json({ error: "Image generation failed (no data)." });
    }

    // 브라우저에서 표시 가능한 data URL로 변환
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    // 🌻 4️⃣ 결과 반환
    res.status(200).json({
      description: flowerDescription,
      imageUrl,
    });

  } catch (error) {
    console.error("❌ Error generating flower or image:", error);
    res.status(500).json({ error: "AI request failed." });
  }
}
