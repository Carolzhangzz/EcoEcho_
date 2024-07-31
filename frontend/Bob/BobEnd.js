bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "./Music/Save the World.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; // 设置音量为 50%

const endScenes = [
  {
    text: {
      en: [
        "Oh my god, I can't believe... the government actually... [deep breath] you're right, we can't stay silent anymore. If the public supports us, then it's time to take action.",
        "We need to organize a large-scale strike to force the government to listen to the people's voices.",
      ],
      zh: [
        "天哪, 我不敢相信...政府居然...[深吸一口气]。你说得对, 我们不能再沉默了。如果公众支持我们, 那么是时候采取行动了。",
        "我们需要组织一次大规模罢工, 迫使政府听取人民的声音。",
      ],
    },
    background: "./images/Office.png",
    textStyle: "futuristic",
    character: "./npc/Bob.png",
  },
];

function startNewSceneDialogue() {
  bgm.play();

  const textContainer = document.getElementById("text-container");
  const nextButton = document.getElementById("next-text-button");
  const prevButton = document.getElementById("prev-text-button");

  let currentTextIndex = 0;

  const scene = endScenes[0];

  const displayNewSceneText = () => {
    textContainer.innerHTML = "";
    const currentLine = scene.text[currentLanguage][currentTextIndex];
    const paragraph = document.createElement("p");
    const userInputContainer = document.getElementById("user-input-container");
    paragraph.innerHTML = currentLine;
    textContainer.appendChild(paragraph);
    textContainer.className = "";
    textContainer.classList.add(scene.textStyle);

    // 隐藏用户输入区域，显示导航按钮
    userInputContainer.style.display = "none";
    
    nextButton.style.display =
      currentTextIndex === scene.text[currentLanguage].length - 1
        ? "none"
        : "inline-block";
    prevButton.style.display = currentTextIndex === 0 ? "none" : "inline-block";
  };

  nextButton.addEventListener("click", () => {
    if (currentTextIndex < scene.text[currentLanguage].length - 1) {
      currentTextIndex++;
      displayNewSceneText();
    } else {
      updateNewSceneCompleted("Bob", true);
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

document.getElementById("back-main").addEventListener("click", () => {
  window.location.href = "../Emilia/Emilia.html"; // 跳转到默认地图页
});
