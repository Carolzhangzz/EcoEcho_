let isMusicPlaying = true;
document.addEventListener("DOMContentLoaded", () => {
  const musicToggleButton = document.getElementById("music-toggle");

  musicToggleButton.addEventListener("click", () => {
    isMusicPlaying = !isMusicPlaying;
    musicToggleButton.textContent = isMusicPlaying ? "🔊" : "🔇";

    if (isMusicPlaying) {
      if (currentLine < 5) {
        initialBgm
          .play()
          .catch((error) => console.log("Initial BGM playback failed:", error));
      } else {
        secondBgm
          .play()
          .catch((error) => console.log("Second BGM playback failed:", error));
      }
      if (currentLine >= 5) {
        kaneVoice
          .play()
          .catch((error) =>
            console.log("Kane's voice playback failed:", error)
          );
      }
    } else {
      initialBgm.pause();
      secondBgm.pause();
      kaneVoice.pause();
    }
  });
  const textContainer = document.getElementById("text-container");
  const nextSceneButton = document.getElementById("next-scene");
  const backButton = document.getElementById("back-to-main");

  backButton.addEventListener("click", () => {
    window.location.href = "../Emilia/Emilia.html";
  });

  const initialBgm = new Audio("./Music/The lament of mankind.mp3");
  const secondBgm = new Audio("./Music/Sad.mp3");
  const kaneVoice = new Audio("./Music/Kane.mp3");

  // 设置初始背景音乐
  initialBgm.volume = 0.2;
  initialBgm.loop = true;

  // 设置Kane的录音
  kaneVoice.volume = 0.5;
  kaneVoice.loop = false;
  // 调整速度
  kaneVoice.playbackRate = 0.9;

  // 设置第二个背景音乐
  secondBgm.volume = 0.2;
  secondBgm.loop = true;

  let currentLine = 0;
  const dialogues = [
    {
      background: "./images/room.png",
      textStyle: "futuristic",
      en: "After the intense confrontation, KI realized he could no longer oppose sustainable energy.",
      zh: "经过激烈的对抗，KI意识到自己无法再反对可持续能源。",
    },
    {
      background: "./images/room.png",
      textStyle: "futuristic",
      en: "As he returned to the room, he felt a mix of regret for his past stance and a new resolve.",
      zh: "回到房间时，他对自己过去的立场感到遗憾，同时也感到一种新的决心。",
    },
    {
      background: "./images/room.png",
      textStyle: "futuristic",
      en: "What if he had acted sooner? What if he had listened to Emilia's warnings about sustainable energy?",
      zh: "如果他能更早行动，会不会有所不同？如果他能倾听Emilia关于可持续能源的警告，又会怎样？",
    },
    {
      background: "./images/room.png",
      textStyle: "futuristic",
      en: "But now was not the time for regrets. The future needed him to embrace change.",
      zh: "但现在不是懊悔的时候。未来需要他去拥抱变化。",
    },    
    {
      background: "./images/room.png",
      textStyle: "futuristic",
      en: "Sitting in the room, he remembered a phrase his father once told him.",
      zh: "坐在房间里，他想起了儿时父亲对他说过的一段话",
    },
    {
      background: "./images/room.png",
      textStyle: "futuristic",
      en: "I couldn't shirk this responsibility. I've always believed in the principles of sustainability; it's a way of being responsible for the future.",
      zh: "我一直坚信可持续发展的理念，这是对未来负责的选择。",
      fatherSpeech: true,
      playKaneVoice: true,
    },
    {
      background: "./images/room.png",
      textStyle: "futuristic",
      en: "I hope you can understand the significance of this and share my beliefs.",
      zh: "希望你能够明白这其中的意义，并且认同我的想法。",
      fatherSpeech: true,
    },
    {
      background: "./images/room.png",
      textStyle: "futuristic",
      en: "We all have a duty to protect this world and leave a beautiful home for future generations.",
      zh: "我们都有责任去保护这个世界，为后代留下一个美好的家园。",
      fatherSpeech: true,
    },
    {
      background: "./images/room.png",
      textStyle: "futuristic",
      en: "No matter what the future holds, remember that you have a responsibility to humanity and the Earth.",
      zh: "无论未来怎样，请记住，你要为人类和地球负起责任。",
      fatherSpeech: true,
    },
    {
      background: "./images/room.png",
      textStyle: "futuristic",
      en: "Love you, son.",
      zh: "爱你，儿子。",
      fatherSpeech: true,
    },
  ];
  
  function typeWriter(element, text, speed, callback) {
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
        if (callback) setTimeout(callback, 1000);
      }
    }, speed);
  }

  function updateDialogue() {
    if (currentLine < dialogues.length) {
      const currentDialogueObj = dialogues[currentLine];
      const dialogueElement = document.createElement("div");
      dialogueElement.className = "dialogue";
      if (currentDialogueObj.fatherSpeech) {
        dialogueElement.classList.add("father-speech");
      }
      textContainer.appendChild(dialogueElement);

      document.body.style.backgroundImage = `url('${currentDialogueObj.background}')`;
      document.body.className = currentDialogueObj.textStyle;

      // 如果是标记的对话，切换背景音乐并播放Kane的录音
      if (currentDialogueObj.playKaneVoice) {
        initialBgm.pause();
        if (isMusicPlaying) {
          secondBgm
            .play()
            .then(() => {
              setTimeout(() => {
                if (isMusicPlaying) {
                  kaneVoice
                    .play()
                    .catch((error) =>
                      console.log("Kane's voice playback failed:", error)
                    );
                }
              }, 3000);
            })
            .catch((error) =>
              console.log("Second BGM playback failed:", error)
            );
        }
      }

      // 设置打字速度
      const typingSpeed = currentLine >= 5 ? 150 : 70; // 5表示“亲爱的KI”的对话，越小越快
      typeWriter(
        dialogueElement,
        currentDialogueObj[currentLanguage],
        typingSpeed,
        () => {
          currentLine++;
          setTimeout(updateDialogue, 1000);
        }
      );
    } else {
      nextSceneButton.style.display = "block";
    }
  }

  function goToNextScene() {
    // 设置最后交互的"NPC"为Johnathan
    setLastSigner("Johnathan");
    // 跳转到Emilia页面
    window.location.href = "../EmiliaEnd/EmiliaEnd.html";
  }

  nextSceneButton.addEventListener("click", goToNextScene);
  nextSceneButton.style.display = "none";

  if (isMusicPlaying) {
    initialBgm
      .play()
      .catch((error) => console.log("Initial BGM playback failed:", error));
  }

  updateDialogue();
});
