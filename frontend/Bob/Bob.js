let bgm;
let currentNpcName = "Bob"; // NPC 名字
bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "./Music/Save the World.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; //  音量设置为 10%
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

  //  // test
  // gameProgress.talkedToLisa = true;
  // gameProgress.talkedToGuard = true;
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
    startNewSceneDialogue(); // 如果所有的对话都结束了，显示新的对话
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
    if (allScenesCompleted.Bob && newSceneCompleted.Bob === null) {
      // 如果所有对话都结束了，但是新对话还没有结束，说明用户直接点击了 back to main 而没有去 room
      // 跳转到艾米丽的页面
      setLastSigner(currentNpcName); //传递当前的npc名字 Bob
      window.location.href = `../Room/room.html?lastSigner=${currentNpcName}`;
    } else {
      window.location.href = "../Emilia/Emilia.html"; // 跳转到默认地图页面
    }
  });
});

const scenes = [
  {
    text: {
      en: [
        "Okay, in that case, we will use the <span class='highlight' data-item='general_strike' data-image='../items/general_strike.png'>general strike</span> to fight the government to the end.",
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
      //回到房间
      window.location.href = "../Room/room.html";
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
const intentOne =
  "Player mentions T energy, come for T, or expresses interest in T energy or just say t or T";

const intentTwo =
  "Player mentions Kane, their relationship to Kane, or any information about Kane's past or death";

const intentThree =
  "Player mentions Lisa, any support for the strike, or opposition to T energy";
// 检查用户是否表达了特定的意图

async function Check(intent, message) {
  // 为不同的意图设置不同的关键字
  const keywords = {
    [intentOne]: ["T", "come for T", "looking for T", "here for T"],
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

    //模拟 Intent 接口失败，强制抛出错误
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
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    if (containsKeyword) {
      switch (intent) {
        case intentOne:
          //如果包含关键字，更新意图
          updateBobIntentExpress("comeForK", true);
          // 重置对话次数
          resetConversationCount();
          break;
        case intentTwo:
          // 如果第一个意图没有表达，不能reset
          if (!bobIntentExpress.comeForK) {
            updateBobIntentExpress("kaneRelation", true);
            break;
          }
          // 重置对话次数
          updateBobIntentExpress("kaneRelation", true);
          resetConversationCount();
          break;
        case intentThree:
          // 如果前两个意图没有表达，不能reset
          if (!bobIntentExpress.comeForK || !bobIntentExpress.kaneRelation) {
            updateBobIntentExpress("lisaSupport", true);
            break;
          }
          updateBobIntentExpress("lisaSupport", true);
          resetConversationCount();
          break;
      }

      // 检查是否所有意图都已表达
      if (allBobIntentsExpressed()) {
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
    textContainer.innerHTML += `<p class="npc-message">Bob: ${
      currentLanguage === "en" ? fixedReply.en : fixedReply.zh
    }</p>`;
    return;
  } else if (
    bobIntentExpress.comeForK &&
    !bobIntentExpress.kaneRelation &&
    conversationCount[currentNpcName] >= 3
  ) {
    const fixedReply = backupIntentReplies[0];
    textContainer.innerHTML += `<p class="npc-message">Bob: ${
      currentLanguage === "en" ? fixedReply.en : fixedReply.zh
    }</p>`;
    return;
  } else if (
    bobIntentExpress.comeForK &&
    bobIntentExpress.kaneRelation &&
    !bobIntentExpress.lisaSupport &&
    conversationCount[currentNpcName] >= 3
  ) {
    const fixedReply = backupIntentReplies[1];
    textContainer.innerHTML += `<p class="npc-message">Bob: ${
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
      charID: "84025b20-4ce3-11ef-81bd-42010a7be011", // 替换为你的角色 ID
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
  }
}

function getNPCSpecificPrompt(npcName, userMessage) {
  switch (npcName) {
    case "Bob":
      return `You are Bob, the union leader at the headquarters. You are a humble and kind-hearted person, but currently feeling anxious about the impact of the new energy source T. Follow these guidelines in your responses:

      1. When the player first enters, ask them why they are there: "Welcome. What brings you here today?"

      2. If the player doesn't mention T, engage in general conversation based on your persona. However, limit this to five rounds of dialogue. After the fifth round, end the conversation with: "I'm sorry, but our meeting time is over. I have work to do."

      3. If the player mentions T, but hasn't revealed they're Kane's son or mentioned Kane's death, your response should always be: "I'm sorry, if it's about T, all the members have agreed. This is the trend and there is nothing we can do about it."

      4. If the player reveals they're Kane's son or mentions the truth about Kane's death, respond with: "Turns out the government lied to us. However, all the people support the new energy. Unless we can get support from the public."

      5. If the player mentions Lisa's support, show determination to hold a general strike: "Alright, if that's the case, we'll use a general strike to fight the government to the end!"

      6. Your tone should reflect your internal conflict: you're unable to refuse a change that could revolutionize the industry, yet worried about resisting public opinion.

      7. Show empathy and concern for the workers and the public, but also a sense of powerlessness against the perceived inevitability of T energy.

      Remember, you're torn between your duty to the workers, the apparent benefits of K energy, and your suspicions about the government's actions.

      The user's message is: "${userMessage}"

      Respond as Bob would, based on the above guidelines and the content of the user's message.`;
    default:
      return `You are Bob, the union leader at the headquarters. A visitor has arrived to speak with you. The user's message is: "${userMessage}"`;
  }
}

function displayNPCReply(reply, audioReply) {
  //更新
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
    zh: "先生，您是为了什么而来？", // 这里的回复是随机的，可以根据实际情况修改
  },
  {
    en: "Greetings! I'm afraid I'll need to know your business here before I can let you proceed.",
    zh: "您好！恐怕在让您继续之前，我需要知道您来这里的目的。",
  },
  {
    en: "Hello, this is a restricted area. Could you please state your reason for being here?",
    zh: "您好，这是一个管制区域。您能否说明一下您来这里的原因？",
  },
  //这里可以优化，就一句话可能比较无聊
];

//备用的意图的方案
const backupIntentReplies = [
  {
    en: "I'm sorry, but we've already made a decision regarding K. There's nothing I can do to change it.",
    zh: "对不起，我们已经就 T 的事情做出了决定。我无法改变它。",
  },
  {
    en: "Ah, so the government has deceived us. But, all the people support the new energy. Unless we can get the support of the people.",
    zh: "原来政府欺骗了我们。可是，所有人民都支持新能源了。除非我们能够得到了民意的支持。",
  },
  {
    en: "Okay, in that case, we will use the general strike to fight the government to the end.",
    zh: "Lisa也支持?, 既然如此，我们会利用大罢工向政府抗争到底！",
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

  // 如果没有表达任何意图，随机返回默认回复
  const random = Math.floor(Math.random() * backupReplies.length);
  return backupReplies[random];
}
