let bgm;
let currentNpcName = "Bob"; // NPC 名字
bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "./Music/Save the World.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; // 设置音量为 50%

let sessionID = "-1"; // 会话 ID，用于区分不同的游戏进度
let conversationCount = 0; // 对话次数计数器

document.addEventListener("DOMContentLoaded", () => {
  // Check for special conditions
  if (checkSpecialCondition()) {
    startNewSceneDialogue();
    return;
  }

  const characterImage = document.getElementById("character-image");
  const backgroundImage = "./images/Media.png"; // 设置一个默认的背景图

  // 设置背景图
  document.body.style.backgroundImage = `url('${backgroundImage}')`;
  // 设置角色图片
  characterImage.src = "./npc/Bob.png"; // 设置一个默认的角色图片
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

const scenes = [
  {
    text: {
      en: [
        "Oh, so you're Kane's son. That makes sense now. If I were you, I'd head to the Guild Hall and find Bob.",
        "They're having a heated debate about K, and your arrival could make things a lot more interesting. I will support you.",
      ],
      zh: [
        "哦,原来你是凯恩的儿子,这就有道理了。如果我是你,我会去工会大楼找鲍勃。",
        "他们正为K的事吵得不可开交,你的出现可能会让事情变得更有趣。我会支持你的。",
      ],
    },
    background: "./images/Media.png",
    textStyle: "futuristic",
    character: "./npc/Lisa.png",
  },
];

function startGame() {
  const textContainer = document.getElementById("text-container");
  const nextButton = document.getElementById("next-text-button");
  const prevButton = document.getElementById("prev-text-button");

  let currentScene = 0;
  let currentTextIndex = 0;

  const displayText = () => {
    textContainer.innerHTML = ""; // Clear previous text

    const scene = scenes[currentScene];
    const textLines = scene.text[currentLanguage];

    if (!textLines) {
      console.error(`Text lines not found for language: ${currentLanguage}`);
      return;
    }

    const currentLine = textLines[currentTextIndex];
    if (!currentLine) {
      console.error(`Text line not found at index: ${currentTextIndex}`);
      return;
    }

    const paragraph = document.createElement("p");
    paragraph.innerHTML = currentLine; // 使用 innerHTML 而不是 textContent
    textContainer.appendChild(paragraph);

    textContainer.className = "";
    textContainer.classList.add(scene.textStyle);

    // 检查并添加高亮物品到背包
    const highlights = paragraph.querySelectorAll(".highlight");
    highlights.forEach((item) => {
      addToInventory(item.dataset.item, item.dataset.image);
    });

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

const intent =
  "the user has expressed or implied the intent to the truth of Kane's Father's death";

// 检查用户是否表达了特定的意图
async function Check(intent, message) {
  try {
    const prompt = `Analyze the following user message in the context of a conversation about family relationships:

    User Message: "${message}"
    
    Determine if the user has expressed or implied the following intent, even if it's subtle or indirect:
    Intent: "${intent}"
    
    Consider the following:
    1. Direct statements about the relationship
    2. Indirect references or hints
    3. Questions that might imply knowledge of the relationship
    4. Any context clues that suggest the user is aware of this relationship
    
    If the intent is expressed or strongly implied in any way, respond with "true".
    If there's no clear indication of the intent, respond with "false".
    
    Respond ONLY with "true" or "false", no other words or explanations.`;

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

    const data = await response.json();
    console.log("Check Response:", data);
    // 解析玩家的意图是不是符合预期
    const intentExpressedValue = data.data === "true";

    if (intentExpressedValue) {
      intentExpressed[currentNpcName] = true; // 动态设置属性
      localStorage.setItem("intentExpressed", JSON.stringify(intentExpressed));
    }

    return intentExpressedValue;
  } catch (error) {
    console.error("Error in Check:", error);
    return false;
  }
}

// 向 NPC 发送消息并获取回复
async function sendMessageToNPC(message) {
  bgm.play(); // 播放背景音乐
  conversationCount++; // 增加对话次数

  // 生成对话提示
  console.log("Sending message to NPC:", message);
  const textContainer = document.getElementById("text-container");

  textContainer.innerHTML += `<p class="user-message">You: ${message}</p>`;

  // 检查对话次数是否达到五次且 `usedItem` 是否未使用
  if (conversationCount >= 5 && !usedItems[currentNpcName]) {
    const fixedReply = {
      en: "Enough, you are talking something never be good news for the public. Maybe you should go right now. See you.",
      zh: "够了,你说的事情对公众来说从来都不是好消息。也许你现在应该走了。再见。",
    };
    const textContainer = document.getElementById("text-container");
    textContainer.innerHTML += `<p class="npc-message">Lisa: ${
      currentLanguage === "en" ? fixedReply.en : fixedReply.zh
    }</p>`;
    return;
  }

  // 检查用户是否表达了特定的意图, 如果没有，继续检查
  if (!intentExpressed[currentNpcName]) {
    // 确保检查的是当前 NPC 的意图
    intentExpressed[currentNpcName] = await Check(intent, message);
    console.log("Intent expressed:", intentExpressed);
  }

  const requestData = {
    prompt: message,
    charID: "", // bob's id
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

    // Check for special conditions
    if (checkSpecialCondition()) {
      startSceneDialogue();
      startGame();
      return;
    }

    if (currentLanguage === "en") {
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

function checkSpecialCondition() {
  console.log(
    "Checking special condition:",
    intentExpressed.Lisa, // check if the intent is expressed
    usedItems[currentNpcName]
  );
  // Check if the intent is expressed and the item is used
  return intentExpressed.Lisa && usedItems[currentNpcName];
}

function startSceneDialogue() {
  // show the next and prev buttons
  document.getElementById("next-text-button").style.display = "inline-block";
  document.getElementById("prev-text-button").style.display = "inline-block";
  // disable the user input container
  document.getElementById("user-input-container").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const backMainButton = document.getElementById("back-main");
  backMainButton.addEventListener("click", () => {
    window.location.href = "../Map/map.html"; // 确保这是正确的主页面路径
  });
});

// Export functions for testing
window.checkSpecialCondition = checkSpecialCondition;