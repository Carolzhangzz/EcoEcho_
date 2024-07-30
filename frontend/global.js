let usedItems = {};
let currentLanguage = getLanguage() || "en";
let gameProgress = {
  talkedToLisa: false,
  talkedToGuard: false,
  talkedToBob: false,
};

let intentExpressed = {
  Lisa: false,
  Bob: false,
  Guard: false,
  Johnathan: false,
};

let conversationCount = {
  Lisa: 0,
  Bob: 0,
  Guard: 0,
  Johnathan: 0,
};

let metEmilia = {
  Ki: false,
  Lisa: false,
  Bob: false,
  Johnathan: false,
};

let signatures = {
  Ki: null,
  Lisa: null,
  Bob: null,
  Johnathan: null,
};

// 添加 lastSigner 变量
let lastSigner = null;

let allScenesCompleted = {
  Lisa: false,
  Guard: false,
  Bob: false,
  Johnathan: false,
};

let newSceneCompleted = {
  Lisa: false,
  Guard: false,
  Bob: false,
  Johnathan: false,
};

// 从 localStorage 加载数据
const loadDataFromLocalStorage = (key, defaultValue) => {
  const savedData = localStorage.getItem(key);
  if (savedData !== null) {
    try {
      const parsedData = JSON.parse(savedData);
      console.log(`Loaded ${key} from localStorage:`, parsedData);

      // 对于 conversationCount，进行额外的格式检查
      if (key === "conversationCount") {
        const validKeys = ["Lisa", "Guard", "Bob", "Johnathan"];
        const cleanedData = {};
        for (const validKey of validKeys) {
          cleanedData[validKey] =
            typeof parsedData[validKey] === "number" ? parsedData[validKey] : 0;
        }
        return cleanedData;
      }

      // 对于 allScenesCompleted 和 newSceneCompleted，进行额外的格式检查
      if (key === "allScenesCompleted" || key === "newSceneCompleted") {
        const validKeys = ["Lisa", "Guard", "Bob", "Johnathan"];
        const cleanedData = {};
        for (const validKey of validKeys) {
          cleanedData[validKey] = parsedData[validKey] === true;
        }
        return cleanedData;
      }

      // 对于 metEmilia，进行额外的格式检查
      if (key === "metEmilia") {
        const validKeys = ["Ki", "Lisa", "Bob", "Johnathan"];
        const cleanedData = {};
        for (const validKey of validKeys) {
          cleanedData[validKey] = parsedData[validKey] === true;
        }
        return cleanedData;
      }

      // 对于 signatures，进行额外的格式检查
      if (key === "signatures") {
        const validKeys = ["Ki", "Lisa", "Bob", "Johnathan"];
        const cleanedData = {};
        for (const validKey of validKeys) {
          cleanedData[validKey] =
            parsedData[validKey] === null
              ? null
              : parsedData[validKey] === false
              ? false
              : typeof parsedData[validKey] === "number"
              ? parsedData[validKey]
              : null;
        }
        return cleanedData;
      }

      return parsedData;
    } catch (e) {
      console.log(
        `Error parsing ${key} from localStorage, using default value`
      );
      return defaultValue;
    }
  } else {
    console.log(`No saved ${key} found in localStorage.`);
    return defaultValue;
  }
};

// 加载所有数据
allScenesCompleted = loadDataFromLocalStorage(
  "allScenesCompleted",
  allScenesCompleted
);
newSceneCompleted = loadDataFromLocalStorage(
  "newSceneCompleted",
  newSceneCompleted
);
gameProgress = loadDataFromLocalStorage("gameProgress", gameProgress);
usedItems = loadDataFromLocalStorage("usedItems", usedItems);
intentExpressed = loadDataFromLocalStorage("intentExpressed", intentExpressed);
conversationCount = loadDataFromLocalStorage(
  "conversationCount",
  conversationCount
);
metEmilia = loadDataFromLocalStorage("metEmilia", metEmilia);
signatures = loadDataFromLocalStorage("signatures", signatures);
lastSigner = loadDataFromLocalStorage("lastSigner", lastSigner);

// Count 的更新函数
function updateConversationCount(npcName, count) {
  conversationCount[npcName] = count;
  localStorage.setItem("conversationCount", JSON.stringify(conversationCount));
}
// MetEmilia的更新函数
function updateMetEmilia(name, value) {
  metEmilia[name] = value;
  localStorage.setItem("metEmilia", JSON.stringify(metEmilia));
}
// 更新函数
function updateAllScenesCompleted(name, value) {
  allScenesCompleted[name] = value;
  localStorage.setItem(
    "allScenesCompleted",
    JSON.stringify(allScenesCompleted)
  );
}
function updateNewSceneCompleted(name, value) {
  newSceneCompleted[name] = value;
  localStorage.setItem("newSceneCompleted", JSON.stringify(newSceneCompleted));
}

//设置 lastSigner 的函数
function setLastSigner(signer) {
  if (typeof signer === "string" && signer.trim() !== "") {
    lastSigner = signer.trim();
    localStorage.setItem("lastSigner", JSON.stringify(signer.trim()));
  } else {
    console.error("Invalid lastSigner value:", signer);
  }
}

// 获取 lastSigner 的函数
function getLastSigner() {
  const storedSigner = localStorage.getItem("lastSigner");
  try {
    const parsedSigner = JSON.parse(storedSigner);
    console.log("Parsed last signer:", parsedSigner);
    return typeof parsedSigner === "string" ? parsedSigner : null;
  } catch (e) {
    console.error("Error parsing lastSigner:", e);
    return null;
  }
}

// 从 localStorage 加载背包内容
function loadInventory() {
  const inventory = JSON.parse(localStorage.getItem("gameInventory")) || [];
  inventoryItems.innerHTML = "";
  inventory.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<img src="${item.image}" alt="${item.name}" style="width: 30px; height: 30px;"> ${item.name}`;
    li.style.cursor = "pointer";
    if (typeof currentNpcName !== "undefined") {
      li.addEventListener("click", () => promptShareItem(item, currentNpcName)); // 使用全局变量 currentNpcName
    }
    inventoryItems.appendChild(li);
  });
}

// 清除 lastSigner 的函数
function clearLastSigner() {
  lastSigner = null;
  localStorage.removeItem("lastSigner");
}

//重置对话计数的方法
function resetConversationCount() {
  conversationCount = {
    Lisa: 0,
    Bob: 0,
    Guard: 0,
    Johnathan: 0,
  };
  localStorage.setItem("conversationCount", JSON.stringify(conversationCount));
}

// 重置游戏进度
function resetGame() {
  const resetObject = (obj, value) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = value;
      }
    }
  };

  localStorage.removeItem("gameProgress");
  resetObject(gameProgress, false);
  localStorage.setItem("gameProgress", JSON.stringify(gameProgress));

  usedItems = {};
  localStorage.setItem("usedItems", JSON.stringify(usedItems));

  resetObject(intentExpressed, false);
  localStorage.setItem("intentExpressed", JSON.stringify(intentExpressed));

  resetConversationCount();

  resetObject(conversationCount, 0);
  localStorage.setItem("conversationCount", JSON.stringify(conversationCount));

  resetObject(metEmilia, false);
  localStorage.setItem("metEmilia", JSON.stringify(metEmilia));

  resetObject(signatures, null);
  localStorage.setItem("signatures", JSON.stringify(signatures));

  // 重置 allScenesCompleted
  resetObject(allScenesCompleted, false);
  localStorage.setItem(
    "allScenesCompleted",
    JSON.stringify(allScenesCompleted)
  );

  // 重置 newSceneCompleted
  resetObject(newSceneCompleted, false);
  localStorage.setItem("newSceneCompleted", JSON.stringify(newSceneCompleted));

  // 清除 lastSigner
  clearLastSigner();

  window.location.href = "/Main.html";
}

// 全局背包系统
const inventoryIcon = document.getElementById("inventory-icon");
const inventoryPopup = document.getElementById("inventory-popup");
const inventoryItems = document.getElementById("inventory-items");

// 提示是否要分享物品，并且如果某个 NPC 已经收到过物品，则不能再次分享
function promptShareItem(item, npcName) {
  if (usedItems[npcName]) {
    showAlert(
      `${npcName} has already received an item and cannot be given another.`
    );
    return;
  }

  showConfirm(
    `Do you want to share this ${item.name} with ${npcName}?`,
    (confirmed) => {
      if (confirmed) {
        usedItems[npcName] = true;
        localStorage.setItem("usedItems", JSON.stringify(usedItems));
        showAlert(`${item.name} has been shared with ${npcName}.`);
        console.log("Used items:", usedItems);
        removeFromInventory(item.name);

        // 特殊处理 Guard 的情况
        if (npcName !== "Guard") {
          // 不等于 Guard 的情况下，哪怕没有意图，也可以重置
          updateConversationCount(npcName, conversationCount[npcName] + 1);
        } else {
          // 对于 Guard，只有在已经表达意图的情况下才重置对话计数
          if (intentExpressed[npcName]) {
            resetConversationCount(npcName);
          }
          // 可以在这里添加一些特殊的 Guard 逻辑，如果需要的话
        }
        // 如果需要，可以在这里添加其他 NPC 特定的逻辑
      }
    }
  );
}

// 显示自定义 alert 框
function showAlert(message) {
  const alertBox = document.createElement("div");
  alertBox.className = "custom-alert";
  alertBox.innerHTML = `
    <p>${message}</p>
    <button id="alert-ok">OK</button>
  `;
  document.body.appendChild(alertBox);
  document
    .getElementById("alert-ok")
    .addEventListener("click", () => alertBox.remove());
}

// 显示自定义 confirm 框
function showConfirm(message, callback) {
  const confirmBox = document.createElement("div");
  confirmBox.className = "custom-alert";
  confirmBox.innerHTML = `
    <p>${message}</p>
    <button id="confirm-yes">Yes</button>
    <button id="confirm-no">No</button>
  `;

  function confirm(result) {
    document.body.removeChild(confirmBox);
    callback(result);
  }

  document.body.appendChild(confirmBox);
  document
    .getElementById("confirm-yes")
    .addEventListener("click", () => confirm(true));
  document
    .getElementById("confirm-no")
    .addEventListener("click", () => confirm(false));
}

// 从背包中移除物品
function removeFromInventory(itemName) {
  let inventory = JSON.parse(localStorage.getItem("gameInventory")) || [];
  inventory = inventory.filter((item) => item.name !== itemName);
  localStorage.setItem("gameInventory", JSON.stringify(inventory));
  loadInventory();
}

// 清空背包
function clearInventory() {
  showConfirm(
    "Are you sure you want to clear your bag? This will reset your game progress.你确定你要清空背包吗? 这会重置你的游戏进度。",
    (confirmed) => {
      if (confirmed) {
        localStorage.removeItem("gameInventory");
        loadInventory();
        resetGame();
        showAlert(
          "Your bag has been cleared. You can restart the game now.你的背包被清空了, 你可以重新开始游戏。"
        );
      }
    }
  );
}

// 添加物品到背包
function addToInventory(item, itemImage) {
  const inventory = JSON.parse(localStorage.getItem("gameInventory")) || [];
  if (!inventory.some((i) => i.name === item)) {
    inventory.push({ name: item, image: itemImage });
    localStorage.setItem("gameInventory", JSON.stringify(inventory));
    loadInventory();
    flashInventoryIcon();
  }
}

// 背包图标闪烁效果
function flashInventoryIcon() {
  inventoryIcon.classList.add("flash");
  setTimeout(() => {
    inventoryIcon.classList.remove("flash");
  }, 500);
}

// 显示/隐藏背包
inventoryIcon.addEventListener("click", () => {
  inventoryPopup.classList.toggle("hidden");
  if (!inventoryPopup.classList.contains("hidden")) {
    inventoryPopup.style.display = "block";
  } else {
    setTimeout(() => {
      inventoryPopup.style.display = "none";
    }, 500); // 配合过渡时间
  }
});

// 显示弹出窗口并添加物品到背包
function showPopup(item) {
  const popup = document.createElement("div");
  const itemImage = item.dataset.image;
  popup.className = "popup";
  popup.innerHTML = `<img src="${itemImage}" alt="${item.dataset.item}" class="popup-item">`;
  document.body.appendChild(popup);

  const itemRect = item.getBoundingClientRect();
  const iconRect = inventoryIcon.getBoundingClientRect();

  popup.style.left = `${itemRect.left + window.scrollX}px`;
  popup.style.top = `${itemRect.top + window.scrollY}px`;
  popup.style.position = "absolute";
  popup.style.transition = "transform 1s ease, opacity 1s ease";

  setTimeout(() => {
    popup.style.transform = `translate(${
      iconRect.left - itemRect.left + (iconRect.width / 2 - 25)
    }px, ${
      iconRect.top - itemRect.top + (iconRect.height / 2 - 25)
    }px) scale(0.5)`;
    popup.style.opacity = "0";
  }, 100);

  popup.addEventListener("transitionend", () => {
    if (popup.parentElement) {
      document.body.removeChild(popup);
      addToInventory(item.dataset.item, itemImage);
    }
  });
}

// 为高亮文本添加点击事件
function addHighlightListeners() {
  document.querySelectorAll(".highlight").forEach((item) => {
    item.addEventListener("click", () => showPopup(item));
  });
}

// 初始加载背包
loadInventory();

// 在 DOMContentLoaded 事件中添加高亮监听器
document.addEventListener("DOMContentLoaded", () => {
  addHighlightListeners();
});

// 设置语言
function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("language", lang);
  document.dispatchEvent(new Event("languageChanged"));
}

// 获取当前语言
function getLanguage() {
  return localStorage.getItem("language") || "en"; // 默认英语
}

// Music toggle logic
const musicToggle = document.getElementById("music-toggle");
let isMuted = false;

musicToggle.addEventListener("click", () => {
  if (isMuted) {
    bgm.muted = false;
    musicToggle.textContent = "🔊";
    isMuted = false;
  } else {
    bgm.muted = true;
    musicToggle.textContent = "🔇";
    isMuted = true;
  }
});

const languageToggle = document.getElementById("language-toggle");
document.addEventListener("DOMContentLoaded", () => {
  currentLanguage = getLanguage();
  languageToggle.textContent = currentLanguage === "en" ? "EN" : "CH";

  languageToggle.addEventListener("click", () => {
    setLanguage(currentLanguage === "en" ? "zh" : "en");
    languageToggle.textContent = currentLanguage === "en" ? "EN" : "CH";
  });
});


// 获取翻译后的回复
async function generateResponse(npcReply) {
  try {
    const prompt = `Translate the following English text into Simplified Chinese:

    "${npcReply}"

    Instructions:
    1. Provide only the translated text, without any additional explanations or comments.
    2. Maintain the original meaning, tone, and nuances, including any humor if present.
    3. Ensure the translation sounds natural in Chinese.
    4. Do not use quotation marks in the translation.
    5. If there are any names or technical terms, transliterate them appropriately.

    Translated text:`;

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

// 自动回复触发条件函数
function shouldTriggerAutoReply(currentNpcName) {
  const triggerConditions = {
    Lisa: {
      noIntentNoItem: 2,
      intentNoItem: 3,
      noIntentItem: 3 
    },
    Guard: {
      noIntentNoItem: 2,
      intentNoItem: 2,
      noIntentItem: 2
    },
    Bob: {
      noIntentNoItem: 3,
      intentNoItem: 5,
      noIntentItem: 5
    },
    Johnathan: {
      noIntentNoItem: 4,
      intentNoItem: 6,
      noIntentItem: 6
    }
    // 可以为其他 NPC 添加更多条件
  };

  const npcConditions = triggerConditions[currentNpcName] || triggerConditions.Lisa; // 默认使用 Lisa 的条件

  if (
    (conversationCount[currentNpcName] >= npcConditions.noIntentNoItem &&
      !usedItems[currentNpcName] &&
      !intentExpressed[currentNpcName]) ||
    (conversationCount[currentNpcName] >= npcConditions.intentNoItem &&
      intentExpressed[currentNpcName] &&
      !usedItems[currentNpcName]) ||
    (conversationCount[currentNpcName] >= npcConditions.noIntentItem &&
      !intentExpressed[currentNpcName] &&
      usedItems[currentNpcName])
  ) {
    return true;
  }
  return false;
}

// 添加签名
function addSignature(name, signed) {
  signatures[name] = signed ? Date.now() : false;
  localStorage.setItem("signatures", JSON.stringify(signatures));
}
