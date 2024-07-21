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

document.addEventListener('DOMContentLoaded', () => {

  const backMainButton = document.getElementById('back-main');
  backMainButton.addEventListener('click', () => {
      window.location.href = '../Main.html'; // 确保这是正确的主页面路径
  });

});
