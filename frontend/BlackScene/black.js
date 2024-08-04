document.addEventListener("DOMContentLoaded", () => {
  const textContainer = document.getElementById("text-container");
  const nextSceneButton = document.getElementById("next-scene");
  const backButton = document.getElementById("back-to-main");
  const bgm = document.getElementById("bgm");

  backButton.addEventListener("click", () => {
    window.location.href = "../Emilia/Emilia.html";
  });
  
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
      en: "You have obtained <span class='highlight' data-item='truth' data-image='../Items/truth.png'>the truth about the death of KI's father, Kane.</span>",
      zh: "你得到了KI的父亲<span class='highlight' data-item='真相' data-image='../Items/truth.png'>“Kane”死亡的真相</span>。",
    },
  ];

  function typeWriter(element, text, callback) {
    bgm.play();
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
        //并设置最后交互的"NPC"为Ki 
        setLastSigner("Ki");
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
  
    // // 设置最后交互的"NPC"为Ki
    // setLastSigner("Ki");
    // 跳转到Emilia页面
    window.location.href = "../Emilia/Emilia.html";
  }

  nextSceneButton.addEventListener("click", goToNextScene);
  nextSceneButton.style.display = "none";

  // Set up background music
  bgm.src = "./Music/circle.mp3";
  bgm.volume = 0.1;

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
