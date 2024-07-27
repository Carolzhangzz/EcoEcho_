const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const axios = require('axios');
const path = require('path');
require('dotenv').config(); // 加载 .env 文件中的环境变量

const app = express();

// 设置静态文件服务为当前目录
app.use(express.static(__dirname));
// 假设 server.js 在 backend 目录中
// 设置静态文件服务指向 frontend 目录
app.use(express.static(path.join(__dirname, '../frontend')));

// 其他中间件设置...
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/Main.html'));
});

// 捕获所有其他路由，返回 Main.html（用于单页应用）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/Main.html'));
});

// Groq 路由 
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

// Convai API 路由 
app.post('/api/convai', async (req, res) => {
  console.log('Received request to /api/convai');
  console.log('Request body:', req.body);

  const { prompt, sessionID, charID, voiceResponse } = req.body;
  const apiKey = process.env.CONVAI_API_KEY;

  const formData = new URLSearchParams();
  formData.append('userText', prompt);
  formData.append('charID', charID);
  formData.append('sessionID', sessionID);
  formData.append('voiceResponse', voiceResponse.toString());

  try {
    const response = await axios.post('https://api.convai.com/character/getResponse', formData, {
      headers: {
        'CONVAI-API-KEY': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    // console.log('Convai API response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error in /api/convai:', error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
