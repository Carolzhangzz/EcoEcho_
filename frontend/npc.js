// 假设 currentLanguage 变量已在其他地方定义和更新
function updateTimelineIndicator() {
    const timelineIndicator = document.getElementById("timeline-indicator");
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
  
    if (currentLanguage === "zh") {
      timelineIndicator.textContent = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
    } else {
      timelineIndicator.textContent = `${year}-${month
        .toString()
        .padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")} ${hours}:${minutes}:${seconds}`;
    }
  }


  
  // 初始更新时间线指示器
  updateTimelineIndicator();
  
  // 每秒更新一次时间线指示器
  setInterval(updateTimelineIndicator, 1000);
  
  // 在语言切换时更新时间线指示器
  document.getElementById("language-toggle").addEventListener("click", () => {
    // 假设这里有切换 currentLanguage 的逻辑
    updateTimelineIndicator();
  });