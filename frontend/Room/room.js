let currentScene = 0;
let currentTextIndex = 0;
let bgm;

function updateTimelineIndicator() {
  const timelineIndicator = document.getElementById("timeline-indicator");
  const now = new Date();
  const year = 2056;
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  // 使用 window.currentLanguage 来确保我们访问的是全局变量
  if (currentLanguage === "zh") {
    timelineIndicator.textContent = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  } else {
    timelineIndicator.textContent = `${year}-${month
      .toString()
      .padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")} ${hours}:${minutes}:${seconds}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // 初始更新时间线指示器
  updateTimelineIndicator();

  // 每秒更新一次时间线指示器
  setInterval(updateTimelineIndicator, 1000);

  // 在语言切换时更新时间线指示器
  document.getElementById("language-toggle").addEventListener("click", () => {
    // 语言切换的逻辑应该在 global.js 中处理
    // 我们只需要在这里更新时间线指示器
    updateTimelineIndicator();
  });

  bgm = document.getElementById("bgm");
  bgm.loop = true; // Let the music loop
  bgm.src = "./Music/Living in future.mp3"; // 设置统一的背景音乐
  bgm.volume = 0.5; // 设置音量为 50%

  // 使用 lastSigner 来设置相应的场景或对话
  startGame(lastSigner);

  // 不禁用返回主页按钮
  const backMainButton = document.getElementById("back-to-main");
  backMainButton.addEventListener("click", () => {
    if (lastSigner === "Johnathan") {
      window.location.href = "../Ending/End.html"; // 跳转到落幕页面
    } else {
      window.location.href = "../Emilia/Emilia.html";
    }
  });
});

function getScenes(lastSigner) {
  switch (lastSigner) {
    case "Lisa":
      return [
        {
          text: {
            en: [
              "After returning to the <span class='high'>real world</span>, you sit in the room, looking at the familiar desk and the beautiful environment outside the window, lost in thought.",
              "You think to yourself: Things seem to be smoother than I imagined, but why do I always have a sense of unease...",
              "I hope to bring back the oil as soon as possible.",
            ],
            zh: [
              "你回到<span class='high'>现实世界</span>后, 你坐在房间中, 望着熟悉的书桌和窗外美丽的环境, 陷入了沉思。",
              "你心想：事情似乎比我想象的要顺利，但为什么心里总有一种不安的感觉…… ",
              "希望能尽早带回<span class='high'>石油</span>吧。",
            ],
          },
          background: "./RoomImages/Lisa_scene.png",
          textStyle: "futuristic",
        },
      ];
    case "Bob":
      return [
        {
          text: {
            en: [
              "After returning from the past journey, you feel endless fatigue.",
              "Fortunately, the plan is about to <span class='high'>succeed</span>, which gives you some comfort.",
              "Sitting in the room, you open the window and are surprised to find that the dense forest outside the window has <span class='high'>disappeared</span>, and there seems to be an indescribable smell in the air.",
              "You whisper to yourself: Maybe I haven't had a good rest for a long time...",
            ],
            zh: [
              "再次结束了过去的旅程回到现在, 你感到无尽的疲惫。",
              "好在计划即将 <span class='high'>成功</span>，你感到些许安慰。",
              "坐在房间中，你推开窗户，却惊讶地发现窗前那片茂密的森林<span class='high'>消失了</span>，空气中似乎弥漫着一种说不上来的味道。",
              "你低声自语道: 可能是我好久没有好好休息了…… ",
            ],
          },
          background: "./RoomImages/Bob_scene.png",
          textStyle: "futuristic",
        },
      ];
    case "Johnathan":
      return [
        {
          text: {
            en: [
              "Finally, you succeeded in stopping the mining of T and returned to the world of 'traditional energy'.",
              "Looking out of the window, factories have been quietly built there, and huge chimneys are constantly emitting black <span class='high'>smoke</span>.",
              "However, you seem to have completely ignored these changes, immersed in your own joy, and walked out of the room quickly.",
            ],
            zh: [
              "终于, 你成功了, 阻止了T的开采, 重新回到了“传统能源”的世界。",
              "看向窗外，那里悄然建起了工厂，巨大的烟囱不停地排放着黑色的 <span class='high'>浓烟</span>。",
              "然而, 你似乎完全没有注意到这些变化, 沉浸在自己的喜悦中, 快步走出房间。",
            ],
          },
          background: "./RoomImages/Johnathan_scene.png",
          textStyle: "futuristic",
        },
      ];
    // 其他NPC的case...
    default:
      return [
        {
          text: {
            en: ["No specific dialogues available."],
            zh: ["没有特定的对话可用。"],
          },
          background: "./RoomImages/Johnathan_scene.png", // Ensure you have a default image
          textStyle: "futuristic",
        },
      ];
  }
}

function startGame(lastSigner) {
  scenes = getScenes(lastSigner);
  const textContainer = document.getElementById("text-container");
  const nextButton = document.getElementById("next-text-button");
  const prevButton = document.getElementById("prev-text-button");

  const displayText = () => {
    textContainer.innerHTML = ""; // Clear previous text
    const scene = scenes[currentScene];
    const textLines = scene.text[currentLanguage];
    const currentLine = textLines[currentTextIndex];
    const paragraph = document.createElement("p");
    paragraph.innerHTML = currentLine; // 使用 innerHTML 而不是 textContent
    textContainer.appendChild(paragraph);

    // 给所有 highlight 类的元素添加效果
    const highlights = paragraph.querySelectorAll(".high");
    highlights.forEach((el) => {
      el.classList.add("highlight-effect");
    });

    textContainer.className = "";
    textContainer.classList.add(scene.textStyle);

    // Hide/Show navigation buttons
    prevButton.style.display =
      currentScene === 0 && currentTextIndex === 0 ? "none" : "inline-block";
    nextButton.style.display =
      currentScene === scenes.length - 1 &&
      currentTextIndex === textLines.length - 1
        ? "none"
        : "inline-block";
  };

  const updateScene = () => {
    const scene = scenes[currentScene];
    document.body.style.backgroundImage = `url('${scene.background}')`;
    displayText();

    bgm.play();
  };

  nextButton.addEventListener("click", () => {
    currentTextIndex++;
    if (currentTextIndex >= scenes[currentScene].text[currentLanguage].length) {
      currentScene++;
      if (currentScene >= scenes.length) {
        updateScene();
      } else {
        currentTextIndex = 0;
        updateScene();
      }
    } else {
      updateScene();
    }
  });

  prevButton.addEventListener("click", () => {
    currentTextIndex--;
    if (currentTextIndex < 0) {
      currentScene--;
      if (currentScene < 0) {
        currentScene = 0; // Prevent underflow
        currentTextIndex = 0;
      } else {
        currentTextIndex =
          scenes[currentScene].text[currentLanguage].length - 1;
      }
    }
    updateScene();
  });
  // Initial scene setup
  updateScene();
}
