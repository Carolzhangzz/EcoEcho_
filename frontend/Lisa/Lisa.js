let gameProgress = {
  talkedToLisa: false,
  talkedToNPC2: false,
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("Scene Lisa loaded");

  // 从 localStorage 加载游戏进度
  const savedProgress = JSON.parse(localStorage.getItem("gameProgress"));
  if (savedProgress) {
    gameProgress = savedProgress;
    console.log("Loaded game progress from localStorage:", gameProgress);
  } else {
    console.log("No saved game progress found in localStorage.");
  }

  if (document.querySelector(".game-container")) {
    console.log("Game container found");
    bgm = document.getElementById("bgm");
    bgm.loop = true; // Let the music loop
    bgm.src = "./Music/Save the World.mp3"; // 设置统一的背景音乐
    bgm.volume = 0.1; // 设置音量为 50%
  } else {
    console.log("Game container not found");
  }

  const characterImage = document.getElementById("character-image");
  const backgroundImage = "./images/Media.png"; // 设置一个默认的背景图

  // 设置背景图
  document.body.style.backgroundImage = `url('${backgroundImage}')`;
  // 设置角色图片
  characterImage.src = "./npc/Lisa.png"; // 设置一个默认的角色图片
  characterImage.style.display = "block";

  const nextButton = document.getElementById("next-text-button");
  const prevButton = document.getElementById("prev-text-button");

  // 隐藏 prev 和 next 按钮
  nextButton.style.display = "none";
  prevButton.style.display = "none";

  const userInput = document.getElementById("user-input");
  const sendMessageButton = document.getElementById("send-message");

  sendMessageButton.addEventListener("click", () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
      sendMessageToNPC(userMessage);

      userInput.value = "";
    }
  });

  userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendMessageButton.click();
    }
  });
});

let currentLanguage = "en"; // 默认语言为英语
let sessionID = "-1"; // 会话 ID，用于区分不同的游戏进度
let npcInteractionComplete = false; // 标志 NPC 互动是否完成

const scenes = [
  {
    text: {
      en: [
        "Welcome to the first scene. You find yourself in a <span class='highlight' data-item='old key' data-image='../items/old-key.png'>dimly lit room</span>.",
      ],
      zh: [
        "欢迎来到第一个场景。你发现自己身处一个<span class='highlight' data-item='old key' data-image='../items/old-key.png'>昏暗的房间</span>。",
      ],
    },
    background: "./images/Media.png",
    textStyle: "futuristic",
    character: "./npc/Lisa.png",
  },
  {
    text: {
      en: [
        "The air is thick with dust, and you can barely make out the shapes of old furniture.",
      ],
      zh: ["空气中充满了灰尘，你几乎看不清旧家具的轮廓。"],
    },
    background: "./images/Media.png",
    textStyle: "futuristic",
    character: "./npc/Lisa.png",
  },
];

function startGame() {
  console.log("Starting game");

  const textContainer = document.getElementById("text-container");
  const nextButton = document.getElementById("next-text-button");
  const prevButton = document.getElementById("prev-text-button");

  let currentScene = 0;
  let currentTextIndex = 0;

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

    // Update character image
    const characterImage = document.getElementById("character-image");
    if (scene.character) {
      characterImage.src = scene.character;
      characterImage.style.display = "block";
    } else {
      characterImage.style.display = "none";
    }

    bgm.play();

    // 检查是否是最后一个场景的最后一行文本
    if (
      currentScene === scenes.length - 1 &&
      currentTextIndex === scene.text[currentLanguage].length - 1
    ) {
      gameProgress.talkedToLisa = true;
      console.log("All scenes completed, talkedToLisa set to true.");
      localStorage.setItem("gameProgress", JSON.stringify(gameProgress)); // 保存到 localStorage
    }
    
  };

  nextButton.addEventListener("click", () => {
    currentTextIndex++;
    if (currentTextIndex >= scenes[currentScene].text[currentLanguage].length) {
      currentScene++;
      if (currentScene < scenes.length) {
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
      if (currentScene >= 0) {
        currentTextIndex =
          scenes[currentScene].text[currentLanguage].length - 1;
      }
    }
    updateScene();
  });

  // Initial scene setup
  updateScene();
}

// 向 NPC 发送消息并获取回复

// 向 NPC 发送消息并获取回复
async function sendMessageToNPC(message) {
  bgm.play(); // 播放背景音乐
  // 生成对话提示
  console.log("Sending message to NPC:", message);
  const textContainer = document.getElementById("text-container");

  textContainer.innerHTML += `<p class="user-message">You: ${message}</p>`;

  const requestData = {
    prompt: message,
    charID: "4d2ef564-4b89-11ef-ad21-42010a7be011", // 替换为你的角色 ID
    sessionID: sessionID,
    voiceResponse: true,
  };

  try {
    const response = await fetch("/api/convai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("NPC Response:", data);

    // Check if the session ID has been updated
    if (data.sessionID) {
      sessionID = data.sessionID;
    }

    let npcReply = data.text;
    let audioReply = data.audio; // 获取音频回复

    // Check the current language and generate response accordingly
    const languageToggle = document.getElementById("language-toggle");
    let currentLanguage = "EN"; // Default to English

    if (languageToggle) {
      currentLanguage = languageToggle.textContent.trim();
    } else {
      console.warn("Language toggle button not found. Defaulting to English.");
    }

    // Check for special conditions
    if (checkSpecialCondition(npcReply, message)) {
      startSceneDialogue();
      startGame();
      return;
    }

    if (currentLanguage === "EN") {
      displayNPCReply(npcReply, audioReply);
    } else {
      const translatedReply = await generateResponse(npcReply);
      console.log("Translated Reply:", translatedReply);
      displayNPCReply(translatedReply.data, audioReply);
    }
  } catch (error) {
    console.error("Error:", error);
    textContainer.innerHTML += `<p class="error-message">Error: Unable to get NPC response</p>`;
  }
}

// 修改 generateResponse 函数
//把 npc 的回复拿到，发给 Lamma 不同的语言版本，然后显示在页面上
async function generateResponse(npcReply) {
  try {
    const prompt = `Translate the following English text to Simplified Chinese. Ensure the translation is natural, 
    maintains the original meaning and tone, and conveys any humor or nuances appropriately, 
    "${npcReply}" Remember, only the translate words, no other words!!;`;

    console.log("Using translation prompt:", prompt);

    const response = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const translatedReply = await response.json();
    console.log("Received translated reply:", translatedReply);
    return translatedReply;
  } catch (error) {
    console.error("Error in generateResponse:", error);
    return "Error: " + error.message;
  }
}

function displayNPCReply(reply, audioReply) {
  const textContainer = document.getElementById("text-container");
  let index = 0;
  const replyElement = document.createElement("p");
  replyElement.className = "npc-message";
  replyElement.textContent = "Lisa: ";
  textContainer.appendChild(replyElement);

  // Play the audio if it exists
  if (audioReply) {
    const audioElement = new Audio(`data:audio/wav;base64,${audioReply}`);
    audioElement.play();
  }

  const textInterval = setInterval(() => {
    if (index < reply.length) {
      replyElement.textContent += reply[index];
      index++;
      textContainer.scrollTop = textContainer.scrollHeight;
    } else {
      clearInterval(textInterval);
    }
  }, 50);
}

function checkSpecialCondition(npcReply, userMessage) {
  // 检查特定条件，例如用户消息包含特定关键词
  return userMessage.includes("nihao") || npcReply.includes("start the scene");
}

function startSceneDialogue() {
  // 显示 prev 和 next 按钮
  document.getElementById("next-text-button").style.display = "inline-block";
  document.getElementById("prev-text-button").style.display = "inline-block";
  // 禁用用户输入
  document.getElementById("user-input-container").style.display = "none";
  startGame();
}

document.addEventListener("DOMContentLoaded", () => {
  const backMainButton = document.getElementById("back-main");
  backMainButton.addEventListener("click", () => {
    window.location.href = "../Map/map.html"; // 确保这是正确的主页面路径
  });
});
