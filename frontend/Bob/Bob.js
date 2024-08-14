let bgm;
let currentNpcName = "Bob"; // NPC 名字
bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "../Music/NPC_talk.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; //  音量设置为 10%
let backupReplyIndex = 0; // 备用回复的索引

function displayInitialMessage() {
  const initialMessage = {
    en: "Ah, a visitor. I'm Bob, the union leader. We've had many new faces around here lately. Friend, do you have something on your mind?",
    zh: "啊，有访客啊。我是Bob，工会领袖。这段时间工会来了许多新面孔。朋友，你有什么心事吗？",
  };

  const message =
    currentLanguage === "en" ? initialMessage.en : initialMessage.zh;
  displayNPCReply(message);
}
function displayFinalMessage() {
  const finalMessage = {
    en: "Well, in that case, is there anything that Kane and I can do for you?",
    zh: "既然这样，有什么是我和 kane 能为你做的吗？",
  };

  const message = currentLanguage === "en" ? finalMessage.en : finalMessage.zh;
  displayNPCReply(message);
  updateSpecialDialogueStarted("Bob", true); // 更新特殊对话已经开始
}

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
  } else if (gameProgress.talkedToGuard && !gameProgress.talkedToBob) {
    // 如果已经与Guard对话，但是没有与Bob对话，说明是从Guard页面来的
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
    window.location.href = "../Emilia/Emilia.html"; // 跳转到默认地图页面
  });
});

// const scenes = [
//   {
//     text: {
//       en: [
//         "Okay, in that case, we will use the <span class='highlight' data-item='general_strike' data-image='../Items/general_strike.png'>general strike</span> to fight the government to the end.",
//       ],
//       zh: [
//         "好的，既然如此，我们会利用<span class='highlight' data-item='大罢工' data-image='../Items/general_strike.png'>大罢工</span>向政府抗争到底。",
//       ],
//     },
//     background: "./images/Office.png",
//     textStyle: "futuristic",
//     character: "./npc/Bob.png",
//   },
//   {
//     text: {
//       en: [
//         "General strike... it's risky, but it might be our only shot at fighting back. But I need to know, why are you involved in this? What's your stake in all of this?",
//       ],
//       zh: [
//         "大罢工...这是个艰难的决定，但有时正确的道路并不是最容易的。我们将团结一致，为了我们的未来，为了真相。让我们希望这能让政府认清现实。",
//       ],
//     },
//     background: "./images/Office.png",
//     textStyle: "futuristic",
//     character: "./npc/Bob.png",
//   },
// ];

const intentOne =
  "Player mentions T energy, come for T, or expresses interest in T energy or just say t or T";

const intentTwo =
  "Player mentions Kane, their relationship to Kane, or any information about Kane's past or death or his fathers' death";

const intentThree =
  "Player mentions Lisa, any support from others or just say Lisa";
// 检查用户是否表达了特定的意图

async function Check(intent, message) {
  // 为不同的意图设置不同的关键字
  const keywords = {
    [intentOne]: [
      "T",
      "T 能源" || "T 能量",
      "为了 T",
      "寻找 T",
      "为了 t 能源",
      "come for T",
      "looking for T",
      "here for T",
      "energy",
      "T energy",
      "t",
    ],
    [intentTwo]: [
      "son",
      "Kane is my father",
      "I'm Kane's son",
      "father",
      "Kane",
      "death",
      "Kane's death",
      "Kane's past",
      "儿子",
      "凯恩是我父亲",
      "我是凯恩的儿子",
      "父亲",
      "凯恩",
      "死亡",
      "凯恩的死亡",
      "凯恩的过去",
    ],
    [intentThree]: [
      "Lisa supports the strike",
      "Lisa is on our side",
      "Lisa is with us",
      "lisa",
      "利萨",
      "利萨站在我们这边",
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

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    //模拟 Intent 接口失败，强制抛出错误
    //throw new Error("Simulated Intent API failure");

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

  // 检查用户是否表达了特定的意图
  const intents = [intentOne, intentTwo, intentThree];
  const intentKeys = ["comeForK", "kaneRelation", "lisaSupport"];

  for (let i = 0; i < intents.length; i++) {
    if (!bobIntentExpress[intentKeys[i]]) {
      await Check(intents[i], message);
    }
  }

  console.log("Bob Intents expressed:", bobIntentExpress);

  // Check for special conditions before sending the message
  if (allBobIntentsExpressed() && !specialDialogueStarted.Bob) {
    //如果所有的意图都表达了，但是特殊对话没有开始
    displayFinalMessage();
    return;
  }

  if (allBobIntentsExpressed() && specialDialogueStarted.Bob) {
    //如果特殊对话已经开始
    handleFinalResponse(message);
    return;
  }

  //判断是否要启动备用的回复
  if (conversationCount[currentNpcName] >= 4) {
    const fixedReply = backupFixedReply();
    textContainer.innerHTML += `<p class="npc-message">Bob: ${
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
      charID: "c048d3c0-4eb9-11ef-83a5-42010a7be011", // 替换为你的角色 ID
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
  } finally {
    // Remove thinking indicator
    removeThinkingIndicator();
  }
}

function getNPCSpecificPrompt(npcName, userMessage) {
  switch (npcName) {
    case "Bob":
      return `You are Bob, the headquarters union leader in a role-playing scenario. You are a humble and kind person but currently anxious about the impact of new energy T. You have a strong sense of responsibility to the workers but also feel the pressure of public opinion and the potential benefits of T energy. You are caught between supporting your workers and recognizing the necessity of T energy, while being skeptical of the government's actions.

          When responding to the player, follow these specific guidelines:

          If the player does not mention T:

          Engage in general conversation. If after five exchanges the player hasn't mentioned T or T energy, conclude with: "I'm sorry, but our meeting time is up. I have work to do."
          If the player mentions Lisa's support (without mentioning being Kane's son, Kane's death, or T energy):

          Respond with: "Lisa sent you? Well, that's different. Maybe we can consider an event involving all workers... It's risky, but it might be our only chance to fight back. But I need to know, why are you getting involved? What's in it for you?"
          If the player mentions being Kane's son, Kane's death, or just Kane's death (without mentioning T energy, Lisa, or public support):

          Respond with: "Kane's death... there’s more? Oh my, I knew something was wrong. The government has deceived us all. But the public, they all support this new energy. Unless... unless we can reveal the truth to them. Tell me, who else knows about this?"
          If the player mentions T energy (without mentioning being Kane's son, Kane's death, Lisa's support, or public support):

          Respond with: "You see, we’ve discussed T energy countless times. The union's position... it’s not something that’s easy to change. But you seem to know some insider information. What else have you heard? Is there anything that can help our workers?"
          If the player mentions T energy and Lisa's support (without mentioning being Kane's son or Kane's death):

          Respond with: "Lisa sent you? Well, that’s different. Maybe we can organize an event for all workers to participate. It’s risky, but it could be our only chance to push back. But I need to know, why are you getting involved? What’s in it for you?"
          If the player mentions Lisa's support (without mentioning being Kane's son or T energy):

          Respond with: "Sir, I've been busy with the government's new policies. What are you doing here?"
          If the player mentions T energy and being Kane's son or mentions Kane's death (without mentioning Lisa's support):

          Respond with: "Alright, but you need to tell me who sent you. I need to know your purpose. What are you doing here?"
          Your tone should reflect your internal conflict:

          You cannot refuse a change that could completely transform the industry, but you are also worried about resisting public opinion. Show empathy and concern for workers and the public, but also convey a sense of helplessness about the inevitability of T energy. Each judgment should be based on all previous interactions with the player.
          The player ultimately needs to mention a general strike. If the player does not mention this, subtly guide them towards suggesting a general strike by saying something like: "We need to come up with a stronger way to implement this policy, involving all employees."

          Player's message:
          ${userMessage}

          Respond as Bob, keeping it simple and focused on the guidelines above. Do not over-respond.
      `;
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
  console.log("User final input for Bob:", userInput);

  if (!userInput.trim()) {
    console.error("User input is empty, not proceeding with check");
    return;
  }

  const isValid = await checkFinalResponse(userInput);
  // 定义记者证物品
  const general_strike = {
    item: "general_strike",
    image: "../Items/general_strike.png", // 请确保这个路径是正确的
  };
  if (isValid) {
    const successMessage = {
      en: "<span class='highlight' data-item='general_strike' data-image='../Items/general_strike.png'>General strike...</span> It's a difficult decision, but sometimes the right path isn't the easiest. We will stand together, for our future, for the truth. Let's hope this makes the government see reason.",
      zh: "<span class='highlight' data-item='general_strike' data-image='../Items/general_strike.png'>大罢工...</span>这是个艰难的决定，但有时正确的道路并不是最容易的。我们将团结一致，为了我们的未来，为了真相。让我们希望这能让政府认清现实。",
    };
    displayNPCReply(
      currentLanguage === "en" ? successMessage.en : successMessage.zh
    );
    addToInventory(general_strike.item, general_strike.image);
    gameProgress.talkedToBob = true;
    updateAllScenesCompleted("Bob", true);
    localStorage.setItem("gameProgress", JSON.stringify(gameProgress));
    setLastSigner(currentNpcName);
    //禁用 back to the map 按钮
    document.getElementById("back-main").disabled = true;
    setTimeout(() => {
      window.location.href = `../Room/room.html?lastSigner=${currentNpcName}`;
      //启用 back to the map button
      document.getElementById("back-main").disabled = false;
    }, 6000);
  } else {
    const hintMessage = {
      en: "We need to come up with a stronger way to fight against this policy, an activity that all worker partners can participate in. Do you have any suggestions?",
      zh: "我们需要想出一种更有力的方式来对抗这个政策，一种全体工人伙伴都能参与的活动。你有什么建议吗？",
    };
    displayNPCReply(currentLanguage === "en" ? hintMessage.en : hintMessage.zh);
    addToInventory(general_strike.item, general_strike.image);
  }
}

async function checkFinalResponse(response) {
  console.log("Checking final response:", response);
  const prompt = `
  Analyze the following user response in the context of a conversation about labor movements:

  User Response: "${response}"

  Determine if the user has expressed or strongly implied any of the following sentiments:
  1. Support for organizing or participating in a large-scale strike.
  2. Mention of a potential or ongoing large-scale strike.
  3. Advocacy for worker rights or actions that may lead to a strike.
  4. Mention of the big strike or general strike.

  The sentiment should be clearly expressed in a complete sentence or a comprehensive summary.

  If any of these sentiments are clearly expressed or strongly implied, respond with "true".
  If there's no clear indication of these sentiments, respond with "false".

  Provide your reasoning for the decision.
`;
  // Display thinking indicator
  displayThinkingIndicator();
  try {
    //模拟 Final Intent 接口失败，强制抛出错误
    // throw new Error("Simulated Final Intent API failure");
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
    "organize a general strike",
    "call for a general strike",
    "initiate a general strike",
    "support a general strike",
    "promote a general strike",
    "plan a general strike",
    "join a general strike",
    "participate in a general strike",
    "lead a general strike",
    "big strike",
    "general strike",
    "发动大罢工",
    "组织大罢工",
    "支持大罢工",
    "号召大罢工",
    "参与大罢工",
    "计划大罢工",
    "推动大罢工",
    "倡导大罢工",
    "大罢工",
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
const backupReplies = [
  {
    en: "Sir, I've been busy with the new policies the government is implementing. What brings you here?",
    zh: "先生，最近我正在为政府实施的新政策忙碌。您来这里有什么事吗？",
  },
  {
    en: "Greetings! I'm afraid I'll need to know your business here before I can let you proceed.",
    zh: "您好！恐怕在让您继续之前，我需要知道您来这里的目的。",
  },
  //这里可以优化，就一句话可能比较无聊
];

//备用的意图的方案
const backupIntentReplies = [
  {
    en: "Listen, we've been through this T energy debate countless times. The union's stance... it's not easily changed. But you seem to know things. What else have you heard? Anything that could help our workers?",
    zh: "听着，我们已经无数次讨论过T能源的问题了。工会的立场...不是轻易就能改变的。但你似乎知道一些内情。你还听说了什么？有什么能帮助我们工人的消息吗？",
  },
  {
    en: "Kane's death... there's more to it? God, I knew something wasn't right. The government lied to us all. But the public, they're all for this new energy. Unless... unless we can show them the truth. Tell me, who else knows about this?",
    zh: "Kane的死...还有隐情？天哪，我就知道有什么不对劲。政府欺骗了我们所有人。但是公众，他们都支持这种新能源。除非...除非我们能向他们揭示真相。告诉我，还有谁知道这件事？",
  },
  {
    en: "Lisa sent you? Well, that changes things. Maybe we can lead the workers to a general strike... it's risky, but it might be our only shot at fighting back. But I need to know, why are you involved in this? What's your stake in all of this?",
    zh: "Lisa派你来的？好吧，这就不一样了。或许我们可以引导群众大罢工...这样做风险很大，但可能是我们反击的唯一机会。但我需要知道，你为什么要参与其中？在这件事上，你有什么利害关系？",
  },
  {
    en: "I always suspected Kane's death wasn't so simple... and here we are. But you need to tell me who sent you to find me. I need to know your purpose. Why are you here?",
    zh: "我一直怀疑 kane 的死没有那么简单...果然如此，但是你需要告诉我是谁让你来找我的。我需要知道你的目的。你为什么在这里？",
  },
];

function backupFixedReply() {
  // //两个接口都失败时，显示固定的回复
  // const intentKeys = ["comeForK", "kaneRelation", "lisaSupport"];
  let lastExpressedIntent = -1;

  //根据表达的意图来返回相应的回复
  if (
    bobIntentExpress.lisaSupport &&
    !bobIntentExpress.kaneRelation &&
    !bobIntentExpress.comeForK
  ) {
    lastExpressedIntent = 2;
  } else if (
    bobIntentExpress.kaneRelation &&
    !bobIntentExpress.comeForK &&
    !bobIntentExpress.lisaSupport
  ) {
    lastExpressedIntent = 1;
  } else if (
    bobIntentExpress.comeForK &&
    !bobIntentExpress.kaneRelation &&
    !bobIntentExpress.lisaSupport
  ) {
    lastExpressedIntent = 0;
  } else if (
    bobIntentExpress.comeForK &&
    bobIntentExpress.kaneRelation &&
    !bobIntentExpress.lisaSupport
  ) {
    lastExpressedIntent = 3;
  } else if (
    bobIntentExpress.comeForK &&
    !bobIntentExpress.kaneRelation &&
    bobIntentExpress.lisaSupport
  ) {
    lastExpressedIntent = 2;
  } else if (
    !bobIntentExpress.comeForK &&
    bobIntentExpress.kaneRelation &&
    bobIntentExpress.lisaSupport
  ) {
    lastExpressedIntent = -1;
  }

  // 根据最后表达的意图返回相应的回复
  if (lastExpressedIntent !== -1) {
    return backupIntentReplies[lastExpressedIntent];
  }

  // 如果没有表达任何意图，随机返回默认回复
  const random = Math.floor(Math.random() * backupReplies.length);
  return backupReplies[random];
}
