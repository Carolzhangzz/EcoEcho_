console.log("Script is running");

let bgm;
let currentScene = 0;
let currentTextIndex = 0;
let currentLanguage = "en"; // 默认语言为英语

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM is loaded");
  if (document.querySelector(".game-container")) {
    console.log("Game container found");
    bgm = document.getElementById("bgm");
    bgm.loop = true; // Let the music loop
    bgm.src = "./Music/Immediate Music - From The Light.mp3"; // 设置统一的背景音乐
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

  const scenes = [
    {
      text: {
        en: ["Welcome to the future."],
        zh: ["欢迎来到未来。"],
      },
      background: "./IntroImages/scene1.1-1.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "A close-up view of a bustling central square in a futuristic city in the year 2056.",
          "Towering skyscrapers with shiny metal and glass exteriors are prominently visible.",
          "The streets and buildings are adorned with clean energy K power devices, such as transparent solar panels and wind turbines, seen up close.",
          "Sleek flying cars and self-driving vehicles are in the foreground.",
          "Large holographic billboards display the latest technology products and city news.",
          "The square is lined with lush green plants, creating a modern urban garden, seen from a closer perspective.",
          "The overall atmosphere is bright and busy, with a clear blue sky and futuristic elements in the scene. Sci-Fi Style.",
        ],
        zh: [
          "一个繁忙的中央广场的特写视图，位于2056年的未来城市。",
          "高耸的摩天大楼，闪亮的金属和玻璃外墙醒目可见。",
          "街道和建筑物装饰着清洁能源K电源装置，如透明太阳能电池板和风力涡轮机，近距离看。",
          "时尚的飞行汽车和自动驾驶汽车在前景中。",
          "大型全息广告牌展示最新的技术产品和城市新闻。",
          "广场上种满了郁郁葱葱的绿色植物，形成现代城市花园，从更近的角度看。",
          "整体氛围明亮繁忙，天空湛蓝，场景中有未来元素。科幻风格。",
        ],
      },
      background: "./IntroImages/scene1.1-2.png",
      textStyle: "futuristic",

      character: "./npc/character1.png",
    },
    {
      text: {
        en: [
          "A private high-tech office belonging to KI, with a single desk filled with advanced scientific instruments and equipment.",
          "A holographic screen on the desk displays various data and research progress.",
          "On the desk, there is a photo of KI’s father, and in one corner of the office, there are some mementos, indicating KI's fond memories of his father.",
          "The desk also features a small model or device representing the clean energy source K, symbolizing KI’s field of research.",
          "The office is tidy and modern, with a serene and focused atmosphere.",
          "The overall setting is bright, with ample lighting during the day, reflecting KI's dedication to his work while subtly conveying his longing for his father.",
          "No characters are present in the scene. Sci-Fi Style.",
        ],
        zh: [
          "一个高科技的私人办公室，属于KI，桌子上摆满了先进的科学仪器和设备。",
          "桌上的全息屏幕显示各种数据和研究进展。",
          "桌子上有KI父亲的照片，办公室的一角有一些纪念品，表明KI对父亲的深情回忆。",
          "桌子上还有一个小模型或装置，代表清洁能源K，象征着KI的研究领域。",
          "办公室整洁现代，气氛宁静专注。",
          "整体环境明亮，白天有充足的光线，反映出KI对工作的投入，同时隐约传达出他对父亲的思念。",
          "场景中没有角色。科幻风格。",
        ],
      },
      background: "./IntroImages/scene1.2-1.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: ["None."],
        zh: ["无。"],
      },
      background: "./IntroImages/scene1.2-2.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "A futuristic research facility or exploration base, showcasing the discovery of clean energy source K.",
          "The scene features advanced research equipment and a high-tech lab setup.",
          "The discovery site includes sampling devices and instruments, set against the backdrop of a Martian surface base.",
          "Prominently displayed is a sample or device representing clean energy source K, highlighting its significance.",
          "Holographic screens on the walls illustrate the impact of clean energy K on Earth's development, such as reducing pollution and improving energy efficiency.",
          "No characters are present in the scene. Sci-Fi Style.",
        ],
        zh: [
          "一个未来的研究设施或探测基地，展示了清洁能源K的发现。",
          "场景中展示了先进的研究设备和高科技实验室设置。",
          "发现现场包括采样设备和仪器，背景是火星表面基地。",
          "突出的展示了一个样本或装置，代表清洁能源K，突显其重要性。",
          "墙上的全息屏幕展示了清洁能源K对地球发展的影响，如减少污染和提高能源效率。",
          "场景中没有角色。科幻风格。",
        ],
      },
      background: "./IntroImages/scene2-1.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "A close-up view of the research equipment and the clean energy source K, with intricate details visible.",
          "Holographic displays on the equipment show the scientific data and analysis results.",
          "The research facility or exploration base is bustling with activity, with scientists working and robots assisting in the tasks.",
          "The environment is bright and well-lit, reflecting the advanced technology and the significance of the discovery.",
          "Sci-Fi Style.",
        ],
        zh: [
          "研究设备和清洁能源K的特写视图，细节清晰可见。",
          "设备上的全息显示屏显示科学数据和分析结果。",
          "研究设施或探测基地繁忙，科学家们在工作，机器人协助任务。",
          "环境明亮且光线充足，反映了先进技术和发现的重要性。",
          "科幻风格。",
        ],
      },
      background: "./IntroImages/scene2-2.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: ["You have obtained:","A mysterious key","An old photograph","A cryptic note"],
        zh: ["你获得了：","一把神秘的钥匙","一张旧照片","一张神秘的便条"],
      },
      background: "./IntroImages/black_screen.png", // 确保你有一个黑色背景图片
      textStyle: "futuristic",
      isBlackScreen: true // 新添加的属性来标识黑屏场景
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

    bgm.play();

    // 移除音乐相关的代码，因为我们现在使用统一的背景音乐
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
