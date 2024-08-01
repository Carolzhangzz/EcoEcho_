let currentScene = 0;
let currentTextIndex = 0;
let currentNpcName = "Emilia";
const MUSIC_PATH = "./Music/Living in future.mp3";
const MAIN_PAGE_PATH = "../Main.html";
const MAIN_MAP_PATH = "../Emilia/Emilia.html";
let bgm;

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

  document.addEventListener("click", (event) => {
    if (event.target.id === "scene1") {
      goToScene("../Lisa/Lisa.html");
    } else if (event.target.id === "scene2") {
      goToScene("../Bob/Bob.html");
    } else if (event.target.id === "scene4") {
      goToScene("../Guard/Guard.html");
    } else if (event.target.id === "scene3") {
      goToScene("../Jonathan/Jonathan.html");
    }
  });
});

function startGame(lastSigner) {
  const textContainer = document.getElementById("text-container");
  const nextButton = document.getElementById("next-text-button");
  const prevButton = document.getElementById("prev-text-button");
  // const lastSigner = getLastSigner();
  let dialogues;

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
        zh: ["你好，我是 Emilia。我是一名计算机科学家, 专注于能源系统的优化和可持续发展。"],
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
        en: ["Would you be willing to sign the petition right now?"],
        zh: ["你愿意现在在联署书上签字吗?"],
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
        // 如果是最后一个，显示签名提示
        showSignaturePrompt();
      }, 1000); // 延迟两秒显示提示
    }
  };

  nextButton.addEventListener("click", () => {
    currentTextIndex++;
    if (currentTextIndex >= scenes[currentScene].text[currentLanguage].length) {
      currentScene++;
      if (currentScene >= scenes.length) {
        if (previousPage) {
          localStorage.removeItem("previousPage");
          window.location.href = previousPage; // 返回上一个页面
        } else {
          window.location.href = MAIN_PAGE_PATH; // 跳转到默认地图页面
        }
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
        currentScene = 0; // 防止下溢
        currentTextIndex = 0;
      } else {
        currentTextIndex =
          scenes[currentScene].text[currentLanguage].length - 1;
      }
    }
    updateScene();
  });

  // 初始场景设置
  updateScene();
}

function showSignaturePrompt() {
  const message = {
    en: "Would you be willing to sign the petition right now?",
    zh: "你愿意现在在联署书上签字吗?",
  };

  const lastSigner = getLastSigner();

  // 检查最后签名者是否已经签名
  if (signatures[lastSigner] !== null && signatures[lastSigner] !== undefined) {
    showAlert(
      currentLanguage === "en"
        ? "You have already signed this petition."
        : "你已经在这份联署书上签过名了。"
    );
    return;
  }

  showConfirm(message[currentLanguage], async (confirmed) => {
    await addSignature(lastSigner, confirmed);

    if (confirmed) {
      showAlert(
        currentLanguage === "en"
          ? "Thank you for your support!"
          : "感谢您的支持！"
      );
    } else {
      showAlert(
        currentLanguage === "en"
          ? "We understand your decision. Thank you for your time."
          : "我们理解您的决定。感谢您的时间。"
      );
    }
  });
}
