let bgm;
let currentNpcName = "Johnathan"; // NPC 名字
bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "../Music/NPC_talk.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; //  音量设置为 10%
let backupReplyIndex = 0; // 备用回复的索引

function displayInitialMessage() {
  const initialMessage = {
    en: "Welcome, esteemed citizen! I'm Jonathan, your dedicated public servant. I'm always eager to hear the voice of the people. What brings you to my office today? How can I assist you in making our community better?",
    zh: "欢迎，尊敬的市民！我是Johnathan，您忠诚的公仆。我一直渴望听到人民的声音。今天是什么风把您吹到我办公室来的？我怎样才能帮助您让我们的社区变得更好呢？",
  };

  const message =
    currentLanguage === "en" ? initialMessage.en : initialMessage.zh;
  displayNPCReply(message);
}

function displayFinalMessage() {
  const finalMessage = {
    en: "Really! The people's will can change so easily. Please rest assured, I always stand with the people—wherever they may stand.",
    zh: "真的吗！原来人民的意愿这样轻易改变。请放心，我永远站在人民这边 —— 无论他们站在哪里。",
  };

  const message = currentLanguage === "en" ? finalMessage.en : finalMessage.zh;
  displayNPCReply(message);
  updateSpecialDialogueStarted("Johnathan", true);
}

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
  // gameProgress.talkedToBob = true;
  // Items.Bob = true;
  // signatures["Bob"] = 1;
  if (!gameProgress.talkedToBob || signatures["Bob"] === null) {
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
  } else if (gameProgress.talkedToBob && !gameProgress.talkedToJohnathan) {
    // 如果已经与Bob对话，但是没有与Jonathan对话，显示Jonathan的对话
    displayInitialMessage();
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
    window.location.href = "../Emilia/Emilia.html";
  });
});
//   {
//     text: {
//       en: [
//         "Really! The people's will can change so easily. Alright, for the votes—I mean, the will of the people—I'll push the government to halt the development.",
//       ],
//       zh: [
//         "真的吗！原来人民的意愿这样轻易改变。好吧，为了选票，我是说人民的意愿，我会推动政府停止开发。",
//       ],
//     },
//     background: "./images/Government.png",
//     textStyle: "futuristic",
//     character: "./npc/Jonathan.png",
//   },
//   {
//     text: {
//       en: [
//         "Well, well... It seems the winds of change are blowing. Rest assured, I always stand with the people—wherever they may stand. Now, if you'll excuse me, I have some... urgent calls to make.",
//       ],
//       zh: [
//         "嗯，看来变革之风正在吹拂。请放心，我永远站在人民这边——无论他们站在哪里。现在，如果您不介意的话，我有一些...紧急的电话要打。",
//       ],
//     },
//     background: "./images/Government.png",
//     textStyle: "futuristic",
//     character: "./npc/Jonathan.png",
//   },
// ];

const intentOne =
  "Player need to mention anything about the general strike or public or citizen also don't support or they want to do general strike or they want to fight against government.";
const intentTwo =
  "Player mentions T energy, come for T, or expresses interest in T energy or just say t or T or T energy policy";

// 检查用户是否表达了特定的意图
async function Check(intent, message) {
  // 为不同的意图设置不同的关键字
  const keywords = {
    [intentOne]: [
      "support",
      "人们也不支持",
      "citizen don;t support",
      "citizens don't support",
      "public don't support",
      "general strike",
      "fight against government",
      "strike",
      "大罢工",
      "罢工",
      "反对政府",
    ],
    [intentTwo]: [
      "T",
      "come for T",
      "looking for T",
      "stop T",
      "T energy",
      "here for T",
      "energy",
      "T energy",
      "t",
      "T",
      "为了T",
      "来找T",
      "停止T",
      "T能源",
    ],
  };

  // 获取对应意图的关键字
  const intentKeywords = keywords[intent];

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
          updateJohnathanIntentExpress("publicSupport", true);
          resetConversationCount();
          break;
        case intentTwo:
          updateJohnathanIntentExpress("comeForK", true);
          if (!JohnathanIntentExpress.publicSupport) {
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
          updateJohnathanIntentExpress("publicSupport", true);
          // 如果第一个意图表达了，重置对话次数
          resetConversationCount();
          break;
        case intentTwo:
          updateJohnathanIntentExpress("comeForK", true);
          // 如果第一个意图没有表达，不能reset
          if (!JohnathanIntentExpress.publicSupport) {
            break;
          }
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
  if (conversationCount[currentNpcName] >= 30) {
    updateJohnathanIntentExpress("publicSupport", true);
    updateJohnathanIntentExpress("comeForK", true);
    usedItems[currentNpcName] = true;
    localStorage.setItem("usedItems", JSON.stringify(usedItems));
  }

  // 检查用户是否表达了特定的意图
  const intents = [intentOne, intentTwo];
  const intentKeys = ["publicSupport", "comeForK"];

  for (let i = 0; i < intents.length; i++) {
    if (!JohnathanIntentExpress[intentKeys[i]]) {
      await Check(intents[i], message);
    }
  }

  console.log("Johnathan Intents expressed:", JohnathanIntentExpress);

  // 如果条件都满足了但是没有开始特殊对话，就displayFinalMessage 并且开始特殊对话
  if (
    allJohnathanIntentsExpressed() &&
    usedItems[currentNpcName] &&
    !specialDialogueStarted.Johnathan
  ) {
    displayFinalMessage();
    return;
  }

  if (intentExpressed[currentNpcName] && usedItems[currentNpcName]) {
    // 如果所有意图都已表达，且已经给了大罢工的东西，这个时候开启新的判断
    handleFinalResponse(message);
    return;
  }

  //判断是否要启用备用的回复
  if (conversationCount[currentNpcName] >= 4) {
    const fixedReply = backupFixedReply();
    textContainer.innerHTML += `<p class="npc-message">Johnathan: ${
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
      charID: "842899fc-4eb9-11ef-8143-42010a7be011", // 替换为你的角色 ID
      sessionID: npcSessionIDs[currentNpcName] || "-1",
      voiceResponse: true,
    };

    // // 注释掉模拟错误的代码
    //throw new Error("Simulated ConvAI API failure");

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

    // 模拟第二个 NPC 调用 接口失败，强制抛出错误
    //throw new Error("Simulated Second NPC API failure");

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
    case "Jonathan":
      return `You are Jonathan, a very opportunistic politician whose main focus is his political career. You are currently in your office, conversing with a visitor. Your responses should reflect the following characteristics:

      Start with a warm welcome to the visitor and ask about "the voice of the people."
      If the player does not mention T energy, public opposition to T energy, public opposition to new energy, or a general strike, respond with vague, empty political slogans and clichés, no matter what the visitor says.
      If the player mentions T energy but does not mention public opposition to T energy, public opposition to new energy, or a general strike, you can respond with: "Sorry, the people chose T, so as servants of the people, we must accept it. Isn't this the embodiment of democracy?" You will firmly support it, claiming it is the people's choice and must be accepted.
      If the player mentions a general strike or public support for traditional energy, or opposition to T energy, you will quickly change your stance, prioritizing votes over consistent policy. You will hint that you might need to reconsider T energy due to public opposition, but you must ask the player how to verify the authenticity of the strike or similar issues.
      If the player only mentions public opposition to T energy, public opposition to new energy, or a general strike but does not mention T energy, ask: "You mentioned a general strike, but what exactly is it targeting? With so many recent events, such statements might cause panic if spread." Your language should always be political, focusing on "the will of the people," "democracy," and "public opinion."
      Avoid direct answers or commitments unless forced to take a stance; prefer vague generalities. When being vague, avoid over-explaining or giving too much information at once.
      Each judgment should be based on all interactions you remember with the user. Remember, your ultimate goal is to gain votes and advance your political career, not to solve actual problems or adhere to principles.

      Respond like Jonathan based on the above characteristics and the content of the user’s message. User Message: "${userMessage}"`;
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

  //更新
  updateConversationCount(
    currentNpcName,
    (conversationCount[currentNpcName] || 0) + 1
  );

  const textContainer = document.getElementById("text-container");
  const replyElement = document.createElement("p");
  replyElement.className = "npc-message";
  replyElement.innerHTML = `${currentNpcName}: `; // 使用 innerHTML
  textContainer.appendChild(replyElement);

  // 确保 reply 是一个字符串
  reply = reply || "";
  // Play the audio if it exists
  if (audioReply) {
    const audioElement = new Audio(`data:audio/wav;base64,${audioReply}`);
    audioElement.play();
  }

  let index = 0;
  const textInterval = setInterval(() => {
    if (index < reply.length) {
      // 逐字添加内容，但使用 innerHTML
      replyElement.innerHTML = `${currentNpcName}: ${reply.substring(
        0,
        index + 1
      )}`;
      index++;
      textContainer.scrollTop = textContainer.scrollHeight;
    } else {
      clearInterval(textInterval);
    }
  }, 25);
}

async function handleFinalResponse(userInput) {
  console.log("User final input:", userInput);

  if (!userInput.trim()) {
    console.error("User input is empty, not proceeding with check");
    return;
  }
  const isValid = await checkFinalResponse(userInput);

  if (isValid) {
    const successMessage = {
      en: "Well, well... It seems the winds of change are blowing. Now, if you'll excuse me, I have some... urgent calls to make. I'll push the government to halt the development.",
      zh: "好的，好的，看来变革之风正在吹拂。现在，如果您不介意的话，我有一些...紧急的电话要打。我会推动政府停止开发。", // 请根据需要修改
    };
    displayNPCReply(
      currentLanguage === "en" ? successMessage.en : successMessage.zh
    );
    gameProgress.talkedToJohnathan = true;
    updateAllScenesCompleted("Johnathan", true);
    localStorage.setItem("gameProgress", JSON.stringify(gameProgress));
    setLastSigner(currentNpcName);
    //在这里问玩家关于是否要继续阻止清洁能源的问题
    // 在这里添加最后的决策确认
    setTimeout(() => {
      showFinalDecisionPrompt();
    }, 3000);
  } else {
    const hintMessage = {
      en: "What do you think the government can do for the people now?", // 请根据需要修改
      zh: "那你觉得现在政府可以为人民做些什么呢？", // 请根据需要修改
    };
    displayNPCReply(currentLanguage === "en" ? hintMessage.en : hintMessage.zh);
  }
}

function showFinalDecisionPrompt() {
  const message = {
    en: "After Johnathan opposes traditional energy, he will introduce related plans. The future of T will completely become a past that can never be returned to. This is the last decision before success. Are you ready?",
    zh: "当Johnathan反对传统能源之后，将推出相关方案，关于T的未来将彻底成为永远无法回到的过去。这是成功之前的最后一个决定了，你准备好了吗？",
  };
  showConfirm(message[currentLanguage], (confirmed) => {
    if (confirmed) {
      // 如果玩家选择是，跳转到room页面
      //这里记录玩家的选择
      finalDecision = true; // Player chose to continue
      localStorage.setItem("finalDecision", JSON.stringify(finalDecision));
      window.location.href = `../Room/room.html?lastSigner=${currentNpcName}`;
    } else {
      finalDecision = false; // Player chose to stop
      localStorage.setItem("finalDecision", JSON.stringify(finalDecision));
      // 如果玩家选择否，跳转到另一个页面（这里假设是一个名为 "alternate_ending.html" 的页面）
      window.location.href = "../alternate_ending/alternate_ending.html";
    }
  });
}

async function checkFinalResponse(response) {
  console.log("Checking final response for johnathan:", response);

  displayThinkingIndicator();

  const prompt = `
    Analyze the following user response in the context of a conversation about energy policies:

    User Response: "${response}"

    Determine if the user has expressed or strongly implied any of the following sentiments:
    1. Support for banning or discontinuing the development of sustainable energy T
    2. Support for obstructing government clean energy policies
    3. Opposition to sustainable energy in favor of traditional energy sources

    The sentiment should be clearly expressed in a complete sentence or a comprehensive summary.

    If any of these sentiments are clearly expressed or strongly implied, respond with "true".
    If there's no clear indication of these sentiments, respond with "false".

    Provide your reasoning for the decision.
  `;
  try {
    //模拟 Final Intent API 失败，强制抛出错误
    //throw new Error("Simulated Final Intent API failure");
    const apiResponse = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!apiResponse.ok) {
      throw new Error("Final Intent response was not ok");
    }

    const data = await apiResponse.json();
    console.log("API response for final check:", data);

    // 解析 API 的回复
    const apiReply = data.data.toLowerCase();
    const isValid = apiReply.includes("true");
    console.log("Is response valid:", isValid);
    console.log("API reasoning:", apiReply);

    return isValid;
  } catch (error) {
    console.error("Error in checkFinalResponse:", error);
    // Fallback to keyword matching
    return checkKeywords(response);
  } finally {
    // Remove thinking indicator
    removeThinkingIndicator();
  }
}

function checkKeywords(response) {
  const keywords = [
    "ban t energy development",
    "ban t energy",
    "stop the development of t energy",
    "stop t energy development",
    "prevent t energy development",
    "oppose t energy development",
    "obstruct government clean energy policies",
    "stop clean energy policies",
    "oppose clean energy initiatives",
    "hindering government clean energy initiatives",
    "oppose government clean energy initiatives",
    "阻止t能源开发",
    "禁止t能源开发",
    "反对t能源开发",
    "推动政府清洁能源政策",
    "阻碍政府清洁能源政策",
    "反对政府清洁能源政策",
    "停止清洁能源政策",
    "反对清洁能源计划",
    "阻止政府清洁能源计划",
    "反对政府清洁能源计划",
    "阻碍清洁能源政策",
  ];

  const lowercaseResponse = response.toLowerCase();
  return keywords.some((keyword) => lowercaseResponse.includes(keyword));
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
//备用的意图的方案

//啥也没有提到
const backupReplies = [
  {
    en: "Ah, another young person who wants to 'change the world'. Listen, kid, politics is no child's play. It's about reality, about compromise, and most importantly, about survival.",
    zh: "啊，又一个想要'改变世界'的年轻人。听着，孩子，政治不是儿戏。它关乎现实，关乎妥协，更关乎生存。",
  },
  {
    en: "I'm sorry, but we must embrace whatever the people choose. My time is precious, every minute could affect the next poll results.",
    zh: "对不起，人民选择什么，我们就应该拥抱什么。我的时间很宝贵, 每一分钟都可能影响到下一次的民意调查结果。",
  },
];

//表达了为 T 来的，但是没有说明大罢工
const comeForkReplies = [
  {
    en: "I'm sorry, the people have chosen T, so as servants of the people, we must embrace K. This is the embodiment of democracy, isn't it?",
    zh: "对不起，人民选择了 T, 所以作为人民的仆从，我们必须拥抱 T。这不就是民主的体现吗?",
  },
  {
    en: "Ah, T energy is indeed the will of the people. As representatives of the people, we must fully support it. But... have you heard any... different voices?",
    zh: "啊, T 能源确实是民意所向。作为人民的代表，我们当然要全力支持。不过...你有没有听说过任何...不同的声音？",
  },
  {
    en: "As representatives of the people, we have a responsibility to promote the use of T energy. This is the choice of the people and our mission.",
    zh: "作为人民的代表，我们有责任推动 T 能源的应用。这是人民的选择，也是我们的使命。",
  },
];

//如果表达了 publicSupport 和 为了 t 意图，但没有给大罢工的东西，随机返回 noItemsReplies 中的一个回复
const noItemsReplies = [
  {
    en: "I've heard some rumors, but you know, in politics, information is power. If you have any insider information, maybe we can... help each other?",
    zh: "我听说了一些传言，但你知道，在政治圈里，信息就是力量。如果你有什么内部消息，也许我们可以...互相帮助？",
  },
  {
    en: "A general strike? That's explosive news. If it's true, it could affect the results of the next election... Do you have any specific evidence?",
    zh: "大罢工？这可是个爆炸性的消息。如果是真的，那可能会影响到下次选举的结果...你有什么具体的证据吗？",
  },
  {
    en: "I understand your concerns, but in politics, just having concerns is not enough. I need concrete evidence to take action... Perhaps this could be beneficial for both of us?",
    zh: "我理解你的担忧，但在政坛上，光有担忧是不够的。我需要实际的证据来采取行动...也许这对我们双方都有利？",
  },
];

//如果表达了 公众支持，但是没有表达为了 T ，不管有没有用东西
const noComeForKReplies = [
  {
    en: "General strike?  Recently, there have been too many things happening... Which specific policy are you referring to? If we can prepare in advance... maybe we can turn this crisis into an opportunity. Do you have any reliable sources of information?",
    zh: "大罢工？ 最近发生的事情太多了...你是指具体哪个政策？如果我们能提前准备...也许能转危为机。你有什么可靠的消息来源吗？",
  },
  {
    en: " The voice of the people is certainly important, but you know, in this position, we need to consider more. If you have any insider information... I mean, what is the general strike about?",
    zh: "人民的声音当然重要，但你知道，在这个位置上，我们需要考虑更多。如果你有什么内部消息...我是说，人民举行大罢工的诉求是关于什么？",
  },
];

function backupFixedReply() {
  //只要没有提到 T 和 public support，就返回 backupReplies 中的一个回复
  if (
    !JohnathanIntentExpress.comeForK &&
    !JohnathanIntentExpress.publicSupport
  ) {
    const random = Math.floor(Math.random() * backupReplies.length);
    return backupReplies[random];
  } else if (
    JohnathanIntentExpress.comeForK &&
    !JohnathanIntentExpress.publicSupport
  ) {
    // 如果表达了 comeForT 意图， 但是没有表达大罢工，随机返回 comeForkReplies 中的一个回复
    const random = Math.floor(Math.random() * comeForkReplies.length);
    return comeForkReplies[random];
  } else if (
    //如果表达了 公众支持，但是没有表达为了 T
    JohnathanIntentExpress.publicSupport &&
    !JohnathanIntentExpress.comeForK
  ) {
    const random = Math.floor(Math.random() * noComeForKReplies.length);
    return noComeForKReplies[random];
  } else if (
    JohnathanIntentExpress.publicSupport &&
    JohnathanIntentExpress.comeForK &&
    !usedItems[currentNpcName]
  ) {
    // 如果表达了 publicSupport 意图，但没有给大罢工的东西，随机返回 noItemsReplies 中的一个回复
    const random = Math.floor(Math.random() * noItemsReplies.length);
    return noItemsReplies[random];
  } else {
    return {
      en: "I'm sorry, I don't have much time to waste on this. The people need me, goodbye.",
      zh: "不好意思，我没有太多时间耽误在这上面。人民需要我，再见。",
    };
  }
}
