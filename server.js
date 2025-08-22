import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ reply: "Message is required." });

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: message }]}] })
    });
    const data = await r.json();

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || "I couldn’t think of a response right now.";

    res.json({ reply });
  } catch (e) {
    console.error("Gemini error:", e);
    res.status(500).json({ reply: "Server error contacting AI." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ StudyCare backend running on :${PORT}`);
});
