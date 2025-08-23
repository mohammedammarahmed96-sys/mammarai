export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Rewrite the following prompt into a single polished sentence. 
       Keep it clear and detailed, suitable for AI input. 
       Do not explain, do not add extra notes, just return the improved prompt:\n\n"${prompt}"`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const enhanced =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ Enhancement failed";

    res.status(200).json({ enhanced });
  } catch (err) {
    console.error("Enhance API Error:", err);
    res.status(500).json({ error: "Failed to enhance prompt" });
  }
}
