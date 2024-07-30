bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "./Music/Save the World.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; // 设置音量为 50%

const endScenes = [
  {
    text: {
      en: [
        "Oh, this is a very interesting development. You know, as a responsible politician, we must always listen to the voices of the people.",
        "It seems that the public's concerns about the T energy project are more serious than we expected. Perhaps it's time to reconsider our energy policy. After all, protecting the environment and public safety has always been an important issue for me."
      ],
      zh: [
        "哦，这是个非常有趣的发展啊。你知道，作为一个负责任的政治家，我们必须时刻倾听民意。",
        "看来公众对T能源项目的担忧比我们预想的要严重。也许是时候重新考虑我们的能源政策了。毕竟, 保护环境和公众安全也是我一直以来的重要主张。"
      ],
    },
    background: "./images/Government.png",
    textStyle: "futuristic",
    character: "./npc/Jonathan.png",
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
      updateNewSceneCompleted("Jonathan", true);
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
