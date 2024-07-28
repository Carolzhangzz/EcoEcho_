
let currentScene = 0;
let currentTextIndex = 0;
const MUSIC_PATH = "./Music/Immediate Music - From The Light.mp3";
const MAIN_PAGE_PATH = "../Main.html";
let bgm;

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

function goToScene(scenePath) {
  window.location.href = scenePath;
}

document.addEventListener("DOMContentLoaded", () => {
  initializeAudio();
 
  startGame();
  const backMainButton = document.getElementById("back-main");
  if (backMainButton) {
    backMainButton.addEventListener("click", () => goToScene(MAIN_PAGE_PATH));
  }

  document.addEventListener("click", (event) => {
    if (event.target.id === "scene1") {
      goToScene("../Lisa/Lisa.html");
    } else if (event.target.id === "scene2") {
      goToScene("../Bob/Bob.html");
    }
  });
  bgm.play();
});


function startGame() {
  console.log("Starting game");

  const textContainer = document.getElementById("text-container");
  const nextButton = document.getElementById("next-text-button");
  const prevButton = document.getElementById("prev-text-button");

  const scenes = [
    {
      text: {
        en: ["Welcome to the Map."],
        zh: ["欢迎来到地图"],
      },
      background: "./map.png",
      textStyle: "futuristic",
      character: "./npc/Emilia.png",
    },
    {
      text: {
        en: ["hi, beautiful you"],
        zh: ["你好,美丽的你"],
      },
      background: "./map.png",
      textStyle: "futuristic",
      character: "./npc/Emilia.png",
    },
  ];

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
    console.log("Updating scene to index:", currentScene);
    document.body.style.backgroundImage = `url('${scene.background}')`;
    displayText();

    if (scene.isBlackScreen) {
      window.location.href = "./black_screen.html"; // 移除了 './'
    }
    // Update character image
    const characterImage = document.getElementById("character-image");
    if (scene.character) {
      characterImage.src = scene.character;
      characterImage.style.display = "block";
    } else {
      characterImage.style.display = "none";
    }
  };

  nextButton.addEventListener("click", () => {
    currentTextIndex++;
    if (currentTextIndex >= scenes[currentScene].text[currentLanguage].length) {
      currentScene++;
      if (currentScene >= scenes.length) {
        window.location.href = "./black_screen.html"; // 移除了 './'
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
