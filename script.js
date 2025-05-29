// -------- Firebase Initialization (填入你的 config) --------
const firebaseConfig = {
  apiKey: "AIzaSyCat1HrcITV5w2hCzAuagnHHclsuePQKk4",
  authDomain: "manage-yourself-35038.firebaseapp.com",
  databaseURL: "https://manage-yourself-35038-default-rtdb.firebaseio.com",
  projectId: "manage-yourself-35038",
  storageBucket: "manage-yourself-35038.firebasestorage.app",
  messagingSenderId: "866147446706",
  appId: "1:866147446706:web:e851e78ef24022c0d07eab"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ==================== 年度目標小卡 ====================
const goalInputs = [
  document.getElementById('goal-input-1'),
  document.getElementById('goal-input-2'),
  document.getElementById('goal-input-3')
];
const goalBtn = document.getElementById('save-goal');
const fireworksContainer = document.getElementById('fireworks-container');
const goalInputGroup = document.getElementById('goal-input-group');
const goalDisplayList = document.getElementById('goal-display-list');

let isEditingGoal = true;

// 讀取年度目標
db.ref('goal').on('value', snap => {
  const arr = snap.val() || ["", "", ""];
  goalInputs.forEach((inp, i) => inp.value = arr[i] || "");
  showGoalMode(isEditingGoal, arr);
  goalBtn.textContent = isEditingGoal ? "儲存目標" : "修改目標";
});


// 按鈕切換：儲存/修改
goalBtn.onclick = async function () {
  if (isEditingGoal) {
    const data = goalInputs.map(inp => inp.value.trim());
    await db.ref('goal').set(data);
    isEditingGoal = false;
    showGoalMode(false, data);
    goalBtn.textContent = "修改目標";
    launchFireworks();
  } else {
    isEditingGoal = true;
    showGoalMode(true);
    goalBtn.textContent = "儲存目標";
    goalInputs[0].focus();
  }
};

function showGoalMode(editMode, dataArr) {
  if (editMode) {
    goalInputGroup.style.display = '';
    goalDisplayList.style.display = 'none';
  } else {

    // 顯示靜態目標
    goalInputGroup.style.display = 'none';
    goalDisplayList.style.display = '';
    const arr = dataArr || goalInputs.map(inp => inp.value.trim());
    goalDisplayList.innerHTML = '';
    arr.forEach((txt, idx) => {
      if (txt) {
        const div = document.createElement('div');
        div.className = 'goal-display-item';
        div.innerHTML = `<span class="crown">👑</span>${txt}`;
        goalDisplayList.appendChild(div);
      }
    });
    if (!goalDisplayList.children.length) {
      goalDisplayList.innerHTML = '<div style="color:#bbb;">（尚未設定目標）</div>';
    }
  }
}


//煙火動畫
function launchFireworks() {
  const colors = ['red', 'orange', 'yellow', 'blue', 'green', 'purple'];
  const numFireworks = 18;
  const cardRect = document.getElementById('goal-card').getBoundingClientRect();
  const container = fireworksContainer;
  container.innerHTML = ""; 
  const cx = container.offsetWidth / 2 || 200; 
  const cy = 80; 
  const R = 60;
  for (let i = 0; i < numFireworks; i++) {
    const angle = 2 * Math.PI * (i / numFireworks);
    const tx = Math.cos(angle) * R;
    const ty = Math.sin(angle) * R;
    const span = document.createElement('span');
    span.className = 'firework ' + colors[i % colors.length];
    span.style.left = cx + 'px';
    span.style.top = cy + 'px';
    span.style.setProperty('--tx', `${tx}px`);
    span.style.setProperty('--ty', `${ty}px`);
    container.appendChild(span);
    setTimeout(() => span.remove(), 1000);
  }
}

// ==================== 天氣小卡 ====================
function updateWeather(lat, lon) {
  const apiKey = "9deb1198e7f930fefc85d8dfe2f5c275";
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=zh_tw`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('weather-location').textContent = data.name || "未知地點";
      document.getElementById('weather-desc').textContent =
        (data.main ? `${Math.round(data.main.temp)}°C｜` : '') +
        (data.weather && data.weather[0] ? data.weather[0].description : '');
    })
    .catch(() => {
      document.getElementById('weather-location').textContent = "取得天氣失敗";
      document.getElementById('weather-desc').textContent = "";
    });
}
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    pos => updateWeather(pos.coords.latitude, pos.coords.longitude),
    () => { document.getElementById('weather-location').textContent = "請允許位置權限"; }
  );
} else {
  document.getElementById('weather-location').textContent = "不支援定位";
}

// ==================== 今日代辦小卡 ====================
function renderTodayTodoCard() {
  const todayStr = new Date().toISOString().slice(0, 10);
  db.ref(`calendarTodos/${todayStr}`).on('value', snap => {
    const ul = document.getElementById('today-todo-list');
    ul.innerHTML = '';
    const todos = snap.val() || [];
    todos.forEach(todo => {
      const li = document.createElement('li');
      li.textContent = todo;
      ul.appendChild(li);
    });
    if (!todos.length) ul.innerHTML = "<li>今天沒有特別事項！</li>";
  });
}
renderTodayTodoCard();

// ==================== 月曆區塊 ====================
const calendarDiv = document.getElementById('calendar');
const calendarForm = document.getElementById('calendar-todo-form');
const calendarTodoList = document.getElementById('calendar-todo-list');
const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
let selectedMonth = new Date();

function renderCalendar() {
  calendarDiv.innerHTML = '';
  const now = new Date();
  const y = selectedMonth.getFullYear();
  const m = selectedMonth.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const days = getDaysInMonth(y, m);
  // 週標題
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  weekDays.forEach(w => {
    const th = document.createElement('div');
    th.textContent = w;
    th.style.fontWeight = 'bold';
    calendarDiv.appendChild(th);
  });
  // 空格
  for (let i = 0; i < firstDay; i++) {
    calendarDiv.appendChild(document.createElement('div'));
  }
  // 取出所有 calendarTodos
  db.ref('calendarTodos').once('value', snap => {
    const todos = snap.val() || {};
    for (let d = 1; d <= days; d++) {
      const dateStr = `${y}-${(m + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      const dayDiv = document.createElement('div');
      dayDiv.className = 'calendar-day';
      dayDiv.textContent = d;
      if (dateStr === now.toISOString().slice(0, 10)) dayDiv.classList.add('today');
      if (todos[dateStr] && todos[dateStr].length) {
        const pin = document.createElement('span');
        pin.className = 'calendar-pin';
        pin.textContent = '📌' + todos[dateStr].length;
        dayDiv.appendChild(pin);
      }
      dayDiv.onclick = () => showDayTodos(dateStr);
      calendarDiv.appendChild(dayDiv);
    }
  });
}
function showDayTodos(dateStr) {
  db.ref(`calendarTodos/${dateStr}`).once('value', snap => {
    const list = snap.val() || [];
    calendarTodoList.innerHTML = `<h3 style="margin-top:0;">${dateStr} 事項：</h3>`;
    if (list.length === 0) {
      calendarTodoList.innerHTML += '<div>沒有事項！</div>';
      return;
    }
    const ul = document.createElement('ul');
    list.forEach(todo => {
      const li = document.createElement('li');
      li.textContent = todo;
      ul.appendChild(li);
    });
    calendarTodoList.appendChild(ul);
  });
}
// 新增事項
calendarForm.onsubmit = e => {
  e.preventDefault();
  const date = document.getElementById('calendar-date').value;
  const todo = document.getElementById('calendar-todo').value.trim();
  if (!date || !todo) return;
  db.ref(`calendarTodos/${date}`).once('value', snap => {
    const arr = snap.val() || [];
    arr.push(todo);
    db.ref(`calendarTodos/${date}`).set(arr, renderCalendar);
    if (date === new Date().toISOString().slice(0, 10)) renderTodayTodoCard();
    calendarForm.reset();
  });
};
renderCalendar();

// ==================== 代辦事項區塊 + 番茄鐘 ====================
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// 讀取
function renderTodoList() {
  db.ref('todos').once('value', snap => {
    const arr = snap.val() || [];
    todoList.innerHTML = '';
    // 先分成未完成與已完成
    const uncompleted = [];
    const completed = [];
    arr.forEach((item, idx) => {
      if (item.completed) {
        completed.push({ ...item, idx });
      } else {
        uncompleted.push({ ...item, idx });
      }
    });
    // 未完成逆序（新加在最上面），已完成正序
    uncompleted.reverse();
    // 合併
    const orderedTodos = [...uncompleted, ...completed];
    orderedTodos.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (item.completed ? ' completed' : '');
      // checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-checkbox';
      checkbox.checked = !!item.completed;
      checkbox.onchange = () => {
        // 找原本 index
        db.ref('todos').once('value', snap2 => {
          const arr2 = snap2.val() || [];
          arr2[item.idx].completed = checkbox.checked;
          db.ref('todos').set(arr2, renderTodoList);
        });
      };
      // 文字
      const span = document.createElement('span');
      span.textContent = item.text;
      // 刪除
      const del = document.createElement('button');
      del.className = 'todo-delete';
      del.textContent = '✖';
      del.onclick = () => {
        db.ref('todos').once('value', snap2 => {
          const arr2 = snap2.val() || [];
          arr2.splice(item.idx, 1);
          db.ref('todos').set(arr2, renderTodoList);
        });
      };
      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(del);
      todoList.appendChild(li);
    });
  });
}
todoForm.onsubmit = e => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  db.ref('todos').once('value', snap => {
    const arr = snap.val() || [];
    arr.push({ text, completed: false });
    db.ref('todos').set(arr, renderTodoList);
    todoForm.reset();
  });
};
renderTodoList();
db.ref('todos').on('value', renderTodoList);

// ==================== 番茄鐘 ====================
let workMinutes = 50, restMinutes = 10, cycleTimes = 1;
let currentCycle = 1;
let mode = "work"; // "work" or "rest"
let pomoTime = workMinutes * 60, pomoTimer, pomoRunning = false, pomoPaused = false;

const pomoDisplay = document.getElementById('pomodoro-timer');
const tomato = document.getElementById('tomato');

function updatePomo() {
  const min = Math.floor(pomoTime / 60).toString().padStart(2, '0');
  const sec = (pomoTime % 60).toString().padStart(2, '0');
  pomoDisplay.textContent = `${min}:${sec}`;
}

// 調整功能
function renderSettings() {
  document.getElementById('work-minutes').textContent = workMinutes;
  document.getElementById('rest-minutes').textContent = restMinutes;
  document.getElementById('cycle-times').textContent = cycleTimes;
}
function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

document.getElementById('work-minus').onclick = () => {
  workMinutes = clamp(workMinutes - 5, 5, 180);
  if (mode === "work" && !pomoRunning) {
    pomoTime = workMinutes * 60;
    updatePomo();
  }
  renderSettings();
};
document.getElementById('work-plus').onclick = () => {
  workMinutes = clamp(workMinutes + 5, 5, 180);
  if (mode === "work" && !pomoRunning) {
    pomoTime = workMinutes * 60;
    updatePomo();
  }
  renderSettings();
};
document.getElementById('rest-minus').onclick = () => {
  restMinutes = clamp(restMinutes - 5, 5, 60);
  if (mode === "rest" && !pomoRunning) {
    pomoTime = restMinutes * 60;
    updatePomo();
  }
  renderSettings();
};
document.getElementById('rest-plus').onclick = () => {
  restMinutes = clamp(restMinutes + 5, 5, 60);
  if (mode === "rest" && !pomoRunning) {
    pomoTime = restMinutes * 60;
    updatePomo();
  }
  renderSettings();
};
document.getElementById('cycle-minus').onclick = () => {
  cycleTimes = clamp(cycleTimes - 1, 1, 20);
  renderSettings();
};
document.getElementById('cycle-plus').onclick = () => {
  cycleTimes = clamp(cycleTimes + 1, 1, 20);
  renderSettings();
};

// 番茄鐘流程
function startPomo() {
  if (pomoRunning) return;
  pomoRunning = true;
  pomoPaused = false;
  tomato.classList.remove('sleeping');
  let tick = () => {
    if (!pomoRunning || pomoPaused) return;
    if (pomoTime > 0) {
      pomoTime--;
      updatePomo();
      pomoTimer = setTimeout(tick, 1000);
    } else {
      if (mode === "work") {
        mode = "rest";
        pomoTime = restMinutes * 60;
        updatePomo();
        alert("工作結束，休息一下吧！");
        startPomo();
      } else {
        if (currentCycle < cycleTimes) {
          currentCycle++;
          mode = "work";
          pomoTime = workMinutes * 60;
          updatePomo();
          alert("休息結束，開始下一輪工作！");
          startPomo();
        } else {
          pomoRunning = false;
          mode = "work";
          currentCycle = 1;
          tomato.classList.add('sleeping');
          alert('所有循環結束！');
        }
      }
    }
  };
  tick();
}
function pausePomo() {
  if (!pomoRunning) return;
  pomoPaused = !pomoPaused;
  if (!pomoPaused) {
    startPomo();
  }
}
function resetPomo() {
  clearTimeout(pomoTimer);
  pomoRunning = false;
  pomoPaused = false;
  mode = "work";
  currentCycle = 1;
  pomoTime = workMinutes * 60;
  tomato.classList.remove('sleeping');
  updatePomo();
}

document.getElementById('pomodoro-start').onclick = startPomo;
document.getElementById('pomodoro-pause').onclick = pausePomo;
document.getElementById('pomodoro-reset').onclick = resetPomo;

renderSettings();
resetPomo();