console.log("Script is running");

let bgm;
let currentScene = 0;
let currentTextIndex = 0;
let currentLanguage = "en"; // 默认语言为英语
// 全局变量来跟踪玩家进度
let gameProgress = JSON.parse(localStorage.getItem('gameProgress')) || {
  talkedToLisa: false,
  talkedToNPC2: false,
};
// 当前NPC对话函数
let currentNPCDialogueCount = 3;

document.addEventListener("DOMContentLoaded", () => {
  console.log("lisa", gameProgress.talkedToLisa);
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
          "Welcome to Earth in 2056, an era where technology and sustainability blend seamlessly.",
          "Advanced AI and automation systems have revolutionized human life.",
          "Smart assistants are widely used in education and healthcare, helping people navigate daily challenges more efficiently.",
          "Global transportation has been fully automated.",
          "Public transit systems, including underground high-speed trains and aerial taxis, make travel quick and convenient.",
          "In this world, environmental protection and sustainability are at the forefront.",
          "Climate engineering technologies help control climate change, and cities are filled with green spaces and eco-friendly buildings.",
          "International cooperation has reached unprecedented levels.",
          "The United Nations plays a crucial role in setting standards for technology ethics and environmental protection.",
          "In this hopeful future, Earth is moving toward a brighter and more sustainable path.",
        ],
        zh: [
          "欢迎来到2056年的地球,一个科技与可持续发展完美融合的新时代。",
          "人工智能和先进的自动化系统彻底改变了人类的生活方式。",
          "智能助手广泛应用于教育和医疗领域，帮助人们更高效地应对生活中的挑战。",
          "全球交通系统已经实现全面自动化。",
          "地球上的公共交通包括地下高速列车和空中出租车，让人们的出行变得快捷而方便。",
        ],
      },
      character: "./npc/Bob.png",
      background: "./images/Union.png",
      textStyle: "futuristic",
      // character: "./npc/character1.png",
    },
  ];

  const displayText = () => {
    textContainer.innerHTML = ""; // Clear previous text
    if (!gameProgress.talkedToLisa) {
     scenes = [
        {
          text: {
            en: [
              "I don;t think you have prepared to talk to me yet.",
              "You should go talk to Lisa first."
            ],
            zh: [
              "你似乎还没准备好和我对话。",
              "你应该先去和 Lisa 谈谈"
            ],
          },
          background: "./images/Union.png",
          textStyle: "futuristic",
          character: "./npc/Bob.png",
        },
      ];
    }
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
      window.location.href = "../BlackScene/black.html"; // 移除了 './'
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


document.addEventListener('DOMContentLoaded', () => {

  const backMainButton = document.getElementById('back-main');
  backMainButton.addEventListener('click', () => {
      window.location.href = '../Map/map.html'; // 确保这是正确的主页面路径
  });

});

