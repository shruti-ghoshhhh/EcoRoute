const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.askEcoBot = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are EcoBot, a helpful AI assistant for a waste management platform named EcoRoute.
Keep answers concise, extremely friendly, and related to recycling, waste disposal, or platform features.
Do not use markdown formatting like ** or ## in your responses - keep it plain text.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 512,
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    res.json({ reply: text });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ error: "EcoBot is currently offline. Please check your Groq API key." });
  }
};
