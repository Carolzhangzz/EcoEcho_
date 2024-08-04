let currentNpcName = "Player";
document.addEventListener("DOMContentLoaded", () => {
  const textContainer = document.getElementById("text-container");
  const backButton = document.getElementById("back-to-main");
  const bgm = document.getElementById("bgm");

  backButton.addEventListener("click", () => {
    window.location.href = "../Emilia/Emilia.html";
  });

  let currentLine = 0;
  const dialogues = [
    {
      background: "./images/summary_background.png",
      textStyle: "futuristic",
      en: "Congratulations on completing all scenes. Please review your signing status:",
      zh: "恭喜你完成了所有的场景。请回顾你的联署情况：",
    },
    // 这里将添加签名情况的对话
  ];

  function generateSignatureSummary() {
    const signatures = JSON.parse(localStorage.getItem("signatures")) || {};
    const validKeys = ["Ki", "Lisa", "Bob", "Jonathan"];

    return validKeys.map((key, index) => {
      const value = signatures[key];
      let status;
      if (value === null) {
        status = { en: "Not encountered", zh: "未遇到" };
      } else if (value === false) {
        status = { en: "Refused to sign", zh: "拒绝签署" };
      } else if (typeof value === "number") {
        status = { en: "Signed", zh: "已签署" };
      } else {
        status = { en: "Unknown", zh: "未知" };
      }
      const ordinal = {
        en: ["First", "Second", "Third", "Fourth"][index],
        zh: ["第一次", "第二次", "第三次", "第四次"][index],
      };
      return {
        background: "./images/summary_background.png",
        textStyle: "futuristic",
        en: `${ordinal.en}: ${status.en}`,
        zh: `${ordinal.zh}: ${status.zh}`,
      };
    });
  }

  dialogues.push(...generateSignatureSummary());

  dialogues.push({
    background: "./images/summary_background.png",
    textStyle: "futuristic",
    en: "Thank you for participating in our research.",
    zh: "感谢您参与我们的研究。",
  });

  function typeWriter(element, text, callback) {
    bgm.play();
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        if (text.substr(index, 6) === "<span ") {
          const endIndex = text.indexOf("</span>", index) + 7;
          element.innerHTML += text.substring(index, endIndex);
          index = endIndex;
        } else {
          element.innerHTML += text.charAt(index);
          index++;
        }
      } else {
        clearInterval(interval);
        if (callback) setTimeout(callback, 300);
      }
    }, 50);
  }

  function updateDialogue() {
    if (currentLine < dialogues.length) {
      const currentDialogueObj = dialogues[currentLine];
      const dialogueElement = document.createElement("div");
      dialogueElement.className = "dialogue";
      textContainer.appendChild(dialogueElement);

      document.body.style.backgroundImage = `url('${currentDialogueObj.background}')`;
      document.body.className = currentDialogueObj.textStyle;

      typeWriter(dialogueElement, currentDialogueObj[currentLanguage], () => {
        const highlights = dialogueElement.querySelectorAll(".highlight");
        setLastSigner(currentNpcName);
        highlights.forEach((item) => {
          addToInventory(item.dataset.item, item.dataset.image);
        });

        highlights.forEach((item) => {
          item.addEventListener("click", () => showPopup(item));
        });

        currentLine++;
        setTimeout(updateDialogue, 1000);
      });
    } else {
      // 所有对话结束后，显示返回按钮
      backButton.style.display = "block";
    }
  }

  bgm.src = "./Music/The lament of mankind.mp3";
  bgm.volume = 0.1;

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

  updateDialogue();
});
