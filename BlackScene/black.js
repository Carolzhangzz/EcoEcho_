document.addEventListener("DOMContentLoaded", () => {
  const textContainer = document.getElementById("text-container");
  const nextSceneButton = document.getElementById("next-scene");
  const backButton = document.getElementById("back-to-main");
  const musicToggle = document.getElementById("music-toggle");
  const languageToggle = document.getElementById("language-toggle");
  const bgm = document.getElementById("bgm");

  let currentLanguage = "en";
  let currentLine = 0;
  const dialogues = [
      {
          background: "./images/dimly_lit_room.png",
          textStyle: "futuristic",
          en: "You get the <span class='highlight' data-item='old key' data-image='../items/old-key.png'>truth about Kane's story</span>.",
          zh: "你得到了<span class='highlight' data-item='old key' data-image='../items/old-key.png'>Kane故事的真相</span>。"
      },
      {
          background: "./images/dusty_room.png",
          textStyle: "futuristic",
          en: "You find a <span class='highlight' data-item='old key' data-image='../items/old-key.png'>note</span> that reveals Kane's past. You learn that Kane had a good friend named Bob.",
          zh: "你得到了一个<span class='highlight' data-item='old key' data-image='../items/old-key.png'>便条</span>,上面记载着Kane的过去,你知道了 Kane 有一个好朋友 Bob."
      },
  ];
 
 
  function typeWriter(element, text, callback) {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        if (text.substr(index, 6) === '<span ') {
          const endIndex = text.indexOf('</span>', index) + 7;
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

  function parseText(text) {
    const parts = [];
    let lastIndex = 0;
    const regex = /<span class='highlight' data-item='([^']*)' data-image='([^']*)'>(.*?)<\/span>/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }
      parts.push({
        type: 'highlight',
        content: match[3],
        item: match[1],
        image: match[2]
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return parts;
  }
  function updateDialogue() {
    if (currentLine < dialogues.length) {
      const currentDialogueObj = dialogues[currentLine];
      
      const dialogueElement = document.createElement('div');
      dialogueElement.className = 'dialogue';
      textContainer.appendChild(dialogueElement);
      
      document.body.style.backgroundImage = `url('${currentDialogueObj.background}')`;
      document.body.className = currentDialogueObj.textStyle;

      typeWriter(dialogueElement, currentDialogueObj[currentLanguage], () => {
        // 对话结束后，自动添加高亮物品到背包
        const highlights = dialogueElement.querySelectorAll('.highlight');
        highlights.forEach(item => {
          addToInventory(item.dataset.item, item.dataset.image);
        });

        // 为高亮文本添加点击事件
        highlights.forEach(item => {
          item.addEventListener('click', () => showPopup(item));
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
  document.body.addEventListener('click', function playAudio() {
    bgm.play()
      .then(() => {
        musicToggle.textContent = "🔊";
        document.body.removeEventListener('click', playAudio);
      })
      .catch(error => console.log("Autoplay still not allowed:", error));
  }, { once: true });

  updateDialogue();
});