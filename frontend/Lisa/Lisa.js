console.log("Script is running");

let bgm;
let currentScene = 0;
let currentTextIndex = 0;
let currentLanguage = "en"; // 默认语言为英语
// 全局变量来跟踪玩家进度
let gameProgress = {
  talkedToLisa: false,
  talkedToNPC2: false,
  // 可以添加更多必要的NPC
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM is loaded");
  if (document.querySelector(".game-container")) {
    console.log("Game container found");
    bgm = document.getElementById("bgm");
    bgm.loop = true; // Let the music loop
    bgm.src = "./Music/Save the World.mp3"; // 设置统一的背景音乐
    bgm.volume = 0.5; // 设置音量为 50%
    startGame();
  } else {
    console.log("Game container not found");
  }
});


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

  let scenes = [
    {
      text: {
        en: [
          "Welcome to the first scene. You find yourself in a <span class='highlight' data-item='old key' data-image='../items/old-key.png'>dimly lit room</span>.",
        ],
        zh: [
          "欢迎来到第一个场景。你发现自己身处一个<span class='highlight' data-item='old key' data-image='../items/old-key.png'>昏暗的房间</span>。",
        ],
      },
      background: "./IntroImages/scene1.1-1.png",
      textStyle: "futuristic",
      character: "./npc/Lisa.png",
    },
    {
      text: {
      en: [
        "Welcome to the first scene. You find yourself in a <span class='highlight' data-item='old key' data-image='../items/old-key.png'>dimly lit room</span>.",
      ],
      zh: [
        "欢迎来到第一个场景。你发现自己身处一个<span class='highlight' data-item='old key' data-image='../items/old-key.png'>昏暗的房间</span>。",
      ],
      },
      isBlackScreen: true,
    }
  ];

  const displayText = () => {
    textContainer.innerHTML = ""; // Clear previous text
  
    const scene = scenes[currentScene];
    const textLines = scene.text[currentLanguage];
    const currentLine = textLines[currentTextIndex];
    const paragraph = document.createElement("p");
    paragraph.innerHTML = currentLine; // 使用 innerHTML 而不是 textContent
    textContainer.appendChild(paragraph);
  
    textContainer.className = "";
    textContainer.classList.add(scene.textStyle);
  
    // 为新添加的高亮文本添加点击事件
    addHighlightListeners();
  
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
      gameProgress.talkedToLisa = true;
      localStorage.setItem('gameProgress', JSON.stringify(gameProgress));
      window.location.href = "../Map/map.html"; 
      console.log("????", gameProgress.talkedToLisa);
    }
    
    // Update character image
    const characterImage = document.getElementById("character-image");
    if (scene.character) {
      characterImage.src = scene.character;
      characterImage.style.display = "block";
    } else {
      characterImage.style.display = "none";
    }

    bgm.play();

    // 移除音乐相关的代码，因为我们现在使用统一的背景音乐
  };

  nextButton.addEventListener("click", () => {
    currentTextIndex++;
    if (currentTextIndex >= scenes[currentScene].text[currentLanguage].length) {
      currentScene++;
      if (currentScene >= scenes.length) {
        updateScene();
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

// Music toggle logic
const musicToggle = document.getElementById("music-toggle");
let isMuted = false;

musicToggle.addEventListener("click", () => {
  if (isMuted) {
    bgm.muted = false;
    musicToggle.textContent = "🔊";
    isMuted = false;
  } else {
    bgm.muted = true;
    musicToggle.textContent = "🔇";
    isMuted = true;
  }
});

document.addEventListener('DOMContentLoaded', () => {

  const backMainButton = document.getElementById('back-main');
  backMainButton.addEventListener('click', () => {
      window.location.href = '../Map/map.html'; // 确保这是正确的主页面路径
  });

});

