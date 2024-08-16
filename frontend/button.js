function updateButtonLanguage() {
    const translations = {
        en: {
            backMain: "Back to the Map",
            backMainScene: "Back to the Main Scene",
            clearInventory: "Clear the bag",
            bagContent: "Bag Content"
        },
        zh: {
            backMain: "返回地图",
            backMainScene: "返回主场景",
            clearInventory: "清空背包",
            bagContent: "背包内容"
        }
    };

    const currentTranslations = translations[currentLanguage];

    // 更新 "Back to the Map" 按钮
    //判断按钮是否存在
    if (document.getElementById('back-to-main')) {
        document.getElementById('back-to-main').textContent = currentTranslations.backMain;
    }

    // 更新 "back-main" 按钮
    if (document.getElementById('back-main')) {
        document.getElementById('back-main').textContent = currentTranslations.backMain;
    }

    //更新 back-main-scene 按钮
    if (document.getElementById('back-main-scene')) {
        document.getElementById('back-main-scene').textContent = currentTranslations.backMainScene;
    }

    // 更新 "Clear the bag" 按钮
    document.getElementById('clear-inventory').textContent = currentTranslations.clearInventory;

    // 更新 "Bag Content" 标题
    const bagContentTitle = document.querySelector('#inventory-popup h3');
    if (bagContentTitle) {
        bagContentTitle.textContent = currentTranslations.bagContent;
    }

    // 更新语言切换按钮
    document.getElementById('language-toggle').textContent = currentLanguage.toUpperCase();
}

// 在页面加载时调用更新函数
document.addEventListener('DOMContentLoaded', updateButtonLanguage);
 


