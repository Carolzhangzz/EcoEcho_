// 背景音乐
var bgm = new Howl({
  src: ["./Immediate Music - From The Light.mp3"],
  loop: true,
  volume: 0.1,
});

// 开始播放背景音乐
bgm.play();

document.addEventListener("DOMContentLoaded", () => {
  const startGameButton = document.getElementById("startButton");

  const backMainButton = document.getElementById("back-main");
  backMainButton.addEventListener("click", () => {
    window.location.href = "./Emilia/Emilia.html";
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
    const currentLanguage = localStorage.getItem("language") || "en";
    const isNewGame = startGameButton.textContent === (currentLanguage === "en" ? "Start New Game" : "开始新游戏");

    if (isNewGame) {
      console.log("Starting new game, resetting and redirecting to intro page");
      resetGame();
      window.location.href = "./Introduction/Intro.html";
    } else {
      console.log("Continuing game, redirecting to map page");
      window.location.href = "./Emilia/Emilia.html";
    }
  });
});