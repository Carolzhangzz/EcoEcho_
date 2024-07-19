document.addEventListener('DOMContentLoaded', () => {
    const dialogueText = document.getElementById('dialogue-text');
    const prevButton = document.getElementById('prev-dialogue');
    const nextButton = document.getElementById('next-dialogue');
    const inventoryItems = document.getElementById('inventory-items');
    const inventoryIcon = document.getElementById('inventory-icon');
    const inventoryPopup = document.getElementById('inventory-popup');
    const backButton = document.getElementById('back-to-main');

    const dialogues = [
        "Welcome to the first scene. You find yourself in a <span class='highlight' data-item='old key' data-image='./items/old-key.png'>dimly lit room</span>.",
        "The air is thick with dust, and you can barely make out the shapes of old furniture.",
        "On a nearby table, you notice a <span class='highlight' data-item='mysterious letter' data-image='./items/letter.png'>yellowed piece of paper</span>.",
        "As you move closer, you hear a faint <span class='highlight' data-item='eerie sound' data-image='./items/sound.png'>creaking sound</span> coming from the floorboards."
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

    function showPopup(item) {
        const popup = document.createElement('div');
        const itemImage = item.dataset.image;
        popup.className = 'popup';
        popup.innerHTML = `<img src="${itemImage}" alt="${item.dataset.item}" class="popup-item">`;
        document.body.appendChild(popup);

        const itemRect = item.getBoundingClientRect();
        const iconRect = inventoryIcon.getBoundingClientRect();

        popup.style.left = `${itemRect.left + window.scrollX}px`;
        popup.style.top = `${itemRect.top + window.scrollY}px`;
        popup.style.width = '50px';
        popup.style.height = '50px';
        popup.style.position = 'absolute';
        popup.style.transition = 'transform 1s ease, opacity 1s ease';

        setTimeout(() => {
            popup.style.transform = `translate(${iconRect.left - itemRect.left + (iconRect.width / 2 - itemRect.width / 2)}px, ${iconRect.top - itemRect.top + (iconRect.height / 2 - itemRect.height / 2)}px) scale(0.1)`;
            popup.style.opacity = '0';
        }, 100);

        popup.addEventListener('transitionend', () => {
            if (popup.parentElement) {
                document.body.removeChild(popup);
                addToInventory(item.dataset.item, itemImage);
            }
        });
    }

    function addToInventory(item, itemImage) {
        const li = document.createElement('li');
        li.innerHTML = `<img src="${itemImage}" alt="${item}" style="width: 30px; height: 30px;"> ${item}`; // 设置背包中的物品图片大小
        inventoryItems.appendChild(li);
        flashInventoryIcon();
    }

    function flashInventoryIcon() {
        inventoryIcon.classList.add('flash');
        setTimeout(() => {
            inventoryIcon.classList.remove('flash');
        }, 500);
    }

    inventoryIcon.addEventListener('click', () => {
        inventoryPopup.classList.toggle('hidden');
        if (!inventoryPopup.classList.contains('hidden')) {
            inventoryPopup.style.display = 'block';
        } else {
            setTimeout(() => {
                inventoryPopup.style.display = 'none';
            }, 500); // 配合过渡时间
        }
    });

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
        window.location.href = 'Main.html'; // 修改为主场景页面的路径
    });

    // Initialize the first dialogue
    updateDialogue();
});
