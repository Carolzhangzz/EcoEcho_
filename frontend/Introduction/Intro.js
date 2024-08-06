let currentScene = 0;
let currentTextIndex = 0;
bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "./Music/bgm(start).mp3"; // 设置统一的背景音乐
bgm.volume = 0.5; // 设置音量为 50%

document.addEventListener("DOMContentLoaded", () => {
  startGame();
});

function startGame() {
  //写在内部可以实时切换语言
  // const languageToggle = document.getElementById("language-toggle");
  const textContainer = document.getElementById("text-container");
  const nextButton = document.getElementById("next-text-button");
  const prevButton = document.getElementById("prev-text-button");

  // // 随时更新语言切换按钮
  // languageToggle.addEventListener("click", () => {
  //   if (currentLanguage === "en") {
  //     currentLanguage = "zh";
  //     setLanguage("zh");
  //     languageToggle.textContent = "CH";
  //   } else {
  //     currentLanguage = "en";
  //     setLanguage("en");
  //     languageToggle.textContent = "EN";
  //   }
  //   updateScene();
  // });

  const scenes = [
    {
      text: {
        en: [
          "Welcome to Earth in 2056, where technology and sustainability merge perfectly.",
          "AI and automation have transformed life, with smart assistants boosting efficiency in education and healthcare.",
          "The global transportation system is automated, featuring high-speed underground trains and air taxis for convenient travel.",
          "Environmental protection and sustainability are key, with climate engineering controlling climate change and cities filled with green buildings.",
          "International cooperation has strengthened, with the UN leading in technology ethics and environmental protection.",
          "Earth is moving towards a better future.",
        ],
        zh: [
          "欢迎来到2056年的地球，科技与可持续发展完美融合。",
          "人工智能和自动化改变了生活，智能助手提升教育和医疗效率。",
          "全球交通系统实现自动化，地下高速列车和空中出租车让出行更便捷。",
          "环保和可持续发展是核心议题，气候工程控制气候变化，城市中充满绿色建筑。",
          "国际合作加强，联合国引领科技伦理和环境保护。",
          "地球正朝着更美好的未来前进。",
        ],
      },
      background: "./IntroImages/scene1.1-1.png",
      textStyle: "futuristic",
      // character: "./npc/character1.png",
    },
    {
      text: {
        en: [
          "A sustainable energy called T has transformed human society.",
          "This clean energy from Mars solved Earth's energy crisis and reduced dependence on polluting sources.",
          "Its efficiency and eco-friendliness made it the world's primary energy, driving advancements and unprecedented prosperity.",
        ],
        zh: [
          "一种名为T的可持续能源改变了人类社会。",
          "来自火星的清洁能源T解决了地球的能源危机，减少了对污染能源的依赖。",
          "其高效和环保特性使其成为全球主要能源，推动了各领域的发展，带来了前所未有的繁荣。",
        ],
      },
      background: "./IntroImages/scene1.2.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "Your name is KI, a 26-year-old promising scientist specializing in quantum physics and time machine research.",
          "Your passion for science was inspired by your father, Kane, a cosmic scientist who nurtured your curiosity about the unknown universe from a young age.",
        ],
        zh: [
          "你叫KI，26岁，是一位年轻有为的科学家，专注于量子物理和时间机器的研究。",
          "你对科学的热情来自于父亲Kane的影响，他是一位宇宙科学家，从小培养了你对未知宇宙的好奇心。",
        ],
      },
      background: "./IntroImages/scene1.3-1.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "Kane is a distinguished scientist who led the early research on Mars' clean energy, T.",
          "This energy promises to transform Earth's energy structure, offering a sustainable solution.",
          "Kane's breakthrough made him a legendary figure in the scientific community.",
        ],
        zh: [
          "Kane是一位杰出的科学家，主导了火星清洁能源T的早期研究。",
          "这种能源有望改变地球能源结构，提供可持续的解决方案。",
          "Kane揭开了T能源的初步奥秘，成为科学界的传奇人物。",
        ],
      },
      background: "./IntroImages/scene2.1.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "In 2036, Kane tragically died during a Mars mission aimed at uncovering T energy's potential.",
          "The mission's failure and his sacrifice were concealed by the government, fearing panic and public pressure.",
          "The government forced your family to help keep the secret.",
        ],
        zh: [
          "2036年，Kane在一次火星任务中不幸殉职，任务本希望揭示T能源的潜力。",
          "任务的失败和他的牺牲被政府隐瞒，担心真相会引发恐慌和舆论压力。",
          "政府强迫你们一家协助保守秘密。",
        ],
      },
      background: "./IntroImages/scene2.2.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "You have always missed your father.",
          "Whenever the longing overwhelms you, you go to his study, filled with his presence and memories.",
          "The study is not only his workspace but also a bond between you.",
          "One day, while organizing the study, you found a key to the old garage, reminding you of his favorite old car and many shared memories.",
        ],
        zh: [
          "你一直怀念父亲。",
          "每当思念涌上心头，你会来到父亲的书房，这里充满了他的气息和回忆。",
          "书房不仅是他的工作空间，也是你们连接的纽带。",
          "一天，你在整理书房时，意外发现了一把通往旧车库的钥匙，让你想起了父亲最爱的那辆老车，以及你们许多共同的记忆。",
        ],
      },
      background: "./IntroImages/scene3.1.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "Using the key, you returned to your old home and opened the long-sealed garage.",
          "As the door creaked open, an old car came into view, covered in a layer of dust.",
          "This car holds countless childhood memories and is a precious witness to the time you spent with your father.",
        ],
        zh: [
          "利用这把钥匙，你回到了故居，打开了尘封已久的车库。",
          "随着门吱呀一声打开，一辆老式汽车映入眼帘，覆盖着一层尘土。",
          "这辆车承载着你童年的无数记忆，是你与父亲共度时光的珍贵见证。",
        ],
      },
      background: "./IntroImages/scene3.2-2.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "You used to drive together, exploring nature, with your father patiently explaining the science along the way.",
          "Whether on mountain roads or by serene lakes, he made you appreciate the world's beauty and vastness.",
          "Those warm afternoons, filled with singing and chatting, made the car a special bond between you, capturing precious times and a deep father-son connection.",
        ],
        zh: [
          "你们曾一起驾车探索大自然，父亲耐心讲解沿途的科学知识。",
          "无论是山间公路还是湖边宁静，他让你感受到世界的美丽和广阔。",
          "那些温馨的下午，你们在车内唱歌、聊天，充满欢声笑语。",
          "这辆车成了你们之间的特殊联结，记录着珍贵时光和深厚的父子情感。",
        ],
      },
      background: "./IntroImages/scene3.3-2.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "You opened the car door, hoping to relive those beautiful old days.",
          "However, when you tried to start the car, you found the gas tank empty.",
          "The car that once carried countless joyful moments now couldn't start.",
          "This reality made you deeply feel the changes since those carefree days.",
        ],
        zh: [
          "你打开了车门，想要重温那些美好的旧日时光。",
          "然而，当你试图启动汽车时，却发现油箱已经空了。",
          "这辆曾经承载无数欢乐时光的车，现在却无法启动。",
          "这个现实让你深刻感受到自那些无忧无虑的日子以来所发生的变化。",
        ],
      },
      background: "./IntroImages/scene3.4.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "You felt deep longing and sadness, wanting to start the old car as if it could bring back those good times.",
          "Suddenly, you remembered the time machine recently developed in the lab.",
          "Although it could only take you back ten years, it might be your chance to get fuel and stop the development of T energy, seeking justice for your father's death.",
          "Taking a deep breath, you prepared for the adventure.",
        ],
        zh: [
          "你感到深深的怀念和伤感，想启动这辆旧车，仿佛这样能把美好时光带回来。",
          "突然，你想起了实验室最近研发的时光机器。",
          "虽然它只能回到十年前，但这或许是个机会，让你回到过去获得石油，并阻止T能源的开发，为父亲讨回公道。",
          "你深吸一口气，准备踏上冒险。",
        ],
      },
      background: "./IntroImages/scene4.1.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "You have obtained:",
          "A mysterious key",
          "An old photograph",
          "A cryptic note",
        ],
        zh: ["你获得了:", "一把神秘的钥匙", "一张旧照片", "一张神秘的便条"],
      },
      background: "./IntroImages/black_screen.png", // 确保你有一个黑色背景图片
      textStyle: "futuristic",
      isBlackScreen: true, // 新添加的属性来标识黑屏场景
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

const backMainButton = document.getElementById("back-main");
backMainButton.addEventListener("click", () => {
  window.location.href = "../Main.html"; // 确保这是正确的主页面路径
});
