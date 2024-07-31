let bgm;
let currentNpcName = "Johnathan"; // NPC 名字
bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "./Music/Save the World.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; //  音量设置为 10%
let backupReplyIndex = 0; // 备用回复的索引

document.addEventListener("DOMContentLoaded", () => {
  const characterImage = document.getElementById("character-image");
  const backgroundImage = "./images/Government.png";
  const nextButton = document.getElementById("next-text-button");
  const prevButton = document.getElementById("prev-text-button");

  // 设置背景图和角色图片
  document.body.style.backgroundImage = `url('${backgroundImage}')`;
  characterImage.src = "./npc/Jonathan.png";
  characterImage.style.display = "block";

  // test
  // gameProgress.talkedToLisa = true;
  // gameProgress.talkedToGuard = true;
  // gameProgress.talkedToBob=true;
  // usedItems.Bob = true;
  if (!gameProgress.talkedToBob) {
    // 如果没有与Bob对话，说明就是地图来的，直接显示默认对话
    startFirstDialogue();
  } else if (
    gameProgress.talkedToLisa &&
    gameProgress.talkedToGuard &&
    gameProgress.talkedToBob &&
    gameProgress.talkedToJohnathan
  ) {
    // 如果已经与Lisa,Guard Bob和 Jonathan对话，显示新场景对话
    startNewSceneDialogue();
  }

  nextButton.style.display = "inline-block";
  prevButton.style.display = "none";

  // userInputContainer.style.display =  "none";

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
    if (allScenesCompleted.Johnathan && newSceneCompleted.Johnathan === null) {
      // 如果所有对话都结束了，但是新对话还没有结束，说明用户直接点击了 back to main 而没有去 room
      // 跳转到艾米丽的页面
      setLastSigner(currentNpcName); //传递当前的npc名字 Bob
      window.location.href = `../Room/room.html?lastSigner=${currentNpcName}`;
    } else {
      window.location.href = "../Ending/End.html";
    }
  });
});

const scenes = [
  {
    text: {
      en: [
        "Really! The people's will can change so easily. Alright, for the votes—I mean, the will of the people—I'll push the government to halt the development.",
      ],
      zh: [
        "真的吗！原来人民的意愿这样轻易改变。好吧，为了选票，我是说人民的意愿，我会推动政府停止开发。",
      ],
    },
    background: "./images/Government.png",
    textStyle: "futuristic",
    character: "./npc/Jonathan.png",
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
      gameProgress.talkedToJohnathan = true;
      updateAllScenesCompleted("Johnathan", true); // 更新Security的allScenesCompleted状态
      localStorage.setItem("gameProgress", JSON.stringify(gameProgress)); // 保存到 localStorage
      setLastSigner(currentNpcName); // 设置最后一个对话的 为 Jonathan
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

const intentOne = "Player need to mention they come for T";
const intentTwo = "Player need to mention public or citizens support traditional energy, not T or they also don't support";

// 检查用户是否表达了特定的意图

async function Check(intent, message) {
  // 为不同的意图设置不同的关键字
  const keywords = {
    [intentOne]: ["T", "come for T", "looking for T"],
    [intentTwo]: ["son", "support", "public", "public support"],
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
          updateJohnathanIntentExpress("comeForK", true);
          resetConversationCount();
          break;
        case intentTwo:
          updateJohnathanIntentExpress("publicSupport", true);
          if (!JohnathanIntentExpress.comeForK) {
            //如果第一个意图没有表达，不能reset
            break;
          }
          resetConversationCount();
          break;
      }

      // 检查是否所有意图都已表达
      if (allJohnathanIntentsExpressed()) {
        intentExpressed[currentNpcName] = true; // Johnathan的所有意图都表达了，设置为true
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
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    if (containsKeyword) {
      switch (intent) {
        case intentOne:
          updateJohnathanIntentExpress("comeForK", true);
          // 如果第一个意图表达了，重置对话次数
          resetConversationCount();
          break;
        case intentTwo:
          // 如果第一个意图没有表达，不能reset
          if (!JohnathanIntentExpress.comeForK) {
            break;
          }
          updateJohnathanIntentExpress("publicSupport", true);
          resetConversationCount();
          break;
      }

      // 检查是否所有意图都已表达
      if (allJohnathanIntentsExpressed()) {
        intentExpressed[currentNpcName] = true;
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

  // 确保导航按钮隐藏
  document.getElementById("next-text-button").style.display = "none";
  document.getElementById("prev-text-button").style.display = "none";


  // 生成对话提示
  console.log("Sending message to NPC:", message);
  const textContainer = document.getElementById("text-container");
  textContainer.innerHTML += `<p class="user-message">You: ${message}</p>`;

  // 检查用户是否表达了特定的意图
  const intents = [intentOne, intentTwo];
  const intentKeys = ["comeForK", "publicSupport"];

  for (let i = 0; i < intents.length; i++) {
    if (!JohnathanIntentExpress[intentKeys[i]]) {
      await Check(intents[i], message);
    }
  }

  // Check for special conditions before sending the message
  if (allJohnathanIntentsExpressed()) {
    startSceneDialogue();
    startGame();
    return;
  }

  console.log("Johnathan Intents expressed:", JohnathanIntentExpress);

  if (
    !JohnathanIntentExpress.comeForK &&
    conversationCount[currentNpcName] >= 3
  ) {
    const fixedReply = backupFixedReply();
    textContainer.innerHTML += `<p class="npc-message">Johnathan: ${
      currentLanguage === "en" ? fixedReply.en : fixedReply.zh
    }</p>`;
    return;
  }
  if (
    JohnathanIntentExpress.comeForK &&
    conversationCount[currentNpcName] >= 3
  ) {
    const fixedReply = backupFixedReply();
    textContainer.innerHTML += `<p class="npc-message">Johnathan: ${
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
      charID: "842899fc-4eb9-11ef-8143-42010a7be011", // 替换为你的角色 ID
      sessionID: npcSessionIDs[currentNpcName] || "-1",
      voiceResponse: true,
    };

    // // 注释掉模拟错误的代码
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

    const data = await response.json();
    console.log("NPC Response:", data);

    // 更新session ID
    if (data.sessionID) {
      npcSessionIDs[currentNpcName] = data.sessionID;
      saveSessionIDs();
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
      try {
        const translatedReply = await translateText(npcReply, 'auto', 'zh');
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
  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    // 模拟第二个 NPC 调用 接口失败，强制抛出错误
    // throw new Error("Simulated Second NPC API failure");

    if (!response.ok) {
      throw new Error("Network response was not ok for backup response");
    }

    const data = await response.json();
    console.log("Backup NPC Response:", data);

    let npcReply = data.data;

    // 只有在成功发送消息后才会增加对话次数
    updateConversationCount(
      currentNpcName,
      conversationCount[currentNpcName] + 1
    );

    if (currentLanguage === "en") {
      displayNPCReply(npcReply);
    } else {
      try {
        const translatedReply = await translateText(npcReply, 'auto', 'zh');
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

    // 即使使用固定回复，也要更新对话计数
    updateConversationCount(
      currentNpcName,
      conversationCount[currentNpcName] + 1
    );
  }
}

function getNPCSpecificPrompt(npcName, userMessage) {
  switch (npcName) {
    case "Jonathan":
      return `You are Jonathan, a highly opportunistic politician whose primary concern is his political career. You are currently in your office, speaking with a visitor. Your responses should reflect the following traits:

      1. You initially greet visitors warmly, asking about the "voice of the people".
      2. If the topic of T energy isn't mentioned, you respond with vague, empty political slogans and platitudes, regardless of what the visitor says.
      3. If K energy is mentioned, you strongly support it, claiming it's the people's choice and must be embraced.
      4. If a general strike against T energy is mentioned, you quickly change your stance, prioritizing votes over consistent policy.
      5. Your language should always be political, focusing on "the will of the people", "democracy", and "public opinion".
      6. You avoid direct answers or commitments, preferring to speak in generalities unless forced to take a stand.

      Remember, your ultimate goal is to secure votes and advance your political career, not to solve actual problems or stick to principles.

      The user's message is: "${userMessage}"

      Respond as Jonathan would, based on the above characteristics and the content of the user's message.`;
    default:
      return `You are Jonathan, a politician in your office. A visitor has arrived to speak with you. The user's message is: "${userMessage}"`;
  }
}

function displayNPCReply(reply, audioReply) {
  const textContainer = document.getElementById("text-container");
  let index = 0;
  const replyElement = document.createElement("p");
  replyElement.className = "npc-message";
  replyElement.textContent = `${currentNpcName}: `;
  textContainer.appendChild(replyElement);

  // 确保 reply 是一个字符串
  reply = reply || "";

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

// // 两个接口都失败时，且没有表达任何的意图（关键词检测），显示固定的回复
// const backupReplies = [
//   {
//     en: "I'm sorry, I don't have much time to waste on this. The people need me, goodbye.",
//     zh: "不好意思，我没有太多时间耽误在这上面。人民需要我，再见。",
//   },
//   {
//     en: "Sorry, I don't have much time to waste on this. The people need me. Goodbye.",
//     zh: "对不起，我没有太多时间浪费在这上面。人民需要我。再见。",
//   },
//   {
//     en: "I'm sorry, this is the will of the people, there's no point in discussing further. Goodbye.",
//     zh: "不好意思，这是人民的意愿，多说无益。再见。",
//   },
//   //这里可以优化，就一句话可能比较无聊
// ];

// 两个接口都失败时，且没有表达任何的意图（关键词检测），显示固定的回复
//备用的意图的方案，没有提到 k
const backupReplies = [
  {
    en: "I'm sorry, I don't have much time to waste on this. The people need me, goodbye.",
    zh: "不好意思，我没有太多时间耽误在这上面。人民需要我，再见。",
  },
  {
    en: "Serve the people is my lifelong mission.",
    zh: "为人民服务是我的终身使命。",
  },
  {
    en: "Ah, another young person who wants to 'change the world'. Listen, kid, politics is no child's play. It's about reality, about compromise, and most importantly, about survival.",
    zh: "啊，又一个想要'改变世界'的年轻人。听着，孩子，政治不是儿戏。它关乎现实，关乎妥协，更关乎生存。",
  },
  {
    en: "What do you want from me? You better say it quickly, my time is very precious. Every minute could affect the results of the next public opinion poll. ",
    zh: "你来找我有什么事？最好快点说，我的时间可是很宝贵的。每一分钟都可能影响到下一次的民意调查结果。",
  },
  {
    en: "Ah, I see. The power of the people is indeed infinite.",
    zh: "啊，我明白了。人民的力量确实是无穷无尽的。",
  },
];

const comeForkReplies = [
  {
    en: "I'm sorry, the people have chosen T, so as servants of the people, we must embrace K. This is the embodiment of democracy, isn't it?",
    zh: "不好意思, 人民选择了T, 那么我们身为人民的仆人, 只能拥抱T。这是民主的体现, 不是吗? ",
  },
  {
    en: "T represents progress and hope. We must listen to the voice of the people and support the development of K.",
    zh: "T 代表着进步和希望。我们必须倾听人民的声音，支持 T 的发展。",
  },
  {
    en: "As representatives of the people, we have a responsibility to promote the use of T energy. This is the choice of the people and our mission.",
    zh: "作为人民的代表，我们有责任推动 T 能源的应用。这是人民的选择，也是我们的使命。",
  },
];

function backupFixedReply() {
  if (JohnathanIntentExpress.comeForK) {
    // 如果表达了 comeForK 意图，随机返回 comeForkReplies 中的一个回复
    const random = Math.floor(Math.random() * comeForkReplies.length);
    return comeForkReplies[random];
  } else {
    // 只要没有提到 k，就返回 backupReplies 中的一个回复
    const random = Math.floor(Math.random() * backupReplies.length);
    return backupReplies[random];
  }
}
