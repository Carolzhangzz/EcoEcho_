document.addEventListener('DOMContentLoaded', () => {
    const dialogueText = document.getElementById('dialogue-text');
    const prevButton = document.getElementById('prev-dialogue');
    const nextButton = document.getElementById('next-dialogue');
    const backButton = document.getElementById('back-to-main');
    const musicToggle = document.getElementById('music-toggle');
    const languageToggle = document.getElementById('language-toggle');
    const bgm = document.getElementById('bgm');

    let currentLanguage = 'en';

    const dialogues = {
        en: [
            "Welcome to the first scene. You find yourself in a <span class='highlight' data-item='old key' data-image='../items/old-key.png'>dimly lit room</span>.",
            "The air is thick with dust, and you can barely make out the shapes of old furniture.",
            "On a nearby table, you notice a <span class='highlight' data-item='mysterious letter' data-image='../items/letter.png'>yellowed piece of paper</span>.",
            "As you move closer, you hear a faint <span class='highlight' data-item='eerie sound' data-image='../items/sound.png'>creaking sound</span> coming from the floorboards."
        ],
        zh: [
            "欢迎来到第一个场景。你发现自己身处一个<span class='highlight' data-item='old key' data-image='../items/old-key.png'>昏暗的房间</span>。",
            "空气中充满了灰尘，你几乎看不清旧家具的轮廓。",
            "在附近的桌子上，你注意到一张<span class='highlight' data-item='mysterious letter' data-image='../items/letter.png'>发黄的纸</span>。",
            "当你靠近时，你听到地板传来一阵微弱的<span class='highlight' data-item='eerie sound' data-image='../items/sound.png'>吱吱声</span>。"
        ]
    };

    let currentDialogue = 0;

    function updateDialogue() {
        dialogueText.innerHTML = dialogues[currentLanguage][currentDialogue];
        prevButton.disabled = currentDialogue === 0;
        nextButton.disabled = currentDialogue === dialogues[currentLanguage].length - 1;

        document.querySelectorAll('.highlight').forEach(item => {
            item.addEventListener('click', () => showPopup(item));
        });
    }

    prevButton.addEventListener('click', () => {
        if (currentDialogue > 0) {
            currentDialogue--;
            updateDialogue();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentDialogue < dialogues[currentLanguage].length - 1) {
            currentDialogue++;
            updateDialogue();
        }
    });

    backButton.addEventListener('click', () => {
        window.location.href = '../Map/map.html';
    });

    function toggleMusic() {
        if (bgm.paused) {
            bgm.play();
            musicToggle.textContent = '🔊';
        } else {
            bgm.pause();
            musicToggle.textContent = '🔇';
        }
    }

    musicToggle.addEventListener('click', toggleMusic);

    languageToggle.addEventListener("click", () => {
        if (currentLanguage === "en") {
            currentLanguage = "zh";
            setLanguage("zh");
            languageToggle.textContent = "CH";
        } else {
            currentLanguage = "en";
            setLanguage("en");
            languageToggle.textContent = "EN";
        }
        updateDialogue(); // 添加这行来更新对话
    });
    
    // 在初始化时，从 localStorage 获取语言设置
    currentLanguage = getLanguage();
    languageToggle.textContent = currentLanguage === "en" ? "EN" : "CH";

    bgm.src = '../Introduction/Music/Immediate Music - From The Light.mp3'; // 设置背景音乐路径
    bgm.volume = 0.5; // 设置音量

    // 尝试自动播放
    bgm.play().then(() => {
        musicToggle.textContent = '🔊';
    }).catch(() => {
        // 如果自动播放失败，显示提示
        const playPrompt = document.createElement('div');
        playPrompt.textContent = 'Click here to start the music';
        playPrompt.style.position = 'fixed';
        playPrompt.style.top = '50%';
        playPrompt.style.left = '50%';
        playPrompt.style.transform = 'translate(-50%, -50%)';
        playPrompt.style.padding = '20px';
        playPrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        playPrompt.style.color = 'white';
        playPrompt.style.cursor = 'pointer';
        playPrompt.style.borderRadius = '10px';
        playPrompt.style.zIndex = '1000';

        playPrompt.addEventListener('click', () => {
            toggleMusic();
            document.body.removeChild(playPrompt);
        });

        document.body.appendChild(playPrompt);
    });

    updateDialogue();
});