document.addEventListener("DOMContentLoaded", () => {
  const textContainer = document.getElementById("text-container");
  const nextSceneButton = document.getElementById("next-scene");
  const backButton = document.getElementById("back-to-main");
  const musicToggle = document.getElementById("music-toggle");
  const languageToggle = document.getElementById("language-toggle");
  const bgm = document.getElementById("bgm");

  let currentLine = 0;
  const dialogues = [
    {
      background: "./images/dusty_room.png",
      textStyle: "futuristic",
      en: "You find a note that reveals Kane's past.",
      zh: "你得到了一个便条,上面记载着Kane的过去。",
    },
    {
      background: "./images/dimly_lit_room.png",
      textStyle: "futuristic",
      en: "You have obtained <span class='highlight' data-item='truth' data-image='../items/truth.png'>the truth about the death of KI's father, Kane</span>.",
      zh: "你得到了<span class='highlight' data-item='truth' data-image='../items/truth.png'>关于KI父亲Kane死亡的真相</span>。",
    },
  ];

  function typeWriter(element, text, callback) {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        if (text.substr(index, 6) === "<span ") {
          const endIndex = text.indexOf("</span>", index) + 7;
          element.innerHTML += text.substring(index, endIndex);
          index = endIndex;
        } else {
          element.innerHTML += text.charAt(index);
          index++;
        }
      } else {
        clearInterval(interval);
        if (callback) setTimeout(callback, 1000);
      }
    }, 50);
  }

  function updateDialogue() {
    if (currentLine < dialogues.length) {
      const currentDialogueObj = dialogues[currentLine];

      const dialogueElement = document.createElement("div");
      dialogueElement.className = "dialogue";
      textContainer.appendChild(dialogueElement);

      document.body.style.backgroundImage = `url('${currentDialogueObj.background}')`;
      document.body.className = currentDialogueObj.textStyle;

      typeWriter(dialogueElement, currentDialogueObj[currentLanguage], () => {
        // 对话结束后，自动添加高亮物品到背包
        const highlights = dialogueElement.querySelectorAll(".highlight");
        highlights.forEach((item) => {
          addToInventory(item.dataset.item, item.dataset.image);
        });

        // 为高亮文本添加点击事件
        highlights.forEach((item) => {
          item.addEventListener("click", () => showPopup(item));
        });

        currentLine++;
        setTimeout(updateDialogue, 1000);
      });
    } else {
      nextSceneButton.style.display = "block";
    }
  }

  function goToNextScene() {
    // 跳转到下一个场景的代码
    window.location.href = "../Map/map.html";
  }

  nextSceneButton.addEventListener("click", goToNextScene);
  nextSceneButton.style.display = "none";

  backButton.addEventListener("click", () => {
    window.location.href = "../Map/map.html";
  });

  function toggleMusic() {
    if (bgm.paused) {
      bgm.play();
      musicToggle.textContent = "🔊";
    } else {
      bgm.pause();
      musicToggle.textContent = "🔇";
    }
  }

  musicToggle.addEventListener("click", toggleMusic);

  languageToggle.addEventListener("click", () => {
    currentLanguage = currentLanguage === "en" ? "zh" : "en";
    setLanguage(currentLanguage);
    languageToggle.textContent = currentLanguage === "en" ? "EN" : "CH";
    currentLine = 0;
    updateDialogue();
  });

  // Initialize language
  currentLanguage = getLanguage();
  languageToggle.textContent = currentLanguage === "en" ? "EN" : "CH";

  // Set up background music
  bgm.src = "../Introduction/Music/Immediate Music - From The Light.mp3";
  bgm.volume = 0.5;

  // Autoplay music on first click
  document.body.addEventListener(
    "click",
    function playAudio() {
      bgm
        .play()
        .then(() => {
          musicToggle.textContent = "🔊";
          document.body.removeEventListener("click", playAudio);
        })
        .catch((error) => console.log("Autoplay still not allowed:", error));
    },
    { once: true }
  );

  updateDialogue();
});
