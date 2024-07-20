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