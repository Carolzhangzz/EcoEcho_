bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "./Music/Save the World.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; // 设置音量为 50%

//用 dom 元素来控制,这样才可以实现实时的语言切换
document.addEventListener("DOMContentLoaded", () => {
   startNewSceneDialogue();
});

const newScenes = [
  {
    text: {
      en: [
        "This is the new scene dialogue for the English version.",
        "It will be displayed when the special condition is met.",
      ],
      zh: ["这是新场景对话的中文版。", "当满足特殊条件时将显示。"],
    },
    background: "./images/Media.png",
    textStyle: "futuristic",
    character: "./npc/Lisa.png",
  },
];

function startNewSceneDialogue() {
    bgm.play();
    const textContainer = document.getElementById("text-container");
    const nextButton = document.getElementById("next-text-button");
    const prevButton = document.getElementById("prev-text-button");
    let currentTextIndex = 0;
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
        displayNewSceneText();
      });
  
    const scene = newScenes[0];
    
    const displayNewSceneText = () => {
      textContainer.innerHTML = "";
      const currentLine = scene.text[currentLanguage][currentTextIndex];
      const paragraph = document.createElement("p");
      paragraph.innerHTML = currentLine;
      textContainer.appendChild(paragraph);
      textContainer.className = "";
      textContainer.classList.add(scene.textStyle);
  
      nextButton.style.display =
        currentTextIndex === scene.text[currentLanguage].length - 1
          ? "none"
          : "inline-block";
      prevButton.style.display =
        currentTextIndex === 0 ? "none" : "inline-block";
    };
  
    nextButton.addEventListener("click", () => {
      if (currentTextIndex < scene.text[currentLanguage].length - 1) {
        currentTextIndex++;
        displayNewSceneText();
      }
    });
  
    prevButton.addEventListener("click", () => {
      if (currentTextIndex > 0) {
        currentTextIndex--;
        displayNewSceneText();
      }
    });
  
    document.getElementById("next-text-button").style.display = "none";
    document.getElementById("prev-text-button").style.display = "none";
    document.getElementById("user-input-container").style.display = "none";
  
    document.body.style.backgroundImage = `url('${scene.background}')`;
    const characterImage = document.getElementById("character-image");
    if (scene.character) {
      characterImage.src = scene.character;
      characterImage.style.display = "block";
    } else {
      characterImage.style.display = "none";
    }
  
    displayNewSceneText();
  }

window.startNewSceneDialogue = startNewSceneDialogue;
