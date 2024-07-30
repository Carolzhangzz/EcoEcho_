bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "./Music/Save the World.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; // 设置音量为 50%

const endScenes = [
  {
    text: {
      en: [
        "oh, it's you. Sorry for being a bit tense just now. There have been a lot of unfamiliar faces at the union headquarters recently, so we have to be extra careful.",
        "Oh my god, I can't believe... the government actually... [deep breath] you're right, we can't stay silent anymore. If the public supports us, then it's time to take action.",
        "We need to organize a large-scale strike to force the government to listen to the people's voices.",
      ],
      zh: [
        "哦, 是你啊。抱歉刚才有点紧张。最近工会总部来了不少陌生面孔, 我们不得不多加小心。",
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
    paragraph.innerHTML = currentLine;
    textContainer.appendChild(paragraph);
    textContainer.className = "";
    textContainer.classList.add(scene.textStyle);

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
  window.location.href = "../Map/map.html";
});