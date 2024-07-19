// Music toggle logic
const musicToggle = document.getElementById("music-toggle");
let isMuted = false;

musicToggle.addEventListener("click", () => {
  if (isMuted) {
    bgm.muted = false;
    musicToggle.textContent = "🔊";
    isMuted = false;
  } else {
    bgm.muted = true;
    musicToggle.textContent = "🔇";
    isMuted = true;
  }
});
