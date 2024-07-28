bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "./Music/Save the World.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; // 设置音量为 50%

const newScenes = [
  {
    text: {
      en: [
        "Hmm? We meet again.",
        "Have you noticed anything different about me recently?",
      ],
      zh: ["嗯？又见面了。", "你最近有没有发现什么不同？"],
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
