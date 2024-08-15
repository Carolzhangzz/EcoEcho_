document.addEventListener("DOMContentLoaded", () => {
  const bgm = document.getElementById("bgm");
  const musicToggle = document.getElementById("music-toggle");
  bgm.src = "./Music/os.mp3";
  bgm.volume = 0.6;

  const languageModal = document.getElementById("languageModal");
  const startGameButton = document.getElementById("startButton");
  const backMainButton = document.getElementById("back-main");

  // 检查 localStorage 中是否已设置语言
  const currentLanguage = localStorage.getItem("language");
  
  console.log("current-language",currentLanguage);

  // 如果没有设置语言，则显示 modal
  if (currentLanguage === null || currentLanguage === undefined) {
    languageModal.style.display = "block";
  }

  // 使用全局 setLanguage 函数
  englishBtn.addEventListener("click", () => setNewLanguage("en"));
  chineseBtn.addEventListener("click", () => setNewLanguage("zh"));

  // 响应语言变化事件
  document.addEventListener("languageChanged", updateLanguage);

  function setNewLanguage(lang) {
    setLanguage(lang);
    // 隐藏 languageModal 并确保它不再显示
    languageModal.style.display = "none";
    languageModal.remove(); // 完全移除 modal 元素
  }

  // 响应语言变化事件
  function updateLanguage() {
    const currentLanguage = localStorage.getItem("language");
    if (currentLanguage === "en") {
      startGameButton.textContent = isGameStarted()
        ? "Continue Game"
        : "Start New Game";
    } else {
      startGameButton.textContent = isGameStarted() ? "继续游戏" : "开始新游戏";
    }
  }

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

  backMainButton.addEventListener("click", () => {
    window.location.href = "./Emilia/Emilia.html";
  });

  // 检查游戏是否已经开始
  function isGameStarted() {
    const gameStarted =
      lastSigner !== null && lastSigner !== undefined && lastSigner !== "";
    return gameStarted;
  }

  // 初始化时更新语言和按钮
  updateLanguage();

  // 修改开始游戏按钮的行为
  startGameButton.addEventListener("click", () => {
    const currentLanguage = localStorage.getItem("language");
    const isNewGame =
      startGameButton.textContent ===
      (currentLanguage === "en" ? "Start New Game" : "开始新游戏");
    if (isNewGame) {
      console.log("Starting new game, resetting and redirecting to intro page");
      window.location.href = "./Introduction/Intro.html";
    } else {
      console.log("Continuing game, redirecting to map page");
      window.location.href = "./Emilia/Emilia.html";
    }
  });
});
