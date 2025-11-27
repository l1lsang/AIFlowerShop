import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") 
    return res.status(405).json({ error: "Method not allowed" });

  const user = req.body;

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    // 1) 텍스트
    const textPrompt = `
당신은 FLOW의 감정 큐레이터입니다.
Flow: "마음은 흐르고, 꽃은 피어납니다."

문체: 조용하고 따뜻함. 상업적 어휘 금지.

사용자 정보:
- 받는 사람: ${user.receiver}
- 떠오른 장면: ${user.memory}
- 감정: ${user.emotion}
- 전달 방식: ${user.tone}
- 꽃의 형태: ${user.form}
- 예산: ${user.budget}

아래 형식으로 마크다운으로 출력하세요:

# 🌸 오늘 당신의 마음

(감정을 2~4문장으로 해석 — 관찰 + 비유 중심)

## 💐 어울리는 꽃
- **꽃 이름** — 꽃말/감정적 의미
- **꽃 이름** — 감정적 의미
- **꽃 이름** — 감정적 의미

## ✨ 건네면 좋은 한 문장
> 짧지만 진심 어린 한 줄
## 중요: 가격(2만원 미만: 1-3송이, 2-5: 6송이, 5-10: 10송이, 10~ : 10송이 이상)
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: textPrompt }],
      temperature: 0.75,
    });

    const text = completion.choices[0].message.content.trim();

    // 2) 이미지
    const imgPrompt = `
A realistic premium flower arrangement photo.
style: ${user.form}
emotion: ${user.emotion}
tone: ${user.tone}
based on memory: "${user.memory}"
soft natural light, shallow depth, neutral background, editorial shot.
`;

    const image = await client.images.generate({
      model: "gpt-image-1-mini",
      prompt: imgPrompt,
      size: "1024x1024",
    });

    const base64 = image.data?.[0]?.b64_json;
    const imageUrl = `data:image/png;base64,${base64}`;

    return res.status(200).json({ text, imageUrl });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "AI request failed" });
  }
}
