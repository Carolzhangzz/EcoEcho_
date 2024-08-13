bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "../Music/NPC_talk.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; // 设置音量为 50%

const endScenes = [
  {
    text: {
      en: [
        "Hmm? You're the friend of that journalist, right?",
        "Sorry, I was a bit nervous just now. There have been a lot of unfamiliar faces at the union headquarters recently, so we have to be extra careful.",
      ],
      zh: ["嗯？你是那位记者的朋友吧。", "抱歉刚才有点紧张。最近工会总部来了不少陌生面孔, 我们不得不多加小心。"],
    },
    background: "./images/Union.png",
    textStyle: "futuristic",
    character: "./npc/Guard.png",
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
      updateNewSceneCompleted("Guard", true);
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
  window.location.href = "../index.html";
});