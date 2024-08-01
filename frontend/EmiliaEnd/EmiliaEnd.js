let isMusicPlaying = true;


const initialBgm = new Audio("./Music/The lament of mankind.mp3");
const emiliaVoice = new Audio("./Music/EmiliaR.mp3");
const nextSceneButton = document.getElementById("next-scene");
//最后点击物品时光胶囊，可以重启游戏
document.addEventListener("DOMContentLoaded", () => {
  const musicToggleButton = document.getElementById("music-toggle");

  musicToggleButton.addEventListener("click", () => {
    isMusicPlaying = !isMusicPlaying;
    musicToggleButton.textContent = isMusicPlaying ? "🔊" : "🔇";

    if (isMusicPlaying) {
      emiliaVoice.play();
      initialBgm.play();
    } else {
      emiliaVoice.pause();
      initialBgm.pause();
    }
  });

  const textContainer = document.getElementById("text-container");
  const backButton = document.getElementById("back-to-main");

  backButton.addEventListener("click", () => {
    window.location.href = "../Emilia/Emilia.html";
  });
  // 设置初始背景音乐
  initialBgm.volume = 0.2;
  initialBgm.loop = true;

  let currentLine = 0;
  const dialogues = [
    {
      background: "./images/Space.png",
      textStyle: "futuristic",
      en: "We have come this far, making countless sacrifices and overcoming numerous challenges. ",
      zh: "我们走到这一步...付出了许多牺牲，克服了诸多挑战。",
      playEmiliaVoice: true,
    },
    {
      background: "./images/Space.png",
      textStyle: "futuristic",
      en: "Your father's legacy, the protests, and our research have all converged to bring us to this moment.",
      zh: "你父亲的遗志，那些抗议，我们的研究...所有这些都让我们来到了这一刻。",
    },
    {
      background: "./images/Space.png",
      textStyle: "futuristic",
      en: "We're conducting a final public petition regarding the new energy source T.",
      zh: "我们正在进行关于新型能源T的最后一次民意联署。",
    },
    {
      background: "./images/Space.png",
      textStyle: "futuristic",
      en: "According to our research, promoting sustainable energy models is crucial for the future of Earth's environment.",
      zh: "根据我们的研究, 推广可持续的能源模式对于未来的地球环境至关重要。",
    },
    {
      background: "./images/Space.png",
      textStyle: "futuristic",
      en: "Will you stand with us?",
      zh: "你会和我们站在一起吗？",
    },
    {
      background: "./images/Space.png",
      textStyle: "futuristic",
      en: "We're on the brink of a new era in energy.",
      zh: "我们正站在能源新纪元的门槛上。",
      choices: ["Willing", "Unwilling"],
    },
    {
      background: "./images/Space.png",
      textStyle: "futuristic",
      en: "But the choice of our path forward isn't just up to scientists or politicians.",
      zh: "但未来的道路选择不应该仅仅由科学家或政治家来决定。",
    },
    {
      background: "./images/Space.png",
      textStyle: "futuristic",
      en: "We hope our efforts can bring a glimmer of hope for the future of Earth.",
      zh: "希望我们的努力能够为地球的未来带来一丝希望。",
    },
  ];

  function typeWriter(element, text, speed, callback) {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        if (text.substr(index, 6) === "<span ") {
          const endIndex = text.indexOf("</span>", index) + 7;
          element.innerHTML += text.substring(index, endIndex);
          index = endIndex;
        } else {
          element.innerHTML += text.charAt(index);
          index++;
        }
      } else {
        clearInterval(interval);
        if (callback) setTimeout(callback, 1000);
      }
    }, speed);
  }

  function updateDialogue() {
    initialBgm.play();
    if (currentLine < dialogues.length) {
      const currentDialogueObj = dialogues[currentLine];
      const dialogueElement = document.createElement("div");
      dialogueElement.className = "dialogue";
      if (currentDialogueObj.fatherSpeech) {
        dialogueElement.classList.add("father-speech");
      }
      textContainer.appendChild(dialogueElement);

      document.body.style.backgroundImage = `url('${currentDialogueObj.background}')`;
      document.body.className = currentDialogueObj.textStyle;

      //如果是Emilia的对话，播放Emilia的录音
      if (currentDialogueObj.playEmiliaVoice) {
        if (isMusicPlaying) {
          emiliaVoice
            .play()
            .catch((error) =>
              console.log("Emilia's voice playback failed:", error)
            );
        }
      }

      //如果是选择的话，弹出 alert
      if (currentDialogueObj.choices) {
        // initialBgm.pause();
        setTimeout(() => {
          showSignaturePrompt();
        }, 1000); // 延迟两秒显示提示
      }
      // // 如果是标记的对话，切换背景音乐并播放Kane的录音
      // if (currentDialogueObj.playKaneVoice) {
      //   initialBgm.pause();
      //   if (isMusicPlaying) {
      //     secondBgm
      //       .play()
      //       .then(() => {
      //         setTimeout(() => {
      //           if (isMusicPlaying) {
      //             kaneVoice
      //               .play()
      //               .catch((error) =>
      //                 console.log("Kane's voice playback failed:", error)
      //               );
      //           }
      //         }, 3000);
      //       })
      //       .catch((error) =>
      //         console.log("Second BGM playback failed:", error)
      //       );
      //   }
      // }

      // 设置打字速度
      const typingSpeed = 40; // 5表示“亲爱的KI”的对话，越小越快
      typeWriter(
        dialogueElement,
        currentDialogueObj[currentLanguage],
        typingSpeed,
        () => {
          currentLine++;
          setTimeout(updateDialogue, 1000);
        }
      );
    } else {
      // 所有对话结束后，显示返回按钮
      nextSceneButton.style.display = "block";
    }
  }

  if (isMusicPlaying) {
    initialBgm
      .play()
      .catch((error) => console.log("Initial BGM playback failed:", error));
  }

  updateDialogue();
});

function goToNextScene() {
  window.location.href = "../BlackEnd/BlackEnd.html";
}

nextSceneButton.addEventListener("click", goToNextScene);
nextSceneButton.style.display = "none";

function addItemToInventoryAndFinish() {
  // 添加物品到背包
  const newItem = {
    name: currentLanguage === "en" ? "Time Capsule" : "时光胶囊",
    image: "../Items/TimeCapsule.png", // 请确保这个图片文件存在
  };
  addToInventory(newItem.name, newItem.image);
}
