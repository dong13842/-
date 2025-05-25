// 你的 Firebase 設定（請確認你 Firebase 專案設定無誤）
const firebaseConfig = {
  apiKey: "AIzaSyA147Q9C0iWu-eU2TVyqIKgEa-fgTNw2hk",
  authDomain: "final-project-33356.firebaseapp.com",
  projectId: "final-project-33356",
  storageBucket: "final-project-33356.appspot.com",
  messagingSenderId: "1034220970104",
  appId: "1:1034220970104:web:57573169fe866896878d8d"
};

// 平滑滾動（原有）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});

// 取得 DOM 元素
const fireworksContainer = document.getElementById('fireworks-container');
const saveBtn = document.getElementById('save-goal-btn');
const goalInputs = document.querySelectorAll('.goal-item');

let saved = false;

// 建立單一煙火粒子
function createFireworkParticle(x, y, colorClass) {
  const particle = document.createElement('div');
  particle.classList.add('firework', colorClass);

  // 隨機方向與距離
  const angle = Math.random() * 2 * Math.PI;
  const distance = 50 + Math.random() * 50;

  const tx = Math.cos(angle) * distance + 'px';
  const ty = Math.sin(angle) * distance + 'px';

  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  particle.style.setProperty('--tx', tx);
  particle.style.setProperty('--ty', ty);

  fireworksContainer.appendChild(particle);

  // 1秒後移除粒子
  setTimeout(() => {
    particle.remove();
  }, 1000);
}

// 觸發煙火動畫
function triggerFireworks() {
  const colors = ['red', 'orange', 'yellow', 'blue', 'green', 'purple'];
  const centerX = fireworksContainer.clientWidth / 2;
  const centerY = fireworksContainer.clientHeight / 2;

  for (let i = 0; i < 30; i++) {
    const color = colors[i % colors.length];
    setTimeout(() => createFireworkParticle(centerX, centerY, color), i * 30);
  }
}

// 從 localStorage 載入目標
function loadGoals() {
  goalInputs.forEach((input, index) => {
    const savedValue = localStorage.getItem(`goal-${index}`);
    if (savedValue) {
      input.value = savedValue;
    }
  });
  if (localStorage.getItem('goalsSaved') === 'true') {
    saved = true;
    saveBtn.textContent = '修改目標';
    goalInputs.forEach(input => {
      input.disabled = true;
      input.classList.add('no-border');
    });
  }
}

// 儲存目標到 localStorage
function saveGoals() {
  goalInputs.forEach((input, index) => {
    localStorage.setItem(`goal-${index}`, input.value);
  });
  localStorage.setItem('goalsSaved', 'true');
}

// 清除 localStorage 中的鎖定標記（不清除內容）
function unlockGoals() {
  localStorage.setItem('goalsSaved', 'false');
}

// 按鈕點擊事件
saveBtn.addEventListener('click', () => {
  if (!saved) {
    // 儲存目標，鎖定輸入框並移除框線，改按鈕文字，放煙火
    saveGoals();
    goalInputs.forEach(input => {
      input.disabled = true;
      input.classList.add('no-border');
    });
    saveBtn.textContent = '修改目標';
    saved = true;
    triggerFireworks();
  } else {
    // 修改目標，解除鎖定並恢復框線，改按鈕文字
    goalInputs.forEach(input => {
      input.disabled = false;
      input.classList.remove('no-border');
    });
    saveBtn.textContent = '儲存目標';
    saved = false;
    unlockGoals();
  }
});

// 頁面載入時執行
window.addEventListener('DOMContentLoaded', loadGoals);
