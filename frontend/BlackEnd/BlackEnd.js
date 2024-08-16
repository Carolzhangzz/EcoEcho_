let currentNpcName = "Player";
document.addEventListener("DOMContentLoaded", () => {
  const textContainer = document.getElementById("text-container");
  const backButton = document.getElementById("back-to-main");
  const bgm = document.getElementById("bgm");

  const exportHistoryButton = document.getElementById("export-history");
  exportHistoryButton.addEventListener("click", exportInputHistory);

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
    // // 这里将添加投票情况的对话
  ];

  function generateSignatureSummary() {
    const signatures = JSON.parse(localStorage.getItem("signatures")) || {};
    const validKeys = ["Ki", "Lisa", "Bob", "Johnathan"];

    return validKeys.map((key, index) => {
      const value = signatures[key];
      let status;
      if (value === null) {
        status = { en: "Not encountered", zh: "未遇到" };
      } else if (typeof value === "number") {
        status = { en: `${value} vote(s)`, zh: `${value} 票` };
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

  // Add final decision display
  const finalDecision = getFinalDecision();
  if (finalDecision !== null) {
    dialogues.push({
      background: "./images/summary_background.png",
      textStyle: "futuristic",
      en: `Your final decision: ${
        finalDecision
          ? "Continue to prevent the development of clean energy T"
          : "Stop preventing the development of clean energy T"
      }`,
      zh: `你最后的决定：${
        finalDecision
          ? "继续阻止清洁能源 T 的开发"
          : "停止阻止清洁能源 T 的开发"
      }`,
    });
  }

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
    // 一旦开始更新对话，就禁用返回按钮
    backButton.disabled = true;
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
        setTimeout(updateDialogue, 10);
      });
    } else {
      // 所有对话结束后，启用返回按钮
      backButton.disabled = false;
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

function exportInputHistory() {
  const history = getPlayerInputHistory();

  // 格式化历史记录
  const formattedHistory = history
    .map((entry) => {
      if (entry.type === "user") {
        return `Player: ${entry.content}`;
      } else {
        return `${entry.speaker}: ${entry.content}`;
      }
    })
    .join("\n");

  // 创建 Blob 和下载链接
  const blob = new Blob([formattedHistory], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "player_input_history.txt";
  a.click();
  URL.revokeObjectURL(url);
}

// // 在页面关闭或刷新时导出统计数据
// window.addEventListener('beforeunload', function(event) {
//   exportInputHistory();
// });

// Function to get the final decision (should be defined in your global scope)
function getFinalDecision() {
  const storedDecision = localStorage.getItem("finalDecision");
  return storedDecision ? JSON.parse(storedDecision) : null;
}
