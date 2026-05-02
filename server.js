import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());

// ---------------- OPENAI SETUP ----------------
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ---------------- QUESTION BANK (FALLBACK DATA) ----------------
const qaBank = [
  {
    question: "Write a poem on rain",
    answer: `Raindrops fall like gentle dreams,  
Washing earth in silver streams.`
  },
  {
    question: "Write a motivational quote for students",
    answer: `Success comes to those who never give up and keep learning.`
  },
  {
    question: "Explain Artificial Intelligence in simple words",
    answer: `AI is technology that allows machines to think and learn like humans.`
  },
  {
    question: "Write a short story about a robot",
    answer: `A robot learned emotions and helped save a city, becoming a hero.`
  },
  {
    question: "Explain cybersecurity in Hinglish",
    answer: `Cybersecurity ka matlab hai apne data ko hackers se protect karna.`
  }
];

// ---------------- API ROUTE ----------------
app.post("/generate", async (req, res) => {
  let { prompt } = req.body;

  if (!prompt) {
    return res.json({
      result: "Please enter a prompt",
      source: "validation"
    });
  }

  try {
    // 🔥 STEP 1: OPENAI CALL
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const aiResult = response.choices[0].message.content;

    return res.json({
      promptUsed: prompt,
      result: aiResult,
      source: "openai"
    });

  } catch (error) {
    console.log("OPENAI ERROR:", error.message);

    // 🔥 STEP 2: CHECK QA BANK (FALLBACK SMART ANSWER)
    const match = qaBank.find(
      (item) => item.question.toLowerCase() === prompt.toLowerCase()
    );

    if (match) {
      return res.json({
        promptUsed: prompt,
        result: match.answer,
        source: "qaBank"
      });
    }

    // 🔥 STEP 3: FINAL FALLBACK
    return res.json({
      promptUsed: prompt,
      result: `Demo Response 🌧️: "${prompt}"\nRain falls softly and nature smiles.`,
      source: "fallback"
    });
  }
});

// ---------------- SERVER START ----------------
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});