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
});

// Autoplay music on first click
document.body.addEventListener(
  "click",
  function playAudio() {
    bgm.play()
      .then(() => {
        musicToggle.textContent = "🔊";
        document.body.removeEventListener("click", playAudio);
      })
      .catch((error) => console.log("Autoplay still not allowed:", error));
  },
  { once: true }
);