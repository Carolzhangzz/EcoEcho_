let bgm;
let currentNpcName = "Bob"; // NPC 名字
bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "./Music/Save the World.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; //  音量设置为 10%
let sessionID = "-1"; // 会话 ID，用于区分不同的游戏进度
let backupReplyIndex = 0; // 备用回复的索引

document.addEventListener("DOMContentLoaded", () => {
  const characterImage = document.getElementById("character-image");
  const backgroundImage = "./images/Office.png";
  const nextButton = document.getElementById("next-text-button");
  const prevButton = document.getElementById("prev-text-button");
  const userInputContainer = document.getElementById("user-input-container");

  // 设置背景图和角色图片
  document.body.style.backgroundImage = `url('${backgroundImage}')`;
  characterImage.src = "./npc/Bob.png";
  characterImage.style.display = "block";

  // // test
  gameProgress.talkedToLisa = true;
  gameProgress.talkedToGuard = true;
  // gameProgress.talkedToBob=true;
  // usedItems.Bob = true;
  if (!gameProgress.talkedToGuard) {
    // 如果没有与Guard对话，说明就是地图来的，直接显示默认对话
    startFirstDialogue();
  } else if (
    gameProgress.talkedToLisa &&
    gameProgress.talkedToGuard &&
    gameProgress.talkedToBob
  ) {
    // 如果已经与Lisa,Guard 和 Bob对话，显示新场景对话
    startNewSceneDialogue();
  }

  //其余情况就是直接显示Guard的对话
  nextButton.style.display = "inline-block";
  prevButton.style.display = "none";
  // userInputContainer.style.display = "block";

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
    if (allScenesCompleted.Bob && newSceneCompleted.Bob === null) {
      // 如果所有对话都结束了，但是新对话还没有结束，说明用户直接点击了 back to main 而没有去艾米丽
      // 跳转到艾米丽的页面
      setLastSigner(currentNpcName);
      window.location.href = "../Room/room.html";
    } else {
      window.location.href = "../Map/map.html"; // 跳转到默认地图页面
    }
  });
});

const scenes = [
  {
    text: {
      en: [
        "Okay, in that case, we will use the <span class='highlight' data-item='general strike' data-image='../items/general_strike.png'>general strike</span> to fight the government to the end.",
      ],
      zh: [
        "好的，既然如此，我们会利用<span class='highlight' data-item='大罢工' data-image='../items/general_strike.png'>大罢工</span>向政府抗争到底。",
      ],
    },
    background: "./images/Office.png",
    textStyle: "futuristic",
    character: "./npc/Bob.png",
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
      gameProgress.talkedToBob = true;
      updateAllScenesCompleted("Bob", true); // 更新Security的allScenesCompleted状态
      localStorage.setItem("gameProgress", JSON.stringify(gameProgress)); // 保存到 localStorage
      setLastSigner(currentNpcName); // 设置最后一个对话的 为 Bob
      //修改这里的逻辑
      setTimeout(() => {
        //回到房间
        window.location.href = "../Room/room.html";
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

const intentOne = "Player need to mention they come for K";
const intentTwo =
  "Player need to mention he is kane's son or kane is his father";
const intentThree = "Player need to mention Lisa also support the strike";

// 检查用户是否表达了特定的意图

async function Check(intent, message) {
  // 为不同的意图设置不同的关键字
  const keywords = {
    [intentOne]: ["K", "come for K", "looking for K"],
    [intentTwo]: ["son", "Kane is my father", "I'm Kane's son", "father"],
    [intentThree]: [
      "Lisa supports",
      "Lisa also supports",
      "Lisa agrees",
      "Lisa",
    ],
  };

  // 获取对应意图的关键字
  const intentKeywords = keywords[intent];

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

    // 模拟 Intent 接口失败，强制抛出错误
    // throw new Error("Simulated Intent API failure");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Check Response:", data);
    // 解析玩家的意图是不是符合预期
    const intentExpressedValue = data.data === "true";

    if (intentExpressedValue) {
      switch (intent) {
        case intentOne:
          updateBobIntentExpress("comeForK", true);
          resetConversationCount();
          break;
        case intentTwo:
          updateBobIntentExpress("kaneRelation", true);
          if (!bobIntentExpress.comeForK) {
            //如果第一个意图没有表达，不能reset
            break;
          }
          resetConversationCount();
          break;
        case intentThree:
          updateBobIntentExpress("lisaSupport", true);
          if (!bobIntentExpress.comeForK || !bobIntentExpress.kaneRelation) {
            //如果前两个意图没有表达，不能reset
            break;
          }
          resetConversationCount();
          break;
      }

      // 检查是否所有意图都已表达
      if (allBobIntentsExpressed()) {
        intentExpressed[currentNpcName] = true; // bob的所有意图都表达了，设置为true
        localStorage.setItem(
          "intentExpressed",
          JSON.stringify(intentExpressed)
        );
      }
    }

    return intentExpressedValue;
  } catch (error) {
    console.error("Error in Check:", error);

    // 检查用户输入是否包含关键字
    const containsKeyword = intentKeywords.some((keyword) =>
      message.includes(keyword)
    );

    if (containsKeyword) {
      updateBobIntentExpress(intent, true);
      // 检查是否所有意图都已表达
      if (allBobIntentsExpressed()) {
        intentExpressed[currentNpcName] = true; // bob的所有意图都表达了，设置为true
        localStorage.setItem(
          "intentExpressed",
          JSON.stringify(intentExpressed)
        );
      }
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
  const intents = [intentOne, intentTwo, intentThree];
  const intentKeys = ["comeForK", "kaneRelation", "lisaSupport"];

  for (let i = 0; i < intents.length; i++) {
    if (!bobIntentExpress[intentKeys[i]]) {
      await Check(intents[i], message);
    }
  }

  // Check for special conditions before sending the message
  if (allBobIntentsExpressed()) {
    startSceneDialogue();
    startGame();
    return;
  }

  console.log("Bob Intents expressed:", bobIntentExpress);

  if (!bobIntentExpress.comeForK && conversationCount[currentNpcName] >= 3) {
    const fixedReply = backupReplies[0];
    textContainer.innerHTML += `<p class="npc-message">Security: ${
      currentLanguage === "en" ? fixedReply.en : fixedReply.zh
    }</p>`;
    return;
  }
  if (
    bobIntentExpress.comeForK &&
    !bobIntentExpress.kaneRelation &&
    conversationCount[currentNpcName] >= 3
  ) {
    const fixedReply = backupIntentReplies[0];
    textContainer.innerHTML += `<p class="npc-message">Security: ${
      currentLanguage === "en" ? fixedReply.en : fixedReply.zh
    }</p>`;
    return;
  }
  if (
    bobIntentExpress.comeForK &&
    bobIntentExpress.kaneRelation &&
    !bobIntentExpress.lisaSupport &&
    conversationCount[currentNpcName] >= 3
  ) {
    const fixedReply = backupIntentReplies[1];
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
  try {
    const requestData = {
      prompt: message,
      charID: "4d2ef564-4b89-11ef-ad21-42010a7be011", // 替换为你的角色 ID
      sessionID: sessionID,
      voiceResponse: true,
    };

    // 注释掉模拟错误的代码
    throw new Error("Simulated ConvAI API failure");

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

    // 只有在成功获取响应后才更新对话次数
    updateConversationCount(
      currentNpcName,
      conversationCount[currentNpcName] + 1
    );
    localStorage.setItem(
      "conversationCount",
      JSON.stringify(conversationCount)
    );

    if (currentLanguage === "en") {
      displayNPCReply(npcReply, audioReply);
    } else {
      const translatedReply = await generateResponse(npcReply);
      console.log("Translated Reply:", translatedReply);
      displayNPCReply(translatedReply.data, audioReply);
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
  try {
    // 注释掉模拟错误的代码
    throw new Error("Simulated Second NPC API failure");

    const response = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok for backup response");
    }

    const data = await response.json();
    console.log("Backup NPC Response:", data);

    let npcReply = data.data;

    // 更新对话计数
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
    displayNPCReply(currentLanguage === "en" ? fixedReply.en : fixedReply.zh);

    // 即使使用固定回复，也要更新对话计数
    updateConversationCount(
      currentNpcName,
      conversationCount[currentNpcName] + 1
    );
  }
}

function getNPCSpecificPrompt(npcName, userMessage) {
  switch (npcName) {
    case "Guard":
      return `You are Bob at the union headquarters. You are talking to the player at the union office. a humble and kind-hearted union leader. You feels anxious about the impact of the new energy source, 
      unable to refuse a change that could revolutionize the industry,
      yet also worried about resisting public opinion. The user responds: "${userMessage}"`;
    default:
      return `You are Bob at the union headquarters. You are talking to the guard at the entrance. The guard asks you to identify the person you are here to visit. The user responds: "${userMessage}"`;
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

// 两个接口都失败时，且没有表达任何的意图（关键词检测），显示固定的回复
const backupReplies = [
  {
    en: "Sir, what are you coming for ?",
    zh: "先生，您来找谁？", // 这里的回复是随机的，可以根据实际情况修改
  },
];

//备用的意图的方案
const backupIntentReplies = [
  {
    en: "I'm sorry, but we've already made a decision regarding K. There's nothing I can do to change it.",
    zh: "对不起，我们已经就 K 的事情做出了决定。我无法改变它。",
  },
  {
    en: "Ah, so the government has deceived us. But, all the people support the new energy. Unless we can get the support of the people.",
    zh: "原来政府欺骗了我们。可是，所有人民都支持新能源了。除非我们能够得到了民意的支持。",
  },
  {
    en: "Okay, in that case, we will use the general strike to fight the government to the end.",
    zh: "好的，既然如此，我们会利用大罢工向政府抗争到底！",
  },
];

function backupFixedReply() {
  //两个接口都失败时，显示固定的回复
  const intentKeys = ["comeForK", "kaneRelation", "lisaSupport"];
  let lastExpressedIntent = -1;

  // 找到最后一个表达的意图
  for (let i = intentKeys.length - 1; i >= 0; i--) {
    if (bobIntentExpress[intentKeys[i]]) {
      lastExpressedIntent = i;
      break;
    }
  }

  // 根据最后表达的意图返回相应的回复
  if (lastExpressedIntent !== -1) {
    return backupIntentReplies[lastExpressedIntent];
  }

  // 如果没有表达任何意图，返回默认回复
  return backupReplies[0];
}
