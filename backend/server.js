const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-70b-versatile", // 改用 Llama 3.1 70B 模型
      max_tokens: 8000, // 根据预览限制设置
    });
    res.json({ data: response.choices[0]?.message?.content });
  } catch (error) {
    console.error("Error calling Groq API:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001; // 使用新的端口号
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));