let bgm;
let currentNpcName = "Guard"; // NPC 名字
bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "./Music/Save the World.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; //  音量设置为 10%
let sessionID = "-1"; // 会话 ID，用于区分不同的游戏进度
let backupReplyIndex = 0; // 备用回复的索引

document.addEventListener("DOMContentLoaded", () => {
  const characterImage = document.getElementById("character-image");
  const backgroundImage = "./images/Union.png";
  const nextButton = document.getElementById("next-text-button");
  const prevButton = document.getElementById("prev-text-button");
  const userInputContainer = document.getElementById("user-input-container");
 
  // 设置背景图和角色图片
  document.body.style.backgroundImage = `url('${backgroundImage}')`;
  characterImage.src = "./npc/Guard.png";
  characterImage.style.display = "block";

  if (!gameProgress.talkedToLisa) {
    // 如果没有与Lisa对话，显示初始对话
    startFirstDialogue();
  } else {
    startNewSceneDialogue();
  }

  nextButton.style.display = "inline-block";
  prevButton.style.display = "none";
  userInputContainer.style.display = "none";

  const userInput = document.getElementById("user-input");
  const sendMessageButton = document.getElementById("send-message");

  sendMessageButton.addEventListener("click", () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
      handleMessage(userMessage);
      userInput.value = "";
    }
  });

  userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendMessageButton.click();
    }
  });

  // //判断是否这个对话已经结束 如果结束了，就显示 new scene 的对话
  // if (allScenesCompleted.Guard) {
  //   startNewSceneDialogue();
  // }

  // 处理 back to the map 按钮点击事件
  const backMainButton = document.getElementById("back-main");
  backMainButton.addEventListener("click", () => {
    if (allScenesCompleted.Guard && newSceneCompleted.Guard === null) {
      // 如果所有对话都结束了，但是新对话还没有结束，说明用户直接点击了 back to main 而没有去Bob那里
      // 跳转到Bob
      window.location.href = "../Bob/Bob.html";
    } else {
      window.location.href = "../Map/map.html"; // 跳转到默认地图页面
    }
  });
});

const scenes = [
  {
    text: {
      en: [
        "Oh, it's the friend of the reporter Lisa.",
        " Mr. Bob is inside the building; you can go right in.",
      ],
      zh: ["原来是Lisa记者的朋友", "Bob先生正在大楼里, 您直接进去就行。"],
    },
    background: "./images/Union.png",
    textStyle: "futuristic",
    character: "./npc/Guard.png",
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
      //设定 talkToGuard 为 true
      gameProgress.talkedToGuard = true;
      updateAllScenesCompleted("Guard", true); // 更新Security的allScenesCompleted状态
      localStorage.setItem("gameProgress", JSON.stringify(gameProgress)); // 保存到 localStorage
      // 修改这里的逻辑
      setTimeout(() => {
        //直接跳转到Bob页面
        window.location.href = "../Bob/Bob.html";
      }, 2000);
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
  "the user has expressed the name Bob or the user is looking for Bob"; // 意图描述

// 检查用户是否表达了特定的意图
async function Check(intent, message) {
  const keywords = ["Bob", "鲍勃"];

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

    // // 模拟 ConvAI 接口失败，强制抛出错误
    // throw new Error("Simulated Intent API failure");

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
      // 重置对话计数
      resetConversationCount();
    }

    return intentExpressedValue;
  } catch (error) {
    console.error("Error in Check:", error);

    // 检查用户输入是否包含关键字
    const containsKeyword = keywords.some((keyword) =>
      message.includes(keyword)
    );

    if (containsKeyword) {
      intentExpressed[currentNpcName] = true; // 动态设置属性
      localStorage.setItem("intentExpressed", JSON.stringify(intentExpressed));
      return true;
    }

    return false;
  }
}

async function handleMessage(message) {
  bgm.play(); // 播放背景音乐

  // 生成对话提示
  console.log("Sending message to NPC:", message);
  const textContainer = document.getElementById("text-container");
  textContainer.innerHTML += `<p class="user-message">You: ${message}</p>`;

  // 检查用户是否表达了特定的意图
  if (!intentExpressed[currentNpcName]) {
    intentExpressed[currentNpcName] = await Check(intent, message);
    console.log("Intent expressed:", intentExpressed);
  }

  // Check for special conditions before sending the message
  if (checkSpecialCondition()) {
    startSceneDialogue();
    startGame();
    return;
  }

  // Check if the auto-reply should be triggered before sending the message
  if (shouldTriggerAutoReply(currentNpcName)) {
    const fixedReply = getFixedReply();
    textContainer.innerHTML += `<p class="npc-message">Security: ${
      currentLanguage === "en" ? fixedReply.en : fixedReply.zh
    }</p>`;
    return;
  }

  try {
    await sendMessageToNPC(message);
  } catch (error) {
    console.error("Error in sendMessageToNPC:", error);
    await generateBackupResponse(message);
  }
}

// 向 NPC 发送消息并获取回复
async function sendMessageToNPC(message) {
  const requestData = {
    prompt: message,
    charID: "4d2ef564-4b89-11ef-ad21-42010a7be011", // 替换为你的角色 ID
    sessionID: sessionID,
    voiceResponse: true,
  };

  // // 模拟 ConvAI 接口失败，强制抛出错误
  // throw new Error("Simulated ConvAI API failure");

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

  // 例如，在成功发送消息后
  updateConversationCount(
    currentNpcName,
    conversationCount[currentNpcName] + 1
  ); // 只有在成功发送消息后才会增加对话次数
  localStorage.setItem("conversationCount", JSON.stringify(conversationCount)); // 保存对话次数到 localStorage

  const data = await response.json();
  console.log("NPC Response:", data);

  // Check if the session ID has been updated
  if (data.sessionID) {
    sessionID = data.sessionID;
  }

  let npcReply = data.text;
  let audioReply = data.audio; // 获取音频回复

  if (currentLanguage === "en") {
    displayNPCReply(npcReply, audioReply);
  } else {
    const translatedReply = await generateResponse(npcReply);
    console.log("Translated Reply:", translatedReply);
    displayNPCReply(translatedReply.data, audioReply);
  }
}

// 调用 generate 接口获取 NPC 的回复
async function generateBackupResponse(message) {
  const prompt = getNPCSpecificPrompt(currentNpcName, message);
  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    //  模拟 第二个 NPC 调用 接口失败，强制抛出错误
    //  throw new Error("Simulated Second NPC API failure");

    if (!response.ok) {
      throw new Error("Network response was not ok for backup response");
    }

    const data = await response.json();
    console.log("Backup NPC Response:", data);

    let npcReply = data.data;

    // 例如，在成功发送消息后
    updateConversationCount(
      currentNpcName,
      conversationCount[currentNpcName] + 1
    );

    if (currentLanguage === "en") {
      displayNPCReply(npcReply);
    } else {
      const translatedReply = await generateResponse(npcReply);
      console.log("Translated Backup Reply:", translatedReply);
      displayNPCReply(translatedReply.data);
    }
  } catch (error) {
    console.error("Error in generateBackupResponse:", error);
    const fixedReply = backupFixedReply();
    const textContainer = document.getElementById("text-container");
    textContainer.innerHTML += `<p class="npc-message"Security: ${
      currentLanguage === "en" ? fixedReply.en : fixedReply.zh
    }</p>`;
    //这个时候也得累积对话次数
    updateConversationCount(
      currentNpcName,
      conversationCount[currentNpcName] + 1
    );
  }
}

function getNPCSpecificPrompt(npcName, userMessage) {
  switch (npcName) {
    case "Guard":
      return `You are a Security Guard at the entrance of an important building. You are polite but firm. Your main job is to ensure only authorized people enter. Respond to the user's message in a way that fits your role. User Message: "${userMessage}"`;
    // Add more cases for other NPCs as needed
    default:
      return `You are an NPC. Respond to the user's message appropriately. User Message: "${userMessage}"`;
  }
}

function displayNPCReply(reply, audioReply) {
  const textContainer = document.getElementById("text-container");
  let index = 0;
  const replyElement = document.createElement("p");
  replyElement.className = "npc-message";
  replyElement.textContent = `${currentNpcName}: `;
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
    intentExpressed.Guard,
    usedItems[currentNpcName]
  );
  // Check if the intent is expressed (looking for Bob) and the item (possibly an ID) is used
  return intentExpressed.Guard && usedItems[currentNpcName];
}

function startSceneDialogue() {
  // show the next and prev buttons
  document.getElementById("next-text-button").style.display = "inline-block";
  document.getElementById("prev-text-button").style.display = "inline-block";
  // disable the user input container
  document.getElementById("user-input-container").style.display = "none";
}

// 函数：添加物品到背包
function addToInventory(item, image) {
  // 获取背包容器
  const inventoryContainer = document.getElementById("inventory-container");
  // 创建新的物品元素
  const newItem = document.createElement("img");
  newItem.src = image;
  newItem.alt = item;
  newItem.className = "inventory-item";
  // 将物品添加到背包
  inventoryContainer.appendChild(newItem);
}

// 两个接口都失败时，显示固定的回复
const backupReplies = [
  {
    en: "Sorry, before I let you in, you need to tell me the name of the person you're here to visit.",
    zh: "不好意思，在我让你进去之前，你需要先告诉我你要拜访的人的姓名。",
  },
  {
    en: "Alright, please show your identification.",
    zh: "好的，请出示你的身份证明。", // 这里的回复是随机的，可以根据实际情况修改
  },
];

function backupFixedReply() {
  const reply = backupReplies[backupReplyIndex];
  backupReplyIndex = (backupReplyIndex + 1) % backupReplies.length; // 循环选择备用回复
  return reply;
}

// 自定义自动回复逻辑，现在次数是用完才会出现自动回复，成功调用才会增加对话次数
function getFixedReply() {
  if (
    conversationCount[currentNpcName] >= 2 &&
    !usedItems[currentNpcName] &&
    !intentExpressed[currentNpcName]
  ) {
    return {
      en: "Sorry, I can't let unauthorized people in.",
      zh: "不好意思，我不能让闲杂人等进去。",
    };
  }
  if (
    conversationCount[currentNpcName] >= 2 &&
    intentExpressed[currentNpcName] &&
    !usedItems[currentNpcName]
  ) {
    return {
      en: "There are many people who want to meet the guild president every day. How can I verify your identity?",
      zh: "每天都有很多人想要见工会主席，我该如何验证你的身份呢？",
    };
  }
  if (
    conversationCount[currentNpcName] >= 2 &&
    !intentExpressed[currentNpcName] &&
    usedItems[currentNpcName]
  ) {
    return {
      en: "My journalist friend, if you don't have a specific person you're looking for, I can't let you in.",
      zh: "记者朋友，如果你没有要找的具体人，我是不能让你进去的。",
    };
  }
  return null;
}

// Export functions for testing
window.checkSpecialCondition = checkSpecialCondition;
window.addToInventory = addToInventory;
