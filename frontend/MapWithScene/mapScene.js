console.log("Script is running");

let currentScene = 0;
let currentTextIndex = 0;
let currentLanguage = "en"; // 默认语言为英语
let bgm; // 背景音乐

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM is loaded");
    
    const scene1 = document.getElementById('scene1');
    if (scene1) {
        scene1.addEventListener('click', () => {
            window.location.href = '../Scene1/scene1.html';
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

  const textContainer = document.getElementById("text-container");
  const nextButton = document.getElementById("next-text-button");
  const prevButton = document.getElementById("prev-text-button");
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
    updateScene();
});

  // 在初始化时，从 localStorage 获取语言设置
  currentLanguage = getLanguage();
  languageToggle.textContent = currentLanguage === "en" ? "EN" : "CH";

  const scenes = [
    {
      text: {
        en: ["Welcome to the Map."],
        zh: ["欢迎来到地图"],
      },
      background: "./map.png",
      textStyle: "futuristic",
    },
  ];

  const displayText = () => {
    textContainer.innerHTML = ""; // Clear previous text
    const scene = scenes[currentScene];
    const textLines = scene.text[currentLanguage];
    const currentLine = textLines[currentTextIndex];
    const paragraph = document.createElement("p");
    paragraph.textContent = currentLine;
    textContainer.appendChild(paragraph);

    textContainer.className = "";
    textContainer.classList.add(scene.textStyle);

    // Hide/Show navigation buttons
    prevButton.style.display =
      currentScene === 0 && currentTextIndex === 0 ? "none" : "inline-block";
    nextButton.style.display =
      currentScene === scenes.length - 1 &&
      currentTextIndex === textLines.length - 1
        ? "none"
        : "inline-block";
  };

  const updateScene = () => {

    const scene = scenes[currentScene];
    console.log("Updating scene to index:", currentScene);
    document.body.style.backgroundImage = `url('${scene.background}')`;
    displayText();

    if (scene.isBlackScreen) {
      window.location.href = "./black_screen.html"; // 移除了 './'
    }
    // Update character image
    const characterImage = document.getElementById("character-image");
    if (scene.character) {
      characterImage.src = scene.character;
      characterImage.style.display = "block";
    } else {
      characterImage.style.display = "none";
    }
  };

  nextButton.addEventListener("click", () => {
    currentTextIndex++;
    if (currentTextIndex >= scenes[currentScene].text[currentLanguage].length) {
      currentScene++;
      if (currentScene >= scenes.length) {
        window.location.href = "./black_screen.html"; // 移除了 './'
      } else {
        currentTextIndex = 0;
        updateScene();
      }
    } else {
      updateScene();
    }
  });


  prevButton.addEventListener("click", () => {
    currentTextIndex--;
    if (currentTextIndex < 0) {
      currentScene--;
      if (currentScene < 0) {
        currentScene = 0; // Prevent underflow
        currentTextIndex = 0;
      } else {
        currentTextIndex =
          scenes[currentScene].text[currentLanguage].length - 1;
      }
    }
    updateScene();
  });

  // Initial scene setup
  updateScene();
}
