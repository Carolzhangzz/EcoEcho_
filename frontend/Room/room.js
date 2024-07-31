let currentScene = 0;
let currentTextIndex = 0;
let bgm;

document.addEventListener("DOMContentLoaded", () => {
  bgm = document.getElementById("bgm");
  bgm.loop = true; // Let the music loop
  bgm.src = "./Music/Save the World.mp3"; // 设置统一的背景音乐
  bgm.volume = 0.5; // 设置音量为 50%

  // 使用 lastSigner 来设置相应的场景或对话
  startGame(lastSigner);

  // 不禁用返回主页按钮
  const backMainButton = document.getElementById("back-main");
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
              "After returning to the real world, KI sat in his room, staring at the familiar desk and the beautiful scenery outside the window.",
              "He thought to himself, things seem to be going more smoothly than I imagined, but why do I still feel uneasy...",
              "I hope I can bring back the oil soon.",
            ],
            zh: [
              "KI回到现实世界后, 他坐在房间中, 望着熟悉的书桌和窗外美丽的环境, 陷入了沉思。",
              "他心想：事情似乎比我想象的要顺利，但为什么心里总有一种不安的感觉…… ",
              "希望能尽早带回石油吧。",
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
              "Returning to the present after another journey to the past, KI felt an overwhelming sense of exhaustion.",
              "At least the plan was about to succeed, giving him some comfort.",
              "Sitting in his room, he opened the window, only to be shocked to see that the dense forest outside had disappeared, and there was an indescribable smell in the air.",
              "He muttered to himself, Maybe I haven't had a good rest in a while... ",
            ],
            zh: [
              "再次结束了过去的旅程回到现在, KI感到无尽的疲惫。",
              "好在计划即将成功，他感到些许安慰。",
              "坐在房间中，他推开窗户，却惊讶地发现窗前那片茂密的森林消失了，空气中似乎弥漫着一种说不上来的味道。",
              "他低声自语道: 可能是我好久没有好好休息了…… ",
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
              "Finally, KI succeeded in stopping the extraction of K and returned to a world powered by 'traditional energy.'",
              "He glanced outside the window and noticed that factories had quietly sprung up, with huge chimneys emitting thick black smoke.",
              "However, KI seemed completely oblivious to these changes, lost in his own joy, as he quickly stepped out of the room.",
            ],
            zh: [
              "终于, KI成功了, 阻止了T的开采, 重新回到了“传统能源的世界。",
              "他看向窗外，发现那里悄然建起了工厂，巨大的烟囱不停地排放着黑色的浓烟。",
              "然而, KI似乎完全没有注意到这些变化, 他沉浸在自己的喜悦中, 快步走出房间。",
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
    paragraph.textContent = currentLine;
    textContainer.appendChild(paragraph);

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

    // // 检查是否是最后一个场景的最后一行文本
    // if (
    //   currentScene === scenes.length - 1 &&
    //   currentTextIndex === scene.text[currentLanguage].length - 1
    // ) {
    //   // 添加一个延迟，给用户一些时间阅读最后的文本
    //   setTimeout(() => {
    //     console.log(
    //       "`lastSigner at Room and MetEmilia`:",
    //       lastSigner,
    //       metEmilia[lastSigner]
    //     );
    //     window.location.href = "../Emilia/Emilia.html"; // 跳转到艾米丽的页面
    //   }, 5000); // 2秒后执行
    // }

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
