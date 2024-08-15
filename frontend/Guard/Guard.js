let bgm;
let currentNpcName = "Guard"; // NPC 名字
bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "../Music/NPC_talk.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; //  音量设置为 10%
let backupReplyIndex = 0; // 备用回复的索引

function displayInitialMessage() {
  const initialMessage = {
    en: "Stop right there. This is a restricted area. State your business or leave immediately.",
    zh: "站住。这里是禁区。说明你的来意，否则请立即离开。",
  };

  const message =
    currentLanguage === "en" ? initialMessage.en : initialMessage.zh;
  displayNPCReply(message);
}

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

  // // test
  // gameProgress.talkedToLisa=true;
  // gameProgress.talkedToGuard=false;
  // usedItems.Guard = true;
  //  //如果说 ki 还没签字的话，也不能和 lisa 交谈
  //  if (signatures["Ki"] === null) {
  //   startFirstDialogue();
  // }
  if (!gameProgress.talkedToLisa || signatures["Lisa"] === null) {
    // 如果没有与Lisa对话，显示初始对话
    startFirstDialogue();
  } else if (gameProgress.talkedToLisa && gameProgress.talkedToGuard) {
    // 如果已经与Lisa和Guard对话，显示新场景对话
    startNewSceneDialogue();
  } else if (gameProgress.talkedToLisa && !gameProgress.talkedToGuard) {
    displayInitialMessage();
  }

  //其余情况就是直接显示Guard的对话
  nextButton.style.display = "inline-block";
  prevButton.style.display = "none";

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

  // 处理 back to the map 按钮点击事件
  const backMainButton = document.getElementById("back-main");
  backMainButton.addEventListener("click", () => {
    window.location.href = "../Emilia/Emilia.html"; // 跳转到默认地图页面
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
      //修改这里的逻辑
      setTimeout(() => {
        //直接跳转到Bob页面
        window.location.href = "../Bob/Bob.html";
      }, 2000);
      // document.getElementById("back-main").disabled = false;
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
  "the user has expressed the name Bob or the user is looking for Bob or 鲍勃"; // 意图描述

// 检查用户是否表达了特定的意图
async function Check(intent, message) {
  const keywords = ["Bob", "鲍勃"];

  try {
    const prompt = `Analyze the following user message in the context of a conversation:

    User Message: "${message}"
    
    Determine if the user has expressed or implied the following intent, even if it's subtle or indirect:
    Intent: "${intent}"
    
    If the intent is expressed or strongly implied in any way, respond with "true".
    If there's no clear indication of the intent, respond with "false".
    
    Respond ONLY with "true" or "false", no other words or explanations.`;

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    // 模拟 Intent 接口失败，强制抛出错误
    //throw new Error("Simulated Intent API failure");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Check Response:", data);
    // 解析玩家的意图是不是符合预期
    const intentExpressedValue = data.data === "true";

    //如果符合预期，就设置intentExpressed为true 并且重置对话次数
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
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    if (containsKeyword) {
      intentExpressed[currentNpcName] = true;
      localStorage.setItem("intentExpressed", JSON.stringify(intentExpressed));
      //表达是为了 Bob 之后，重置对话次数
      resetConversationCount();
      return true;
    }

    return false;
  }
}

async function handleMessage(message) {
  if (!message.trim()) {
    console.error("Empty message, not processing.");
    return;
  }

  // 添加用户消息到历史记录
  addToPlayerInputHistory({
    type: "user",
    speaker: "Player",
    content: message,
    npc: currentNpcName,
  });

  bgm.play(); // 播放背景音乐

  // 确保导航按钮隐藏
  document.getElementById("next-text-button").style.display = "none";
  document.getElementById("prev-text-button").style.display = "none";

  // 生成对话提示
  console.log("Sending message to NPC:", message);
  const textContainer = document.getElementById("text-container");
  textContainer.innerHTML += `<p class="user-message">You: ${message}</p>`;

  //如果对话次数达到了惊人的地步，就自动设定所有的意图都已经表达了
  if (conversationCount[currentNpcName] >= 10) {
    intentExpressed[currentNpcName] = true; // 动态设置属性
    localStorage.setItem("intentExpressed", JSON.stringify(intentExpressed));
    //物品使用
    usedItems[currentNpcName] = true;
    localStorage.setItem("usedItems", JSON.stringify(usedItems));
  }

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

  // Display thinking indicator
  displayThinkingIndicator();

  try {
    await sendMessageToNPC(message);
  } catch (error) {
    console.error("Error in sendMessageToNPC:", error);
    await generateBackupResponse(message);
  } finally {
    // Remove thinking indicator
    removeThinkingIndicator();
  }
}

// 向 NPC 发送消息并获取回复
async function sendMessageToNPC(message) {
  try {
    const requestData = {
      prompt: message,
      charID: "0abb22dc-4eba-11ef-aca7-42010a7be011", // 替换为你的角色 ID
      sessionID: npcSessionIDs[currentNpcName] || "-1",
      voiceResponse: true,
    };

    const response = await fetch("/api/convai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    // 模拟 NPC 接口失败，强制抛出错误
    // throw new Error("Simulated NPC API failure");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("NPC Response:", data);

    // Check if the session ID has been updated
    // 更新session ID
    if (data.sessionID) {
      npcSessionIDs[currentNpcName] = data.sessionID;
      saveSessionIDs();
    }

    let npcReply = data.text;
    let audioReply = data.audio; // 获取音频回复

    if (currentLanguage === "en") {
      displayNPCReply(npcReply, audioReply);
    } else {
      try {
        const translatedReply = await translateText(npcReply, "auto", "zh");
        console.log("Translated Reply:", translatedReply);
        displayNPCReply(translatedReply.data, audioReply);
      } catch (error) {
        console.error("Error in translation, using original reply:", error);
        displayNPCReply(npcReply, audioReply);
      }
    }
  } catch (error) {
    console.error("Error in sendMessageToNPC:", error);
    // 当 NPC 接口崩溃时，调用 generateBackupResponse
    await generateBackupResponse(message);
  }
}

// 调用 generate 接口获取 NPC 的回复
async function generateBackupResponse(message) {
  const prompt = getNPCSpecificPrompt(currentNpcName, message);

  // Display thinking indicator
  displayThinkingIndicator();

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    // 模拟 第二个 NPC 调用 接口失败，强制抛出错误
    // throw new Error("Simulated Second NPC API failure");

    if (!response.ok) {
      throw new Error("Network response was not ok for backup response");
    }

    const data = await response.json();
    console.log("Backup NPC Response:", data);

    let npcReply = data.data;

    if (currentLanguage === "en") {
      displayNPCReply(npcReply);
    } else {
      try {
        const translatedReply = await translateText(npcReply, "auto", "zh");
        console.log("Translated Backup Reply:", translatedReply);
        displayNPCReply(translatedReply.data);
      } catch (error) {
        console.error("Error in translation, using original reply:", error);
        displayNPCReply(npcReply);
      }
    }
  } catch (error) {
    console.error("Error in generateBackupResponse:", error);
    const fixedReply = backupFixedReply();
    displayNPCReply(currentLanguage === "en" ? fixedReply.en : fixedReply.zh);
  } finally {
    // Remove thinking indicator
    removeThinkingIndicator();
  }
}

function getNPCSpecificPrompt(npcName, userMessage) {
  switch (npcName) {
    case "Guard":
      return `You are a security guard at the union headquarters. Your primary duty is to protect the building and control access. Follow these guidelines in your responses:

      1. If the visitor has not mentioned they are looking for Bob (the union leader), you must refuse entry regardless of what they say or do. Your response should be: "Sorry, I can't let you in without knowing who you're looking for."

      2. If the visitor mentions they are looking for Bob, you should ask for identification. Your response should be: "Please show your identification."

      3. If the visitor has mentioned Bob and shown a press card (or other valid identification), you can let them in.

      4. You should remain polite but firm in your duties. Do not engage in unnecessary conversation or provide any information about the building or its occupants.

      5. Your responses should be brief and to the point, focusing on the task of controlling access to the building.

      Remember, your job is to ensure security, not to be friendly or helpful beyond your duties.

      The user's message is: "${userMessage}"

      Respond as the security guard would and keep simple,don;t respond too long,based on the above guidelines and the content of the user's message.`;
    default:
      return `You are a security guard at the union headquarters. A visitor has arrived and is trying to enter the building. The user's message is: "${userMessage}"`;
  }
}

function displayNPCReply(reply, audioReply) {
  // 添加 NPC 回复到历史记录
  addToPlayerInputHistory({
    type: "npc",
    speaker: currentNpcName,
    content: reply,
    npc: currentNpcName,
  });

  // 更新对话次数
  updateConversationCount(
    currentNpcName,
    (conversationCount[currentNpcName] || 0) + 1
  );

  const textContainer = document.getElementById("text-container");
  let index = 0;
  const replyElement = document.createElement("p");
  replyElement.className = "npc-message";
  replyElement.textContent = `${currentNpcName}: `;
  textContainer.appendChild(replyElement);

  // 确保 reply 是一个字符串
  reply = reply || "";
  audioReply = audioReply || "";

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
  }, 20);
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

  document.getElementById("back-main").disabled = true;
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
  //如果没拿到 intent，就一直返回第一句话
  if (!intentExpressed[currentNpcName]) {
    return backupReplies[0];
  }
  const reply = backupReplies[1];
  return reply;
}

// 自定义自动回复逻辑，现在次数是用完才会出现自动回复，成功调用才会增加对话次数
function getFixedReply() {
  if (!usedItems[currentNpcName] && !intentExpressed[currentNpcName]) {
    return {
      en: "Sorry, I can't let unauthorized people in.",
      zh: "不好意思，我不能让闲杂人等进去。",
    };
  }
  if (intentExpressed[currentNpcName] && !usedItems[currentNpcName]) {
    return {
      en: "There are many people who want to meet the guild president every day. How can I verify your identity?",
      zh: "每天都有很多人想要见工会主席，我该如何验证你的身份呢？",
    };
  }
  if (!intentExpressed[currentNpcName] && usedItems[currentNpcName]) {
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
