let bgm;
let currentNpcName = "Lisa"; // NPC 名字
bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "../Music/NPC_talk.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; //  音量设置为 10%
let backupReplyIndex = 0; // 备用回复的索引

function displayInitialMessage() {
  const initialMessage = {
    en: "Hello there! I'm Lisa, an investigative journalist. I'm always on the lookout for exciting news stories. Do you have any interesting information to share?",
    zh: "你好！我是Lisa，一名调查记者。我一直在寻找令人兴奋的新闻故事。你有什么有趣的信息要分享吗？",
  };

  const message =
    currentLanguage === "en" ? initialMessage.en : initialMessage.zh;
  displayNPCReply(message);
}

function displayFinalMessage() {
  const finalMessage = {
    en: "Wow, this is big news! Finally, as someone directly involved, do you have anything to say about the whole situation?",
    zh: "这下可有大新闻了！最后，我能问你，作为当事人，对整件事有什么要说的吗？",
  };

  const message = currentLanguage === "en" ? finalMessage.en : finalMessage.zh;
  displayNPCReply(message);
  updateSpecialDialogueStarted("Lisa", true);
}

document.addEventListener("DOMContentLoaded", () => {
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
      handleMessage(userMessage);
      userInput.value = "";
    }
  });

  userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendMessageButton.click();
    }
  });

  //如果说 ki 还没签字的话，也不能和 lisa 交谈
  if (signatures["Ki"] === null) {
    startFirstDialogue();
  } else {
    // 如果还没有和Lisa交谈过，显示初始消息
    displayInitialMessage();
  }

  //判断是否这个对话已经结束 如果结束了，就显示 new scene 的对话
  if (gameProgress.talkedToLisa) {
    startNewSceneDialogue();
  }

  // 处理 back to the map 按钮点击事件
  const backMainButton = document.getElementById("back-main");
  backMainButton.addEventListener("click", () => {
    window.location.href = "../Emilia/Emilia.html"; // 跳转到默认地图页面
  });
});

const intent =
  " the user is Ki, so that the user should expressed that his father is Kane or any relationship with Kane or any information about his father: Kane";

// 检查用户是否表达了特定的意图
async function Check(intent, message) {
  const keywords = [
    "My father Kane's death",
    "father death",
    "father's death",
    "father:kane's death",
    "我父亲凯恩的死",
    "父亲去世",
    "父亲的死",
    "父亲：凯恩的死",
    "我父亲凯恩的死",
    "truth of My father: Kane's death",
    "father's death",
    "Kane is my father", // 用于检查玩家是否表达了与 Kane 有关的信息
    "真相",
    "死",
    "父亲去世",
  ]; // 关键字列表

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

    //  模拟 Intent 接口失败，强制抛出错误
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
      // 重置对话计数
      resetConversationCount();
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

  // 检查特殊条件，现在是两个条件都满足才会触发最后特殊对话
  if (checkSpecialCondition() && !specialDialogueStarted.Lisa) {
    //如果 special dialogue 是 false 的话就会启动这个 display 的方法
    displayFinalMessage();
    //display 一次之后就会设置为 true 了
    return;
  }

  //但是如果满足两个特殊条件，就调用新的 final response 的方法
  if (usedItems[currentNpcName] && intentExpressed.Lisa) {
    handleFinalResponse(message);
    return;
  }

  // 检查是否应该触发自动回复
  if (shouldTriggerAutoReply(currentNpcName)) {
    const fixedReply = getFixedReply();
    displayNPCReply(currentLanguage === "en" ? fixedReply.en : fixedReply.zh);
    return;
  }

  // Display thinking indicator
  displayThinkingIndicator();

  // 尝试发送消息给 NPC
  try {
    await sendMessageToNPC(message);
  } catch (error) {
    console.error("Error in handleMessage:", error);
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
      charID: "1a0d3c90-4eae-11ef-abf5-42010a7be011", // 替换为你的角色 ID
      sessionID: npcSessionIDs[currentNpcName] || "-1",
      voiceResponse: true,
    };

    // 模拟 ConvAI 接口失败，强制抛出错误
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
        // const translatedReply = await translateText(npcReply, 'zh-CN');
        console.log("Translated Reply:", translatedReply);
        displayNPCReply(translatedReply.data, audioReply);
      } catch (error) {
        console.error("Error in translation, using original reply:", error);
        displayNPCReply(npcReply, audioReply);
      }
    }
  } catch (error) {
    console.error("Error in sendMessageToNPC:", error);
    // 在这里调用备用响应生成函数
    await generateBackupResponse(message);
  }
}

function getNPCSpecificPrompt(npcName, userMessage) {
  switch (npcName) {
    case "Lisa":
      return `You are Lisa, a dedicated and ambitious investigative journalist. Your sharp eye and keen sense for news have made you a respected figure in the industry. You are determined to uncover important stories that serve the public interest. You are clever, resourceful, and always seeking significant news to inform the public and uphold journalistic integrity.

        Guidelines for your responses:
        1. When interacting with the player (Ki), show genuine interest in their information without being manipulative.
        2. Ask probing questions to understand the full story, but respect ethical boundaries.
        3. Express enthusiasm for potentially important news, but also show concern for verifying facts and protecting sources.
        4. If the player mentions news about T energy, show particular interest but remain skeptical until you can verify the information. However, if the player has not mentioned their father Kane’s death, you can express doubt, such as, "I'm intrigued by what you've shared, but can you clarify where this information comes from?"
        5. If the player mentions Kane but not that Kane is their father, you can ask, "Who is Kane? How is his death related to you?"
        6. Your tone should be professional, curious, and slightly eager, but not manipulative or unethical.
        7. If the player mentions the truth about Kane’s death or any information about his death and mentions that Kane is their father, you need to show surprise and excitement. For example, "So Kane was your father? His death has always been a mystery. Do you have anything to substantiate this truth?"

        Possible dialogue starters:
        That's an interesting piece of information. Can you tell me more about where you learned this?
        I'm intrigued by what you've shared. What led you to this discovery?
        This could be a significant story. How did you come across this information?
        I'd like to understand more about this. What can you tell me about your sources?
        This is fascinating. Can you provide any more details or context?

        Each judgment should be based on all your remembered interactions with the user. 

        Remember, your goal is to uncover the truth and report important stories, always maintaining journalistic ethics and integrity.

        The user's message is: "${userMessage}"

        Respond as Lisa would and keep simple,don;t respond too long, based on the above guidelines and the content of the user's message.
        `;
  }
}

// 调用 generate 接口获取 NPC 的回复
async function generateBackupResponse(message) {
  const prompt = getNPCSpecificPrompt(currentNpcName, message);
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

    // Display thinking indicator
    displayThinkingIndicator();

    if (!response.ok) {
      throw new Error("Network response was not ok for backup response");
    }

    const data = await response.json();
    console.log("Backup NPC Response:", data);

    let npcReply = data.data;
    console.log("Backup NPC Reply:", npcReply);

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
    const fixedReply = getFixedReply();
    displayNPCReply(currentLanguage === "en" ? fixedReply.en : fixedReply.zh);
  } finally {
    // Remove thinking indicator
    removeThinkingIndicator();
  }
}

function displayNPCReply(reply, audioReply) {
  // 更新对话计数
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

  // 播放音频（如果存在）
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

function checkSpecialCondition() {
  console.log(
    "Checking special condition:",
    intentExpressed.Lisa,
    usedItems[currentNpcName]
  );
  // 检查条件是否满足且特殊对话尚未开始
  return intentExpressed.Lisa && usedItems[currentNpcName];
}

async function handleFinalResponse(userInput) {
  console.log("User final input:", userInput);

  if (!userInput.trim()) {
    console.error("User input is empty, not proceeding with check");
    return;
  }
  const isValid = await checkFinalResponse(userInput);
  // 定义记者证物品
  const pressCard = {
    item: "press_card",
    image: "../Items/press_card.png", // 请确保这个路径是正确的
  };
  if (isValid) {
    const successMessage = {
      en: "Thank you for your assistance, this article will be fantastic. By the way, here's a tip: go talk to Bob at the union, he might be interested. They're considering a big strike. <span class='highlight' data-item='press_card' data-image='../Items/press_card.png'>Oh, and take this press card. It might come in handy.</span>",
      zh: "感谢你的协助，这篇文章会很精彩。顺便给你个提示，去工会找鲍勃谈谈，他可能会感兴趣的，他们正考虑大罢工。<span class='highlight' data-item='press_card' data-image='../Items/press_card.png'>对了，拿着这张记者证。可能会派上用场。</span>",
    };
    displayNPCReply(
      currentLanguage === "en" ? successMessage.en : successMessage.zh
    );
    addToInventory(pressCard.item, pressCard.image);
    gameProgress.talkedToLisa = true;
    updateAllScenesCompleted("Lisa", true);
    localStorage.setItem("gameProgress", JSON.stringify(gameProgress));
    setLastSigner(currentNpcName);
    //disable back to the map button 
    document.getElementById("back-main").disabled = true;
    setTimeout(() => {
      window.location.href = `../Room/room.html?lastSigner=${currentNpcName}`;
      //启用 back to the map button
      document.getElementById("back-main").disabled = false;
    }, 6000);
  } else {
    const hintMessage = {
      en: "Interesting perspective. But as someone directly involved, what's your view on the government's policy regarding T energy exploitation?",
      zh: "有趣的观点。但作为当事人，你对政府关于T能源开采的政策有什么看法呢？",
    };
    displayNPCReply(currentLanguage === "en" ? hintMessage.en : hintMessage.zh);
    addToInventory(pressCard.item, pressCard.image);
  }
}

async function checkFinalResponse(response) {
  console.log("Checking final response:", response);
  const prompt = `
    Analyze the following user response in the context of a conversation about energy policies:

    User Response: "${response}"

    Determine if the user has expressed or strongly implied any of the following sentiments:
    1. Support for stopping/banning/discontinuing the use of sustainable energy T
    2. Support for returning to or continuing the use of traditional energy sources
    3. Opposition to sustainable energy in favor of traditional energy sources

    The sentiment should be clearly expressed in a complete sentence or a comprehensive summary.

    If any of these sentiments are clearly expressed or strongly implied, respond with "true".
    If there's no clear indication of these sentiments, respond with "false".

    Provide your reasoning for the decision.
  `;

  // Display thinking indicator
  displayThinkingIndicator();

  try {
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
    "stop t energy",
    "ban t energy",
    "discontinue t energy",
    "return to traditional energy",
    "continue traditional energy",
    "against sustainable energy",
    "oppose sustainable energy",
    "prefer traditional energy",
    "禁止T能源",
    "停止T能源",
    "不再使用T能源",
    "回归传统能源",
    "继续使用传统能源",
    "反对可持续能源",
    "不支持可持续能源",
    "倾向于传统能源"
  ];

  const lowercaseResponse = response.toLowerCase();
  return keywords.some(keyword => lowercaseResponse.includes(keyword));
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
    en: "I'm looking for something more exciting, more sensational, like, hmm... the hottest topic right now—the K energy issue.",
    zh: "我希望有一些更有趣、更轰动的新闻，比如，嗯……关于目前最火热的能源议题, T能源的。",
  },
  {
    en: "Hmm, that does sound interesting, but how can I trust you? Unless... you're an insider?",
    zh: "嗯，这确实很有趣，可是我怎么能相信你呢？除非……你是个内部人士？",
  },
  {
    en: "The news you provided is interesting, but unfortunately, I can't verify its authenticity. That makes it useless to me. I have other things to attend to; we'll talk next time.",
    zh: "你提供的新闻很有意思，但可惜我没办法验证它的真实性，这对我来说就没有用。我还有事，我们下次再聊。",
  },
  {
    en: "Is there anything else or any news that might interest me?",
    zh: "你还有什么东西或者新闻可以让我感兴趣吗？",
  },
];

function backupFixedReply() {
  const reply = backupReplies[backupReplyIndex];
  backupReplyIndex = (backupReplyIndex + 1) % backupReplies.length; // 循环选择备用回复
  return reply;
}

// 自定义自动回复逻辑，现在次数是用完才会出现自动回复，成功调用才会增加对话次数
function getFixedReply() {
  if (!usedItems[currentNpcName] && !intentExpressed[currentNpcName]) {
    return {
      en: "Hmm, that does sound interesting, but how can I trust you? Unless... you're an insider?",
      zh: "嗯，这确实很有趣，可是我怎么能相信你呢？除非……你是个内部人士？",
    };
  }
  if (intentExpressed[currentNpcName] && !usedItems[currentNpcName]) {
    return {
      en: "So, you're related to Kane, huh? That's interesting. But do you have anything to offer me?",
      zh: "原来你是凯恩的家人，很有趣。但你没有什么东西可以给我吗？",
    };
  }
  if (!intentExpressed[currentNpcName] && usedItems[currentNpcName]) {
    return {
      en: "The news you provided is interesting, but what is your relationship with Kane? Why are you telling me this? I can't verify its authenticity, so it's useless to me. I have other things to attend to; we'll talk next time.",
      zh: "你提供的新闻很有意思，但是你和Kane 有什么关系？你为什么告诉我？ 我没办法验证它的真实性，这对我来说就没有用。我还有事，我们下次再聊。",
    };
  }
  return {
    en: "Is there anything else or any news that might interest me?",
    zh: "你还有什么东西或者新闻可以让我感兴趣吗？",
  };
}
