document.addEventListener('DOMContentLoaded', () => {
    const dialogueText = document.getElementById('dialogue-text');
    const prevButton = document.getElementById('prev-dialogue');
    const nextButton = document.getElementById('next-dialogue');
    const backButton = document.getElementById('back-to-main');

    const dialogues = [
        "Welcome to the first scene. You find yourself in a <span class='highlight' data-item='old key' data-image='../items/old-key.png'>dimly lit room</span>.",
        "The air is thick with dust, and you can barely make out the shapes of old furniture.",
        "On a nearby table, you notice a <span class='highlight' data-item='mysterious letter' data-image='../items/letter.png'>yellowed piece of paper</span>.",
        "As you move closer, you hear a faint <span class='highlight' data-item='eerie sound' data-image='../items/sound.png'>creaking sound</span> coming from the floorboards."
    ];

    let currentDialogue = 0;

    function updateDialogue() {
        dialogueText.innerHTML = dialogues[currentDialogue];
        prevButton.disabled = currentDialogue === 0;
        nextButton.disabled = currentDialogue === dialogues.length - 1;

        // Add click events to highlighted items
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
        if (currentDialogue < dialogues.length - 1) {
            currentDialogue++;
            updateDialogue();
        }
    });

    // Add event listener to back button
    backButton.addEventListener('click', () => {
        window.location.href = '../Main.html'; // 修改为主场景页面的路径
    });

    // Initialize the first dialogue
    updateDialogue();
});
