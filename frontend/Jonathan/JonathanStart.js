bgm = document.getElementById("bgm");
bgm.loop = true; // Let the music loop
bgm.src = "./Music/Save the World.mp3"; // 设置统一的背景音乐
bgm.volume = 0.1; // 设置音量为 10%

const newScenes = [
  {
    text: {
      en: [
        "Traditional energy? That's a thing of the past. It's an era of innovation now, and T energy represents progress. We can't give up the entire future just because of some small risks, can we?",
        "Listen, young , politics is an art, and art is about catering to the needs of the voters. What people want now is progress, is new energy. KI is our future, and it's also the key to my winning the election.",
      ],
      zh: [
        "传统能源? 那是过去的事了。现在是创新的时代, T能源代表着进步。我们不能因为一些小小的风险就放弃整个未来, 不是吗?",
        "听着, 年轻人, 政治是一门艺术, 而艺术就是要迎合选民的需求。现在人们想要的是进步是新能源。T 能源就是我们的未来, 也是我赢得选举的关键。",
      ],
    },
    background: "./images/Government.png",
    textStyle: "futuristic",
    character: "./npc/Jonathan.png",
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
