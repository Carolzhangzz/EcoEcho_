// 背景音乐
var bgm = new Howl({
  src: ["./Immediate Music - From The Light.mp3"],
  loop: true,
  volume: 0.5,
});

// 开始播放背景音乐
bgm.play();

document.addEventListener("DOMContentLoaded", () => {
  const startGameButton = document.getElementById("startButton");

  const backMainButton = document.getElementById("back-main");
  backMainButton.addEventListener("click", () => {
    window.location.href = "./Map/map.html"; // 
  });

  // 检查游戏是否已经开始
  function isGameStarted() {
    const gameStarted = lastSigner !== null && lastSigner !== undefined && lastSigner !== '';
    return gameStarted;
  }

  function updateStartButton() {
    const currentLanguage = localStorage.getItem("language") || "en";
    const gameStarted = isGameStarted();
    if (gameStarted) {
      startGameButton.textContent =
        currentLanguage === "en" ? "Continue Game" : "继续游戏";
    } else {
      startGameButton.textContent =
        currentLanguage === "en" ? "Start New Game" : "开始新游戏";
    }
  }

  // 初始化时更新按钮
  updateStartButton();

  // 修改开始游戏按钮的行为
  startGameButton.addEventListener("click", () => {
    const gameStarted = isGameStarted();
    console.log("Start button clicked. Game started:", gameStarted);
    if (gameStarted) {
      console.log("Redirecting to map page");
      window.location.href = "./Map/map.html";
    } else {
      console.log("Redirecting to intro page");
      window.location.href = "./Introduction/Intro.html";
    }
  });
});