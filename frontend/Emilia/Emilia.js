let currentScene = 0;
let currentTextIndex = 0;
let currentNpcName = "Emilia";
const MUSIC_PATH = "./Music/Living in future.mp3";
const MAIN_PAGE_PATH = "../Main.html";
const MAIN_MAP_PATH = "../Emilia/Emilia.html";
let bgm;

// 允许所有场景
function enableAllScenes() {
  ["scene1", "scene2", "scene3", "scene4"].forEach((sceneId) => {
    const sceneButton = document.getElementById(sceneId);
    if (sceneButton) {
      sceneButton.style.pointerEvents = "auto";
      sceneButton.style.opacity = "1";
      sceneButton.style.backgroundColor = "";
      sceneButton.style.color = "";
    }
  });
}

// 初始化背景音乐
function initializeAudio() {
  bgm = document.getElementById("bgm");
  if (!bgm) {
    console.error("Background music element not found");
    return;
  }
  bgm.loop = true;
  bgm.src = MUSIC_PATH;
  bgm.volume = 0.2;
}

// 跳转到指定场景
function goToScene(scenePath) {
  window.location.href = scenePath;
}

document.addEventListener("DOMContentLoaded", () => {
  initializeAudio();

  const lastSigner = getLastSigner();

  startGame(lastSigner);

  const backMainButton = document.getElementById("back-main");
  backMainButton.addEventListener("click", () => {
    window.location.href = MAIN_PAGE_PATH;
  });

  // document.addEventListener("click", (event) => {
  //   if (event.target.id === "scene1") {
  //     goToScene("../Lisa/Lisa.html");
  //   } else if (event.target.id === "scene2") {
  //     goToScene("../Bob/Bob.html");
  //   } else if (event.target.id === "scene4") {
  //     goToScene("../Guard/Guard.html");
  //   } else if (event.target.id === "scene3") {
  //     goToScene("../Jonathan/Jonathan.html");
  //   }
  // });
});

function startGame(lastSigner) {
  const textContainer = document.getElementById("text-container");
  const nextButton = document.getElementById("next-text-button");
  const prevButton = document.getElementById("prev-text-button");
  // const lastSigner = getLastSigner();
  let dialogues;

  // 修改禁用场景的函数
  function disableScenes(scenesToDisable) {
    scenesToDisable.forEach((sceneId) => {
      const sceneButton = document.getElementById(sceneId);
      if (sceneButton) {
        sceneButton.style.pointerEvents = "none";
        sceneButton.style.opacity = "0.7"; // 适度降低不透明度
        sceneButton.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; // 深色背景，带透明度
        sceneButton.style.color = "rgba(255, 255, 255, 0.7)"; // 文字颜色

        // 添加渐变背景和阴影
        sceneButton.style.border = "2px solid rgba(255, 255, 255, 0.3)";
        sceneButton.style.borderRadius = "8px"; // 圆角
        sceneButton.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.5)"; // 阴影效果
        sceneButton.style.transition = "all 0.3s ease"; // 添加过渡效果
      }
    });
  }

  // Replace the signature check with a vote check , 检查签名状态并禁用/启用相应场景
  if (signatures[lastSigner] != null && signatures[lastSigner] !== undefined) {
    enableAllScenes();
  } else if (lastSigner === "Ki") {
    disableScenes(["scene1", "scene2", "scene3", "scene4"]);
  } else if (lastSigner === "Lisa") {
    disableScenes(["scene2", "scene3", "scene4"]);
  } else if (lastSigner === "Guard") {
    disableScenes(["scene2", "scene3"]);
  } else if (lastSigner === "Bob") {
    disableScenes(["scene3"]);
  } else {
    enableAllScenes(); // 如果没有 lastSigner 或者是其他情况，启用所有场景
  }

  let petitionNumber;
  switch (lastSigner) {
    case "Ki":
      petitionNumber = "first";
      break;
    case "Lisa":
      petitionNumber = "second";
      break;
    case "Bob":
      petitionNumber = "third";
      break;
    case "Johnathan":
      petitionNumber = "fourth";
      break;
    default:
      petitionNumber = "current";
  }

  if (lastSigner === "Lisa" && !metEmilia["Lisa"]) {
    dialogues = [
      {
        en: [
          "I am Emilia, a scientist dedicated to studying ethical issues in technological advancement.",
        ],
        zh: [
          "你好，我是 Emilia。我是一名计算机科学家, 专注于能源系统的优化和可持续发展。",
        ],
      },
      {
        en: [
          "We are conducting the second public petition on the new energy T, based on our research, promoting sustainable energy models is crucial for the future of the Earth's environment.",
        ],
        zh: [
          "我们正在进行关于新型能源T的第二次民意联署。根据我们的研究,推广可持续的能源模式对于未来的地球环境至关重要。",
        ],
      },
    ];
    updateMetEmilia(lastSigner, true);
  } else if (lastSigner === "Ki" && !metEmilia["Ki"]) {
    dialogues = [
      {
        en: [
          "I am Emilia, a scientist dedicated to studying ethical issues in technological advancement.",
        ],
        zh: [
          "你好，我是 Emilia。我是一名计算机科学家, 专注于能源系统的优化和可持续发展。",
        ],
      },
      {
        en: [
          "We are conducting the first public petition on the new energy T, based on our research, promoting sustainable energy models is crucial for the future of the Earth's environment.",
        ],
        zh: [
          "我们正在进行关于新型能源T的第一次民意联署。根据我们的研究,推广可持续的能源模式对于未来的地球环境至关重要。",
        ],
      },
    ];
    updateMetEmilia(lastSigner, true);
  } else if (lastSigner === "Bob" && !metEmilia["Bob"]) {
    dialogues = [
      {
        en: [
          "I am Emilia, a scientist dedicated to studying ethical issues in technological advancement.",
        ],
        zh: [
          "你好，我是 Emilia。我是一名计算机科学家, 专注于能源系统的优化和可持续发展。",
        ],
      },
      {
        en: [
          "We are conducting the third public petition on the new energy T, based on our research, promoting sustainable energy models is crucial for the future of the Earth's environment.",
        ],
        zh: [
          "我们正在进行关于新型能源T的第三次民意联署。根据我们的研究,推广可持续的能源模式对于未来的地球环境至关重要。",
        ],
      },
    ];
    updateMetEmilia(lastSigner, true);
  } else if (lastSigner === "null" || lastSigner === null) {
    dialogues = [
      {
        en: [
          "I am Emilia, a scientist dedicated to studying ethical issues in technological advancement.",
        ],
        zh: [
          "你好，我是 Emilia。我是一名计算机科学家, 专注于能源系统的优化和可持续发展。",
        ],
      },
      {
        en: [
          "We are conducting a public petition on the new energy T. Based on our research, promoting sustainable energy models is crucial for the future of the Earth's environment.",
        ],
        zh: [
          "我们正在开发一个复杂的能源系统模拟器。它可以帮助我们预测不同能源政策的长期影响。",
        ],
      },
      {
        en: [
          "T energy is indeed a groundbreaking technology, but we need to carefully evaluate its long-term impact. Our simulations have shown some potential issues.",
        ],
        zh: [
          "T 能源确实是一项突破性技术, 但我们需要仔细评估它的长期影响。我们的模拟显示了一些潜在的问题。",
        ],
      },
      {
        en: [
          "What are your thoughts on T energy? We need more people to engage in these important discussions. Your perspective could help shape our future.",
        ],
        zh: [
          "你对T能源有什么看法? 我们需要更多人参与到这些重要的讨论中来。你的观点可能会帮助塑造我们的未来。",
        ],
      },
    ];
  } else {
    dialogues = [
      {
        en: [
          "I am Emilia, a scientist dedicated to studying ethical issues in technological advancement.",
        ],
        zh: [
          "你好，我是 Emilia。我是一名计算机科学家, 专注于能源系统的优化和可持续发展。",
        ],
      },
      {
        en: [
          `We are conducting the ${petitionNumber} public petition on the new energy T. Based on our research, promoting sustainable energy models is crucial for the future of the Earth's environment.`,
        ],
        zh: [
          `我们正在进行关于新型能源T的第${
            petitionNumber === "first"
              ? "一"
              : petitionNumber === "second"
              ? "二"
              : petitionNumber === "third"
              ? "三"
              : petitionNumber === "fourth"
              ? "四"
              : ""
          }次民意联署。根据我们的研究,推广可持续的能源模式对于未来的地球环境至关重要。`,
        ],
      },
    ];
  }

  const scenes = dialogues.map((dialogue) => ({
    text: dialogue,
    background: "./map.png",
    textStyle: "futuristic",
    character: "./npc/Emilia.png",
  }));

  const displayText = () => {
    bgm.play();
    textContainer.innerHTML = ""; // 清除之前的文本
    const scene = scenes[currentScene];
    const textLines = scene.text[currentLanguage];
    const currentLine = textLines[currentTextIndex];
    const paragraph = document.createElement("p");
    paragraph.textContent = currentLine;
    textContainer.appendChild(paragraph);

    textContainer.className = "";
    textContainer.classList.add(scene.textStyle);

    // 显示/隐藏导航按钮
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

    if (scene.isBlackScreen) {
      window.location.href = "black_screen.html"; // 移除了 './'
    }

    // 更新角色图片
    const characterImage = document.getElementById("character-image");
    if (scene.character) {
      characterImage.src = scene.character;
      characterImage.style.display = "block";
    } else {
      characterImage.style.display = "none";
    }

    // 检查是否是最后一个场景的最后一行文本
    if (
      currentScene === scenes.length - 1 &&
      currentTextIndex ===
        scenes[currentScene].text[currentLanguage].length - 1 &&
      // 检查此时是否有签名者，如果没有，不显示签名提示 ，如果有在逻辑内判断
      lastSigner != null &&
      lastSigner != undefined &&
      lastSigner != ""
    ) {
      setTimeout(() => {
        showVotingPrompt();
      }, 200);
    }
  };

  nextButton.addEventListener("click", () => {
    currentTextIndex++;
    const sceneLength = scenes[currentScene].text[currentLanguage].length;

    if (currentTextIndex >= sceneLength) {
      currentScene++;
      if (currentScene < scenes.length) {
        currentTextIndex = 0; // Reset the text index for the next scene
      } else {
        currentScene = scenes.length - 1; // Prevent overflow
        currentTextIndex = sceneLength - 1; // Go to the last text in the last scene
      }
    }
    updateScene();
  });

  prevButton.addEventListener("click", () => {
    currentTextIndex--;
    if (currentTextIndex < 0) {
      currentScene--;
      if (currentScene < 0) {
        currentScene = 0; // 防止下溢
        currentTextIndex = 0;
      } else {
        currentTextIndex =
          scenes[currentScene].text[currentLanguage].length - 1;
      }
    }
    updateScene();
  });

  // 修改事件监听器
  document.querySelectorAll(".footer > div").forEach((button) => {
    button.addEventListener("click", (event) => {
      const sceneId = event.target.id;
      if (event.target.style.pointerEvents !== "none") {
        // 只有未被禁用的按钮才能点击
        if (sceneId === "scene1") {
          goToScene("../Lisa/Lisa.html");
        } else if (sceneId === "scene2") {
          goToScene("../Bob/Bob.html");
        } else if (sceneId === "scene4") {
          goToScene("../Guard/Guard.html");
        } else if (sceneId === "scene3") {
          goToScene("../Jonathan/Jonathan.html");
        }
      }
    });
  });

  // 初始场景设置
  updateScene();
}

// Load saved signatures from localStorage
if (localStorage.getItem("signatures")) {
  signatures = JSON.parse(localStorage.getItem("signatures"));
}

function showVotingPrompt() {
  let message;
  const lastSigner = getLastSigner();

  switch (lastSigner) {
    case "Ki":
      message = {
        en: "In the first phase, we have already collected 587 signatures, close to the threshold of 618. How many votes would you like to cast for the petition? (0-5)",
        zh: "第一阶段我们已经联署了587份了，已经接近门槛618份，您想为这份请愿书投多少票？(0-5)",
      };
      break;
    case "Lisa":
      message = {
        en: "In the second phase, we have already collected 2490 signatures, close to the threshold of 3098. How many votes would you like to cast for the petition? (0-5)",
        zh: "第二阶段我们已经联署了2490份了，已经接近门槛3098份，您想为这份请愿书投多少票？(0-5)",
      };
      break;
    case "Bob":
      message = {
        en: "In the third phase, we have already collected 5837 signatures, close to the threshold of 6818. How many votes would you like to cast for the petition? (0-5)",
        zh: "第三阶段我们已经联署了5837份了，已经接近门槛6818份，您想为这份请愿书投多少票？(0-5)",  
      };
      break;
    case "Jonathan":
      message = {
        en: "In the fourth phase, we have already collected 9532 signatures, close to the threshold of 9875. How many votes would you like to cast for the petition? (0-5)",
        zh: "第四阶段我们已经联署了9532份，快要接近门槛9875份，你想为这份请愿书投多少票？(0-5)",  
      };
      break;
    default:
      message = {
        en: "How many votes would you like to cast for the petition? (0-5)",
        zh: "你想为这份请愿书投多少票？(0-5)",
      };
  }

  // Check if the last signer has already voted
  if (signatures[lastSigner] !== null && signatures[lastSigner] !== undefined) {
    return;
  }

  showVotingOptions(message[currentLanguage], async (voteCount) => {
    await Signature(lastSigner, voteCount);

    const confirmMessage =
      voteCount > 0
        ? currentLanguage === "en"
          ? `Thank you for your support! You've cast ${voteCount} vote(s).`
          : `感谢您的支持！您投了 ${voteCount} 票。`
        : currentLanguage === "en"
        ? "We understand your decision. Thank you for your time."
        : "我们理解您的决定。感谢您的时间。";

    showConfirmMessage(confirmMessage, (confirmed) => {
      // 不需要执行额外的操作，只是显示消息
    });
  });
}

function showVotingOptions(message, callback) {
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
      document.body.removeChild(voteDialog);
      callback(i);
    });
    optionsContainer.appendChild(button);
  }

  voteDialog.appendChild(optionsContainer);
  document.body.appendChild(voteDialog);
}

async function Signature(name, voteCount) {
  try {
    signatures[name] = voteCount;
    localStorage.setItem("signatures", JSON.stringify(signatures));
    if (voteCount >= 0) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setTimeout(() => {
        enableAllScenes();
      }, 1000);
    }
  } catch (error) {
    console.error("Error submitting vote:", error);
    showAlert(
      currentLanguage === "en"
        ? "An error occurred. Please try again."
        : "发生错误，请重试。"
    );
  }
}

// 在页面加载时调用 startGame
document.addEventListener("DOMContentLoaded", () => {
  const lastSigner = getLastSigner();
  startGame(lastSigner);
});
