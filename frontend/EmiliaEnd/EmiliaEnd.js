let isMusicPlaying = true;
let currentNpcName = "Johnathan";

const initialBgm = new Audio("./Music/The lament of mankind.mp3");
const emiliaVoice = new Audio("./Music/EmiliaR.mp3");
const nextSceneButton = document.getElementById("next-scene");
//最后点击物品时光胶囊，可以重启游戏
document.addEventListener("DOMContentLoaded", () => {

  if (signatures["Johnathan"] !== null && signatures["Johnathan"] !== undefined) {
    showNextSceneButton();
  }
  
  emiliaVoice.volume = 0.3;
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
  initialBgm.volume = 0.3;
  initialBgm.loop = true;

  let currentLine = 0;
  const dialogues = [
    {
      background: "./images/Space.png",
      textStyle: "futuristic",
      en: "We have come this far, making countless sacrifices and overcoming numerous challenges. ",
      zh: "我们走到这一步...付出了许多牺牲，克服了诸多挑战。",
    },
    {
      background: "./images/Space.png",
      textStyle: "futuristic",
      en: "Your father's legacy, the protests, and our research have all converged to bring us to this moment.",
      zh: "你父亲的遗志，那些抗议，我们的研究...所有这些都让我们来到了这一刻。",
      playEmiliaVoice: true,
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
    // 禁用返回按钮
    const backButton = document.getElementById("back-to-main");
    backButton.disabled = true;

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
          showVotingPrompt();
          // showSignaturePrompt();
        }, 1000); // 延迟两秒显示提示
        return; // 停止继续显示对话
      }

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
      // 启用返回按钮
      backButton.disabled = false;
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

// Load saved signatures from localStorage
if (localStorage.getItem("signatures")) {
  signatures = JSON.parse(localStorage.getItem("signatures"));
}

function showVotingPrompt() {
  console.log("Entering showVotingPrompt function");
  const message = {
    en: "In the final stage of the petition, we have collected 9532 signatures out of the goal of 9875. How many votes would you like to cast for the petition? (0-5)",
    zh: "第四阶段目前联署数量为9532份，接近目标9875份，您想为这份请愿书投多少票？(0-5)",
  };

  const lastSigner = getLastSigner();
  console.log("Last signer:", lastSigner);

  // Check if the last signer has already voted
  if (signatures[lastSigner] !== null && signatures[lastSigner] !== undefined) {
    console.log("Signer has already voted, exiting function");
    return;
  }

  console.log("Calling showVotingOptions");
  showVotingOptions(message[currentLanguage], async (voteCount) => {
    console.log("Vote count selected:", voteCount);
    await Signature(lastSigner, voteCount);

    const confirmMessage =
      voteCount > 0
        ? currentLanguage === "en"
          ? `Thank you for your support! You've cast ${voteCount} vote(s).`
          : `感谢您的支持！您投了 ${voteCount} 票。`
        : currentLanguage === "en"
        ? "We understand your decision. Thank you for your time."
        : "我们理解您的决定。感谢您的时间。";

    console.log("Showing confirm message");
    showConfirmMessage(confirmMessage);

    console.log("Updating music and inventory");
    isMusicPlaying = true;
    document.getElementById("music-toggle").textContent = "🔊";
    addItemToInventoryAndFinish();
    showNextSceneButton();
  });
  console.log("Updating Met Emilia");
  updateMetEmilia(lastSigner, true);
}

// 确保这个函数也有适当的日志
function showVotingOptions(message, callback) {
  console.log("Entering showVotingOptions function");
  const voteDialog = document.createElement("div");
  voteDialog.className = "voting-dialog";

  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  voteDialog.appendChild(messageElement);

  const optionsContainer = document.createElement("div");
  optionsContainer.className = "voting-options";

  for (let i = 0; i <= 5; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.addEventListener("click", () => {
      console.log(`Vote option ${i} selected`);
      document.body.removeChild(voteDialog);
      callback(i);
    });
    optionsContainer.appendChild(button);
  }

  voteDialog.appendChild(optionsContainer);
  document.body.appendChild(voteDialog);
  console.log("Voting dialog appended to body");
}

async function Signature(name, voteCount) {
  try {
    signatures[name] = voteCount;
    localStorage.setItem("signatures", JSON.stringify(signatures));
  } catch (error) {
    console.error("Error submitting vote:", error);
    showAlert(
      currentLanguage === "en"
        ? "An error occurred. Please try again."
        : "发生错误，请重试。"
    );
  }
}

function showNextSceneButton() {
  nextSceneButton.style.display = "block";
}

function addItemToInventoryAndFinish() {
  // 添加物品到背包
  const newItem = {
    name: currentLanguage === "en" ? "Time Capsule" : "时光胶囊",
    image: "../Items/TimeCapsule.png", // 请确保这个图片文件存在
  };
  addToInventory(newItem.name, newItem.image);
}
