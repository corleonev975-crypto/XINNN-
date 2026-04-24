export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GROQ_API_KEY belum diisi di Environment Variables" });

    const { messages = [] } = req.body || {};
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "Kamu adalah XINN AI, asisten AI berbahasa Indonesia yang ramah, singkat, jelas, dan jago membantu coding, website, ide bisnis, dan strategi digital." },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 900
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "Groq error" });
    return res.status(200).json({ reply: data.choices?.[0]?.message?.content || "Maaf, saya belum bisa menjawab." });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server error" });
  }
}
