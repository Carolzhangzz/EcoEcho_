let isMusicPlaying = true;
document.addEventListener("DOMContentLoaded", () => {
  const musicToggleButton = document.getElementById("music-toggle");

  const initialBgm = new Audio("./Music/Sad.mp3");
  const secondBgm = new Audio("./Music/Sad.mp3");
  const kaneVoice = new Audio("./Music/Kane.mp3");

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
      en: "KI slumped into his chair, the room's familiar silence a stark contrast to the tumultuous thoughts in his mind.",
      zh: "KI瘫坐在椅子上，房间熟悉的寂静与他内心翻涌的思绪形成鲜明对比。",
    },
    {
      background: "./images/room.png",
      textStyle: "futuristic",
      en: "He’s growing more and more uneasy about his firm stance against advancing clean energy",
      zh: "他一直坚定的--- 阻碍清洁能源开发的念头，让他感到越来越不安。",
    },
    {
      background: "./images/room.png",
      textStyle: "futuristic",
      en: "Emilia's words, once dismissed by him... were they blinded by arrogance for so long?",
      zh: "曾经被他忽视的Emilia的话语...是否是傲慢蒙蔽了他如此之久？",
    },
    {
      background: "./images/room.png",
      textStyle: "futuristic",
      en: "Looking out at the gray sky, KI realized that change was not only inevitable but necessary. And it had to start with him.",
      zh: "看着窗外灰蒙蒙的天空，KI意识到改变不仅是不可避免的 – 更是必要的。而这一切必须从他开始。",
    },
    {
      background: "./images/room.png",
      textStyle: "futuristic",
      en: "Sitting in the room, he remembered a phrase his father once told him.",
      zh: "坐在房间里，他想起了儿时父亲对他说过的一段话",
    },
    {
      background: "./images/ruined_landscape.png",
      textStyle: "futuristic",
      en: "Dear KI, I know you must be surprised to hear my voice. I recorded this message before I left.",
      zh: "亲爱的KI, 我知道你一定很惊讶听到我的声音。这段录音是我在出发前录制的。",
      playKaneVoice: true,
      fatherSpeech: true,
    },
    {
      background: "./images/ruined_landscape.png",
      textStyle: "futuristic",
      en: "I want you to know that I went to explore the sustainable energy source T because I believe it's vital for the future of humanity.",
      zh: "我要告诉你, 我这次去探测可持续能源T, 是因为我深知这是为了全人类的未来。",
      fatherSpeech: true,
    },
    {
      background: "./images/ruined_landscape.png",
      textStyle: "futuristic",
      en: "Even though the mission was fraught with unknowns and dangers, I couldn't shirk this responsibility. I've always believed in the principles of sustainability; it's a way of being responsible for the future.",
      zh: "虽然任务充满了未知和危险，但我无法回避这个责任。我一直坚信可持续发展的理念，这是对未来负责的选择。",
      fatherSpeech: true,
    },
    {
      background: "./images/ruined_landscape.png",
      textStyle: "futuristic",
      en: "I hope you can understand the significance of this and share my beliefs.",
      zh: "希望你能够明白这其中的意义，并且认同我的想法。",
      fatherSpeech: true,
    },
    {
      background: "./images/ruined_landscape.png",
      textStyle: "futuristic",
      en: "We all have a duty to protect this world and leave a beautiful home for future generations.",
      zh: "我们都有责任去保护这个世界，为后代留下一个美好的家园。",
      fatherSpeech: true,
    },
    {
      background: "./images/ruined_landscape.png",
      textStyle: "futuristic",
      en: "No matter what the future holds, remember that you have a responsibility to humanity and the Earth.",
      zh: "无论未来怎样，请记住，你要为人类和地球负起责任。",
      fatherSpeech: true,
    },
    {
      background: "./images/ruined_landscape.png",
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
    //一旦开始更新对话，就禁用返回按钮
    const backButton = document.getElementById("back-to-main");
    backButton.disabled = true;
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
      const typingSpeed = currentLine >= 5 ? 130 : 70; // 5表示“亲爱的KI”的对话，越小越快
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
      // 所有对话结束后，显示返回按钮 
      backButton.disabled = false;
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
