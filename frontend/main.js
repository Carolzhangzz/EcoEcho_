
document.addEventListener("DOMContentLoaded", () => {
  const bgm = document.getElementById("bgm");
  const musicToggle = document.getElementById("music-toggle");
  bgm.src = "./os.mp3";
  bgm.volume = 0.6;

  document.body.addEventListener(
    "click",
    function playAudio() {
      bgm
        .play()
        .then(() => {
          musicToggle.textContent = "🔊";
          document.body.removeEventListener("click", playAudio);
        })
        .catch((error) => console.log("Autoplay still not allowed:", error));
    },
    { once: true }
  );

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