let currentScene = 0;
let currentTextIndex = 0;
bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "./Music/Save the World.mp3"; // 设置统一的背景音乐
bgm.volume = 0.5; // 设置音量为 50%

document.addEventListener("DOMContentLoaded", () => {
  console.log("Intro DOM is loaded");
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
          "在这个世界中，环保和可持续发展成为核心议题。",
          "气候工程技术帮助人类控制气候变化，城市中到处都是绿色空间和生态建筑。",
          "国际合作也达到了前所未有的高度。",
          "联合国在制定科技伦理和环境保护标准方面扮演着重要角色。",
          "在这个充满希望的未来，地球正朝着一个更加美好的方向前进。",
        ],
      },
      background: "./IntroImages/scene1.1-1.png",
      textStyle: "futuristic",
      // character: "./npc/character1.png",
    },
    {
      text: {
        en: [
          "The discovery and development of a sustainable energy source called K have fundamentally transformed human society.",
          "As a clean energy source from Mars, K energy effectively resolved Earth's energy crisis and significantly reduced dependence on traditional polluting energy sources.",
          "Its high efficiency and environmental friendliness quickly made it the primary global energy source, driving progress across various sectors and bringing unprecedented prosperity and advancement to humanity.",
        ],
        zh: [
          "一种叫K的可持续能源的发现和开发彻底改变了人类社会。",
          "作为一种来自火星的清洁能源,K能源不仅有效解决了地球的能源危机,还显著减少了对传统污染性能源的依赖。",
          "它的高效能和环保特性使其迅速成为全球主要能源来源，推动了各个领域的发展，为人类社会带来了前所未有的繁荣与进步。",
        ],
      },
      background: "./IntroImages/scene1.2.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "In the year 2056, KI is a promising young scientist, only 26 years old.",
          "He has made a name for himself in the scientific community, focusing on quantum physics and the study of time machines.",
          "KI's passion for science and exploration stems from his father's teachings.",
          "His father, an astronaut scientist, instilled in him a deep curiosity and love for the unknown universe from a young age.",
        ],
        zh: [
          "2056年的地球上,KI是一位年轻有为的科学家,年仅26岁。",
          "他在科学界崭露头角，专注于量子物理和时间机器的研究。",
          "KI对科学的热情和探索精神源于他父亲的教导。",
          "他的父亲是一位宇宙科学家,从小就向KI灌输对未知宇宙的好奇和探索的热情。",
        ],
      },
      background: "./IntroImages/scene1.3-1.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "KI's father was not only a brilliant scientist but also led the early exploration and research into the clean energy source known as K on Mars.",
          "This mysterious energy had the potential to revolutionize Earth's energy landscape, offering a sustainable solution.",
          "KI's father's pioneering work unveiled the initial secrets of K energy, making him a legend in the scientific community.",
        ],
        zh: [
          "KI的父亲不仅是一位杰出的科学家,还主导了人类对火星上清洁能源K的早期探索和研究。",
          "这种神秘能源有潜力彻底改变地球的能源结构，为人类提供可持续的能源解决方案。",
          "KI的父亲带领团队揭开了K能源的初步奥秘,这一壮举让他成为科学界的传奇人物。",
        ],
      },
      background: "./IntroImages/scene2.1.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "Tragically, in 2036, during a mission to Mars to further study K energy, KI's father died.",
          "The mission, initially full of hope, aimed to fully understand the potential of K energy.",
          "However, the mission's failure and his father's death were kept secret by the government, fearing public panic and backlash.",
          "They forced KI's family to keep the truth hidden.",
        ],
        zh: [
          "然而,在2036年一次深入火星的任务中,KI的父亲不幸殉职。",
          "那次任务本充满希望,目标是深入了解K能源的全部潜力。",
          "但任务的失败和父亲的牺牲却被政府所隐瞒，担心真相曝光会引发公众恐慌和舆论压力。",
          "他们强迫KI一家保守这个秘密。",
        ],
      },
      background: "./IntroImages/scene2.2.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "KI always harbors deep memories of his father. Whenever he feels nostalgic, he often visits his father's study, a room filled with cherished memories.",
          "In this space, KI can almost feel his father's presence, as if he is still there reading books and jotting down research notes.",
          "This study is not only where his father worked but also a connection to KI's heart, holding countless warm and unforgettable memories.",
          "One day, while sorting through his father's study, KI unexpectedly discovered a key to the old garage.",
          "This key reminded him of his father's beloved old car, which held many shared memories.",
        ],
        zh: [
          "KI一直对父亲怀有深深的怀念。每当思念涌上心头,他常常来到父亲的书房，这个充满回忆的地方。",
          "KI仿佛还能感受到父亲的存在,似乎他依然在那里阅读书籍和记录研究笔记。",
          "这间书房不仅是KI父亲的工作空间,更是KI心中与父亲连接的纽带,承载着无数温暖而难忘的回忆。",
          "一天,KI在整理父亲的书房时,意外发现了一把通往旧车库的钥匙。",
          "这把钥匙让他想起了父亲最爱的那辆老车，承载着他们许多共同的记忆。",
        ],
      },
      background: "./IntroImages/scene3.1.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "Using the key, KI returned to his old family home and unlocked the long-forgotten garage.",
          "As the doors creaked open, an old-fashioned car came into view, covered in dust.",
          "This car, a cherished piece of his childhood, held countless memories of times spent with his father.",
        ],
        zh: [
          "利用这把钥匙,KI回到了他的故居,打开了尘封已久的车库。",
          "随着门吱呀一声打开，一辆老式的汽车映入眼帘，覆盖着一层尘土。",
          "这辆车承载着他童年的无数记忆，是他与父亲共度时光的珍贵见证。",
        ],
      },
      background: "./IntroImages/scene3.2-2.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "They had spent many wonderful moments together, driving to various places and exploring the beauty of nature.",
          "His father always patiently explained the scientific wonders of the world as they traveled.",
          "Whether on winding mountain roads or by the calm lakeside, his father showed KI the vastness and beauty of the world.",
          "On those many warm afternoons, they sang, talked, and laughed together, filling the car with joy.",
          "This car became a special bond between them, holding the precious moments and the deep connection they shared as father and son.",
        ],
        zh: [
          "他们曾经一起驾车去过很多地方，探索大自然的美景，父亲总是耐心地给他讲解沿途的科学知识。",
          "无论是山间的公路还是湖边的宁静,父亲总是让KI感受到世界的广阔和美丽。",
          "在那些无数个温馨的下午，他们一起唱歌、聊天，车内充满了欢声笑语。",
          "这辆车成了他们之间的一个特殊联结，记载着那些珍贵的时光和父子间深厚的感情。",
        ],
      },
      background: "./IntroImages/scene3.3-2.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "KI opened the car door, hoping to relive the beautiful memories of the past. However, as he tried to start the car, he discovered that the fuel tank was empty.",
          "The car, which once carried so many joyous moments, couldn't be started. The reality of the situation hit him hard, reminding him of the changes that had occurred since those carefree days with his father.",
        ],
        zh: [
          "KI打开了车门,想要重温那些美好的旧日时光。然而,当他试图启动汽车时，却发现油箱已经空了。",
          "这辆曾经承载了无数欢乐时光的车，现在却无法启动。这个现实让他深刻地感受到自从那些无忧无虑的日子以来所发生的变化。",
        ],
      },
      background: "./IntroImages/scene3.4.png",
      textStyle: "futuristic",
    },
    {
      text: {
        en: [
          "KI felt a deep sense of longing and sadness; he missed his father so much. He wanted to start the old car, hoping that doing so might somehow bring back those cherished moments from the past.",
          "Suddenly, he remembered the recently developed and still classified time machine at his lab. Although it could only go back ten years, it might be his chance to return to the past, obtain gasoline, and possibly eliminate the source of his father's demise—'K.' This could be a way to avenge his father's death.",
          "He took a deep breath, preparing to embark on the adventure.",
        ],
        zh: [
          "KI感到深深的怀念和伤感,他太想念父亲了,想要启动这辆旧车，仿佛这样就可以把那些美好的旧时光带回来。",
          "突然,他想起了实验室最近研发的、仍在保密阶段的时光机器。虽然这台时光机器只能回到十年前,但这也许是一个机会,让他能够回到过去,重新获得石油,同时找到机会阻止能源K的开发,为父亲的死讨回公道。",
          "他深吸一口气，准备踏上冒险。",
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
        zh: ["你获得了：", "一把神秘的钥匙", "一张旧照片", "一张神秘的便条"],
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
