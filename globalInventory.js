// 全局背包系统
const inventoryIcon = document.getElementById('inventory-icon');
const inventoryPopup = document.getElementById('inventory-popup');
const inventoryItems = document.getElementById('inventory-items');

// 从 localStorage 加载背包内容
function loadInventory() {
    const inventory = JSON.parse(localStorage.getItem('gameInventory')) || [];
    inventoryItems.innerHTML = '';
    inventory.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<img src="${item.image}" alt="${item.name}" style="width: 30px; height: 30px;"> ${item.name}`;
        inventoryItems.appendChild(li);
    });
}

// 添加物品到背包
function addToInventory(item, itemImage) {
    const inventory = JSON.parse(localStorage.getItem('gameInventory')) || [];
    if (!inventory.some(i => i.name === item)) {
        inventory.push({ name: item, image: itemImage });
        localStorage.setItem('gameInventory', JSON.stringify(inventory));
        loadInventory();
        flashInventoryIcon();
    }
}

// 背包图标闪烁效果
function flashInventoryIcon() {
    inventoryIcon.classList.add('flash');
    setTimeout(() => {
        inventoryIcon.classList.remove('flash');
    }, 500);
}

// 显示/隐藏背包
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

// 显示弹出窗口并添加物品到背包
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

// 为高亮文本添加点击事件
function addHighlightListeners() {
    document.querySelectorAll('.highlight').forEach(item => {
        item.addEventListener('click', () => showPopup(item));
    });
}

// 初始加载背包
loadInventory();

// 导出全局函数
window.addToInventory = addToInventory;
window.showPopup = showPopup;
window.addHighlightListeners = addHighlightListeners;

// 在 DOMContentLoaded 事件中添加高亮监听器
document.addEventListener('DOMContentLoaded', () => {
    addHighlightListeners();
});