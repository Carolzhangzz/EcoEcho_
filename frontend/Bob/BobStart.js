bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "./Music/Save the World.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; // 设置音量为 10%

const newScenes = [
  {
    text: {
      en: [
        "New energy? Ah, that... indeed, it's a hot topic. But to be honest, I feel quite worried about it.",
        "On one hand, new energy may bring revolutionary changes to our industry. But on the other hand, I'm concerned about what impact it will have on workers. We can't rashly reject progress, but...",
      ],
      zh: [
        "新能源? 啊,那个...确实,这是个热门话题。但说实话,我对此感到相当忧虑。",
        "一方面, 新能源可能会给我们的行业带来革命性的变化。但另一方面, 我担心它会对工人们造成什么影响。我们不能贸然拒绝进步, 可是...",
      ],
    },
    background: "./images/Office.png",
    textStyle: "futuristic",
    character: "./npc/Bob.png",
  },
];

function startFirstDialogue() {
  bgm.play();

  const textContainer = document.getElementById("text-container");
  const nextButton = document.getElementById("next-text-button");
  const prevButton = document.getElementById("prev-text-button");

  let currentTextIndex = 0;

  const scene = newScenes[0];

  const displayFirstText = () => {
    textContainer.innerHTML = "";
    const currentLine = scene.text[currentLanguage][currentTextIndex];
    const paragraph = document.createElement("p");
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
      displayFirstText();
    }
  });

  prevButton.addEventListener("click", () => {
    if (currentTextIndex > 0) {
      currentTextIndex--;
      displayFirstText();
    }
  });

  document.getElementById("user-input-container").style.display = "none";

  document.body.style.backgroundImage = `url('${scene.background}')`;
  const characterImage = document.getElementById("character-image");
  if (scene.character) {
    characterImage.src = scene.character;
    characterImage.style.display = "block";
  } else {
    characterImage.style.display = "none";
  }

  // 初始化时显示文本和按钮
  displayFirstText();
  nextButton.style.display = "inline-block";
  prevButton.style.display = "none"; // 初始情况下，prev按钮应该隐藏
}

function goToMap() {
  window.location.href = "../Map/map.html"; // 跳转到默认地图页
}

document.getElementById("back-main").addEventListener("click", goToMap);
