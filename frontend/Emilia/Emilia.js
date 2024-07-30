let currentScene = 0;
let currentTextIndex = 0;
const MUSIC_PATH = "./Music/Immediate Music - From The Light.mp3";
const MAIN_PAGE_PATH = "../Main.html";
const MAIN_MAP_PATH = "../Map/map.html";
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
  bgm.volume = 0.5;
}

// 跳转到指定场景
function goToScene(scenePath) {
  window.location.href = scenePath;
}

document.addEventListener("DOMContentLoaded", () => {
  initializeAudio();


  const lastSigner = getLastSigner();

  startGame(lastSigner);

  // 禁用返回主页按钮
  const backMainButton = document.getElementById("back-main");
  backMainButton.style.display = "none";

  document.addEventListener("click", (event) => {
    if (event.target.id === "scene1") {
      goToScene("../Lisa/Lisa.html");
    } else if (event.target.id === "scene2") {
      goToScene("../Bob/Bob.html");
    }
  });
});

function startGame(lastSigner) {
  

  const textContainer = document.getElementById("text-container");
  const nextButton = document.getElementById("next-text-button");
  const prevButton = document.getElementById("prev-text-button");

  let dialogues;

  if (lastSigner === "Lisa" && !metEmilia["Lisa"]) {
    dialogues = [
      {
        en: [
          `Welcome to ${lastSigner}'s map. This is your first time meeting Emilia here.`,
        ],
        zh: [`欢迎来到${lastSigner}的地图。这是你第一次在这里遇到艾米莉亚。`],
      },
      {
        en: [
          `${lastSigner} has told me about you. It's nice to finally meet you in person.`,
        ],
        zh: [`${lastSigner}跟我提到过你。很高兴终于亲自见到你。`],
      },
    ];
    updateMetEmilia(lastSigner, true);
  } else if (lastSigner === "Ki" && !metEmilia["Ki"]) {
    dialogues = [
      {
        en: [
          "We are conducting the first public petition on the new energy K.",
        ],
        zh: ["我们正在进行关于新型能源K的第一次民意联署。"],
      },
      {
        en: [
          "Based on our research, promoting sustainable energy models is crucial for the future of the Earth's environment.",
        ],
        zh: [
          "根据我们的研究，推广可持续的能源模式对于未来的地球环境至关重要。",
        ],
      },
    ];
    updateMetEmilia(lastSigner, true);
 
  } else {
    dialogues = [
      {
        en: ["Welcome back to the Map."],
        zh: ["欢迎再次来到地图"],
      },
      {
        en: ["It's always a pleasure to see you."],
        zh: ["你好，见到你总是很愉快。"],
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
      currentTextIndex === scenes[currentScene].text[currentLanguage].length - 1
    ) {
      setTimeout(() => {
        // 如果是最后一个，显示签名提示
        showSignaturePrompt();
      }, 2000); // 延迟两秒显示提示
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
  if (signatures[lastSigner] !== null) {
    showAlert(
      currentLanguage === "en"
        ? "You have already signed this petition."
        : "你已经在这份联署书上签过名了。"
    );
    setTimeout(AfterEmilia, 3000);
    return;
  }

  showConfirm(message[currentLanguage], (confirmed) => {
    addSignature(lastSigner, confirmed);

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

    setTimeout(AfterEmilia, 1000);
  });
}


function AfterEmilia() {
  const lastSigner = getLastSigner();  // 使用 getLastSigner() 而不是直接从 localStorage 获取

  // 根据最后签名的人设置场景参数
  let sceneParam = "";
  if (lastSigner) {
    sceneParam = `?lastSigner=${lastSigner}`;
  }

  console.log("Scene parameter:", sceneParam);

  // 如果签名的人是 Lisa ，就不跳转，去普通地图
  if (lastSigner === "Lisa") {
    //到时候改成保安
    console.log("Redirecting to the guard scene");
    window.location.href = MAIN_MAP_PATH;
  } else { 
    //到时候改成保安
    window.location.href = MAIN_MAP_PATH; 
  } 
}
