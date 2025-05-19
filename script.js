// === 導覽切換 ===
const todoBtn = document.getElementById("todoBtn");
const calendarBtn = document.getElementById("calendarBtn");
const todoSection = document.getElementById("todoSection");
const calendarSection = document.getElementById("calendarSection");

todoBtn.onclick = () => {
  todoSection.style.display = "flex";
  calendarSection.style.display = "none";
};

calendarBtn.onclick = () => {
  todoSection.style.display = "none";
  calendarSection.style.display = "block";
};

// === 倒數計時器 ===
let timerInterval;
let remainingSeconds = 0;

function startTimer() {
  const minutesInput = document.getElementById("minutes").value;
  if (!minutesInput || minutesInput <= 0) return;

  remainingSeconds = minutesInput * 60;

  updateCountdown();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    remainingSeconds--;
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
    }
    updateCountdown();
  }, 1000);
}

function updateCountdown() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  document.getElementById("countdown").textContent =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function pauseTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  clearInterval(timerInterval);
  remainingSeconds = 0;
  updateCountdown();
}

// === To-Do List ===
let todos = [];

function addTodo() {
  const input = document.getElementById("todoInput");
  const text = input.value.trim();
  if (text === "") return;

  const todo = { text, completed: false };
  todos.push(todo);
  input.value = "";
  renderTodos();
}

function renderTodos() {
  const list = document.getElementById("todoItems");
  list.innerHTML = "";

  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = todo.completed ? "completed" : "";

    li.textContent = todo.text;

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "完成";
    completeBtn.onclick = () => {
      todo.completed = !todo.completed;
      renderTodos();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "刪除";
    deleteBtn.onclick = () => {
      todos.splice(index, 1);
      renderTodos();
    };

    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// 每日午夜將行事曆事件加入 To-Do
function addDailyCalendarEventsToTodo() {
  const today = new Date().toISOString().slice(0, 10);
  if (calendarEvents[today]) {
    calendarEvents[today].forEach(event => {
      todos.push({ text: `[行事曆] ${event}`, completed: false });
    });
    renderTodos();
  }
}

function scheduleMidnightUpdate() {
  const now = new Date();
  const msToMidnight =
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
    now.getTime();

  setTimeout(() => {
    addDailyCalendarEventsToTodo();
    scheduleMidnightUpdate(); // 再次排程
  }, msToMidnight);
}

// === 行事曆 ===
const calendarEl = document.getElementById("calendar");
const eventList = document.getElementById("eventList");
let calendarEvents = {};

function generateCalendar() {
  calendarEl.innerHTML = "";
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 填補前導空白
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("div");
    calendarEl.appendChild(blank);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;

    const cell = document.createElement("div");
    cell.className = "calendar-day";
    const label = document.createElement("div");
    label.className = "date";
    label.textContent = day;
    cell.appendChild(label);

    const eventsDiv = document.createElement("div");
    eventsDiv.className = "events";
    if (calendarEvents[dateStr]) {
      eventsDiv.innerHTML = calendarEvents[dateStr].map(e => `<div>${e}</div>`).join("");
    }
    cell.appendChild(eventsDiv);

    calendarEl.appendChild(cell);
  }
}

function addEvent() {
  const date = document.getElementById("eventDate").value;
  const text = document.getElementById("eventText").value.trim();

  if (!date || !text) return;

  if (!calendarEvents[date]) {
    calendarEvents[date] = [];
  }

  calendarEvents[date].push(text);
  document.getElementById("eventText").value = "";
  generateCalendar();
}

// 初始化
generateCalendar();
scheduleMidnightUpdate();
addDailyCalendarEventsToTodo();
