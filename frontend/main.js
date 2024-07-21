// 背景音乐
var bgm = new Howl({
    src: ['path/to/your/background-music.mp3'],
    loop: true,
    volume: 0.5
});

// 开始播放背景音乐
bgm.play();

// 开始游戏按钮点击事件
document.getElementById('startButton').addEventListener('click', function() {
    // 这里添加开始游戏的逻辑
    console.log('游戏开始');
});

// 可以在这里添加更多游戏相关的 JavaScript 代码
document.addEventListener('DOMContentLoaded', () => {
    const scene1 = document.getElementById('scene1');
    
    scene1.addEventListener('click', () => {
        window.location.href = './Scene1/scene1.html';
    });

    // 其他现有的代码...
});

async function callAI(prompt) {
    try {
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.choices[0].text;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }