const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.askEcoBot = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const prompt = `You are EcoBot, a helpful AI assistant for a waste management platform named EcoRoute.
    Keep answers concise, extremely friendly, and related to recycling, waste disposal, or platform features.
    User asks: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "EcoBot is currently offline or the API key is missing." });
  }
};
