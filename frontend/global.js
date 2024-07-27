let usedItems = {};

 // 从 localStorage 加载游戏进度
 const savedProgress = JSON.parse(localStorage.getItem("gameProgress"));
 if (savedProgress) {
   gameProgress = savedProgress;
   console.log("Loaded game progress from localStorage:", gameProgress);
 } else {
   console.log("No saved game progress found in localStorage.");
 }

 // 从 localStorage 加载 usedItems
 const savedUsedItems = JSON.parse(localStorage.getItem("usedItems"));
 if (savedUsedItems) {
   usedItems = savedUsedItems;
   console.log("Loaded used items from localStorage:", usedItems);
 } else {
   console.log("No saved used items found in localStorage.");
 }

// 从 localStorage 加载背包内容
function loadInventory() {
  const inventory = JSON.parse(localStorage.getItem("gameInventory")) || [];
  inventoryItems.innerHTML = "";
  inventory.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<img src="${item.image}" alt="${item.name}" style="width: 30px; height: 30px;"> ${item.name}`;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => promptShareItem(item, currentNpcName)); // 使用全局变量 currentNpcName
    inventoryItems.appendChild(li);
  });
}

// 重置游戏进度
function resetGame() {
  localStorage.removeItem('gameProgress');
  for (let key in gameProgress) {
    if (gameProgress.hasOwnProperty(key)) {
      gameProgress[key] = false;
    }
  }
  localStorage.setItem('gameProgress', JSON.stringify(gameProgress));

  // 重置 usedItems 对象
  usedItems = {};
  localStorage.setItem('usedItems', JSON.stringify(usedItems));
}


// 全局背包系统
const inventoryIcon = document.getElementById("inventory-icon");
const inventoryPopup = document.getElementById("inventory-popup");
const inventoryItems = document.getElementById("inventory-items");

// 提示是否要分享物品
function promptShareItem(item, npcName) {
  if (confirm(`Do you want to share this ${item.name} with ${npcName}?`)) {
    usedItems[npcName] = true;
    localStorage.setItem('usedItems', JSON.stringify(usedItems));
    alert(`${item.name} has been shared with ${npcName}.`);
    console.log("Used items:", usedItems);
    removeFromInventory(item.name);
  }
}

// 从背包中移除物品
function removeFromInventory(itemName) {
  let inventory = JSON.parse(localStorage.getItem("gameInventory")) || [];
  inventory = inventory.filter(item => item.name !== itemName);
  localStorage.setItem("gameInventory", JSON.stringify(inventory));
  loadInventory();
}

// 清空背包
function clearInventory() {
  localStorage.removeItem("gameInventory");
  loadInventory();
}

// 确保清空背包按钮正常工作
document.getElementById("clear-inventory").addEventListener("click", () => {
  if (
    confirm(
      "Are you sure you want to clear your bag? This will reset your game progress.你确定你要清空背包吗? 这会重置你的游戏进度。",
    )
  ) {
    clearInventory();
    resetGame();
    alert("Your bag has been cleared. You can restart the game now.你的背包被清空了, 你可以重新开始游戏。");
  }
});

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

// 导出全局函数
window.addToInventory = addToInventory;
window.showPopup = showPopup;
window.addHighlightListeners = addHighlightListeners;
window.clearInventory = clearInventory;

// 在 DOMContentLoaded 事件中添加高亮监听器
document.addEventListener("DOMContentLoaded", () => {
  addHighlightListeners();
});

// 设置语言
function setLanguage(lang) {
  localStorage.setItem('language', lang);
}

// 获取当前语言
function getLanguage() {
  return localStorage.getItem('language') || 'en'; // 默认英语
}

// 导出这些函数
window.setLanguage = setLanguage;
window.getLanguage = getLanguage;


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

languageToggle.addEventListener("click", () => {
  if (currentLanguage === "en") {
    currentLanguage = "zh";
    setLanguage("zh");
    languageToggle.textContent = "CH";
  } else {
    currentLanguage = "en";
    setLanguage("en");
    languageToggle.textContent = "EN";
  }
});

// 在初始化时，从 localStorage 获取语言设置
currentLanguage = getLanguage();
languageToggle.textContent = currentLanguage === "en" ? "EN" : "CH";