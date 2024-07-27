console.log("Script is running");

let currentScene = 0;
let currentTextIndex = 0;
let currentLanguage = "en"; 
let bgm; // 背景音乐





document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM is loaded");
    
    const backMainButton = document.getElementById('back-main');
    backMainButton.addEventListener('click', () => {
        window.location.href = '../Main.html'; // 确保这是正确的主页面路径
    });

    const scene1 = document.getElementById('scene1');
    if (scene1) {
        scene1.addEventListener('click', () => {
            window.location.href = '../Lisa/Lisa.html';
        });
    }
    const scene2 = document.getElementById('scene2'); 
    if (scene2) {
        scene2.addEventListener('click', () => {
            window.location.href = '../Bob/Bob.html';
        });
    }

    bgm = document.getElementById("bgm");
    if (bgm) {
        bgm.loop = true; // Let the music loop
        bgm.src = "./Music/Immediate Music - From The Light.mp3"; // 设置统一的背景音乐
        bgm.volume = 0.5; // 设置音量

        // // 尝试自动播放
        // bgm.play().then(() => {
        //     const musicToggle = document.getElementById("music-toggle");
        //     if (musicToggle) musicToggle.textContent = '🔊';
        // }).catch(() => {
        //     // 如果自动播放失败，显示提示
        //     showMusicPrompt();
        // });
    }

    if (document.querySelector(".game-container")) {
        console.log("Game container found");
        startGame();
    } else {
        console.log("Game container not found");
    }
});


 // Autoplay music on first click 
 document.body.addEventListener('click', function playAudio() {
  bgm.play()
    .then(() => {
      musicToggle.textContent = "🔊";
      document.body.removeEventListener('click', playAudio);
    })
    .catch(error => console.log("Autoplay still not allowed:", error));
   
}, { once: true });

// function showMusicPrompt() {
//     const playPrompt = document.createElement('div');
//     playPrompt.textContent = 'Click here to start the music';
//     playPrompt.style.position = 'fixed';
//     playPrompt.style.top = '50%';
//     playPrompt.style.left = '50%';
//     playPrompt.style.transform = 'translate(-50%, -50%)';
//     playPrompt.style.padding = '20px';
//     playPrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
//     playPrompt.style.color = 'white';
//     playPrompt.style.cursor = 'pointer';
//     playPrompt.style.borderRadius = '10px';
//     playPrompt.style.zIndex = '1000';

//     playPrompt.addEventListener('click', () => {
//         toggleMusic();
//         document.body.removeChild(playPrompt);
//     });

//     document.body.appendChild(playPrompt);
// }

function toggleMusic() {
    if (bgm.paused) {
        bgm.play();
        const musicToggle = document.getElementById("music-toggle");
        if (musicToggle) musicToggle.textContent = '🔊';
    } else {
        bgm.pause();
        const musicToggle = document.getElementById("music-toggle");
        if (musicToggle) musicToggle.textContent = '🔇';
    }
}


function startGame() {
  console.log("Starting game");

  const languageToggle = document.getElementById("language-toggle");

  languageToggle.addEventListener("click", () => {
    if (currentLanguage === "en") {
        currentLanguage = "zh";
        setLanguage("zh");
        languageToggle.textContent = "CH";
    } else {
        currentLanguage = "en";
        setLanguage("en");
        languageToggle.textContent = "EN";
    }
    // updateScene();
});

  // 在初始化时，从 localStorage 获取语言设置
  currentLanguage = getLanguage();
  languageToggle.textContent = currentLanguage === "en" ? "EN" : "CH";

}
