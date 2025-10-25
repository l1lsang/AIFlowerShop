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

    위 정보를 바탕으로 계절에 어울리는 꽃 조합을 추천하고,
    꽃말 의미와 감성 설명을 짧게 작성해주세요.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const flowerDescription = completion.choices[0].message.content;

    // 🌸 이미지 생성
    const image = await client.images.generate({
      model: "gpt-image-1",
      prompt: `
      A realistic photo of ${userData.color} tone bouquet for ${userData.occasion}.
      Include flowers suitable for ${userData.type}.
      `,
      size: "1024x1024",
    });

    res.status(200).json({
      description: flowerDescription,
      imageUrl: image.data[0].url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI request failed." });
  }
}
