// Firebase configuration (保持不變)
const firebaseConfig = {
    apiKey: "AIzaSyA147Q9C0iWu-eU2TVyqIKgEa-fgTNw2hk",
    authDomain: "final-project-33356.firebaseapp.com",
    projectId: "final-project-33356",
    storageBucket: "final-project-33356.appspot.com",
    messagingSenderId: "1034220970104",
    appId: "1:1034220970104:web:57573169fe866896878d8d"
};

// Smooth scrolling for navigation (保持不變)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});


// Annual Goal Functionality (保持不變)
const fireworksContainer = document.getElementById('fireworks-container');
const saveGoalBtn = document.getElementById('save-goal-btn');
const goalInputs = document.querySelectorAll('.goal-item');

let goalsSaved = false;

function createFireworkParticle(x, y, colorClass, container = fireworksContainer) {
    const particle = document.createElement('div');
    particle.classList.add('firework', colorClass);

    const angle = Math.random() * 2 * Math.PI;
    const distance = 50 + Math.random() * 50;

    const tx = Math.cos(angle) * distance + 'px';
    const ty = Math.sin(angle) * distance + 'px';

    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.setProperty('--tx', tx);
    particle.style.setProperty('--ty', ty);

    container.appendChild(particle); // 使用傳入的容器

    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// 觸發煙火動畫 (為了讓番茄鐘也能用，將它稍微修改)
function triggerFireworks(containerId = 'fireworks-container') {
    const targetContainer = document.getElementById(containerId);
    if (!targetContainer) {
        console.error(`Fireworks container with ID '${containerId}' not found.`);
        return;
    }

    const colors = ['red', 'orange', 'yellow', 'blue', 'green', 'purple'];
    const centerX = targetContainer.clientWidth / 2;
    const centerY = targetContainer.clientHeight / 2;

    for (let i = 0; i < 30; i++) {
        const color = colors[i % colors.length];
        setTimeout(() => createFireworkParticle(centerX, centerY, color, targetContainer), i * 30);
    }
}


function loadGoals() {
    goalInputs.forEach((input, index) => {
        const savedValue = localStorage.getItem(`goal-${index}`);
        if (savedValue) {
            input.value = savedValue;
        }
    });
    if (localStorage.getItem('goalsSaved') === 'true') {
        goalsSaved = true;
        saveGoalBtn.textContent = '修改目標';
        goalInputs.forEach(input => {
            input.disabled = true;
            input.classList.add('no-border');
        });
    }
}

function saveGoals() {
    goalInputs.forEach((input, index) => {
        localStorage.setItem(`goal-${index}`, input.value);
    });
    localStorage.setItem('goalsSaved', 'true');
}

function unlockGoals() {
    localStorage.setItem('goalsSaved', 'false');
}

saveGoalBtn.addEventListener('click', () => {
    if (!goalsSaved) {
        saveGoals();
        goalInputs.forEach(input => {
            input.disabled = true;
            input.classList.add('no-border');
        });
        saveGoalBtn.textContent = '修改目標';
        triggerFireworks('fireworks-container'); // 觸發年度目標的煙火
    } else {
        goalInputs.forEach(input => {
            input.disabled = false;
            input.classList.remove('no-border');
        });
        saveGoalBtn.textContent = '儲存目標';
        goalsSaved = false;
        unlockGoals();
    }
});

window.addEventListener('DOMContentLoaded', loadGoals);


// Calendar Functionality (保持不變)
const calendarDays = document.getElementById('calendar-days');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

const eventForm = document.getElementById('event-form');
const eventDateInput = document.getElementById('event-date');
const eventDescInput = document.getElementById('event-desc');
const eventList = document.getElementById('event-list');
const eventMessage = document.getElementById('event-message');

let currentCalendarDate = new Date();
let selectedCalendarDate = null;
let events = JSON.parse(localStorage.getItem('calendarEvents') || '[]');

function formatCalendarDate(y, m, d) {
    return `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
}

function saveCalendarEvents() {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
}

function renderCalendar() {
    calendarDays.innerHTML = '';

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    monthYear.textContent = `${year} 年 ${month + 1} 月`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const prevLastDay = new Date(year, month, 0).getDate();

    for (let i = startDay - 1; i >= 0; i--) {
        const div = document.createElement('div');
        div.classList.add('other-month');
        div.textContent = prevLastDay - i;
        calendarDays.appendChild(div);
    }

    for (let day = 1; day <= totalDays; day++) {
        const fullDateStr = formatCalendarDate(year, month + 1, day);
        const div = document.createElement('div');
        div.classList.add('calendar-day');

        const dayEvents = events.filter(e => e.date === fullDateStr);

        const dateSpan = document.createElement('div');
        dateSpan.classList.add('day-number');
        if (dayEvents.length > 0) {
            dateSpan.textContent = `${day} 📌${dayEvents.length}`;
        } else {
            dateSpan.textContent = day;
        }
        div.appendChild(dateSpan);

        const today = new Date();
        if (
            year === today.getFullYear() &&
            month === today.getMonth() &&
            day === today.getDate()
        ) {
            div.classList.add('today');
        }

        if (selectedCalendarDate === fullDateStr) {
            div.classList.add('selected-day');
        }

        div.addEventListener('click', () => {
            selectedCalendarDate = fullDateStr;
            eventDateInput.value = fullDateStr;

            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected-day'));
            div.classList.add('selected-day');

            renderEventList();
            eventDescInput.focus();
        });

        calendarDays.appendChild(div);
    }
}

function renderEventList() {
    eventList.innerHTML = '';

    const filteredEvents = selectedCalendarDate ?
        events.filter(ev => ev.date === selectedCalendarDate) :
        [];

    if (filteredEvents.length === 0) {
        eventList.textContent = '目前尚無行程';
        return;
    }

    filteredEvents.forEach(ev => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'space-between';
        div.style.padding = '6px 8px';
        div.style.borderBottom = '1px solid #eee';

        const contentSpan = document.createElement('span');
        contentSpan.textContent = `📌 ${ev.desc}`;
        contentSpan.style.flex = '1';
        contentSpan.style.whiteSpace = 'nowrap';
        contentSpan.style.overflow = 'hidden';
        contentSpan.style.textOverflow = 'ellipsis';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.style.border = 'none';
        deleteBtn.style.background = 'transparent';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.title = '刪除該行程';

        deleteBtn.addEventListener('click', () => {
            const index = events.findIndex(e => e.date === ev.date && e.desc === ev.desc);
            if (index > -1) {
                events.splice(index, 1);
                saveCalendarEvents();
                renderEventList();
                renderCalendar();
                eventMessage.textContent = '已刪除行程';
                setTimeout(() => {
                    eventMessage.textContent = '';
                }, 2000);
            }
        });

        div.appendChild(contentSpan);
        div.appendChild(deleteBtn);
        eventList.appendChild(div);
    });
}

eventForm.addEventListener('submit', e => {
    e.preventDefault();

    const date = eventDateInput.value;
    const desc = eventDescInput.value.trim();

    if (!date || !desc) {
        alert('請輸入完整的日期與行程內容');
        return;
    }

    events.push({
        date,
        desc
    });
    saveCalendarEvents();

    if (selectedCalendarDate === date) renderEventList();

    renderCalendar();

    eventMessage.textContent = '已新增行程！';
    setTimeout(() => {
        eventMessage.textContent = '';
    }, 2000);

    eventDescInput.value = '';
    eventDescInput.focus();
});

eventDescInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        eventForm.requestSubmit();
    }
});

prevMonthBtn.addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
});
nextMonthBtn.addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
});

// Initialize Calendar
renderCalendar();


// Pomodoro and To-Do List Functionality

// Pomodoro
let timerDisplay = document.getElementById('timer');
let startBtn = document.getElementById('start-btn');
let pauseBtn = document.getElementById('pause-btn');
let resetBtn = document.getElementById('reset-btn');
let workInput = document.getElementById('work-time');
let breakInput = document.getElementById('break-time');
let cyclesInput = document.getElementById('cycles-input');
let tomatoFace = document.querySelector('.face');
let tomatoElement = document.querySelector('.tomato');

// 階段定義
const PHASES = {
    WORK1: 'work1',
    BREAK: 'break',
    WORK2: 'work2'
};

let currentPhase = PHASES.WORK1;
let countdown = null;
let timeLeft = 0;
let isPaused = false;
let totalCycles = 1;
let completedCyclesCount = 0;

const pomodoroFireworksContainer = document.getElementById('pomodoro-fireworks-container');

// 用於管理 Z 字樣生成間隔的計時器 (此計時器將被移除，因為 Z 字樣不再出現)
let zSpawnInterval = null;


function updateDisplay() {
    let min = Math.floor(timeLeft / 60);
    let sec = timeLeft % 60;
    timerDisplay.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// 移除所有 Z 字樣 (此函數將被修改以移除 Z 的相關邏輯)
function clearSleepingZ() {
    // 之前用於清除 Z 字樣的邏輯將不再需要
    // 因為我們不會再生成 Z 字樣
    if (zSpawnInterval) {
        clearInterval(zSpawnInterval);
        zSpawnInterval = null;
    }
}

// 動態創建並附加 Z 字樣 (此函數將被移除，因為 Z 字樣不再出現)
function spawnSingleZ() {
    // 此函數的內容將被清空，因為我們不再生成 Z 字樣
}


function setTomatoState() {
    if (currentPhase === PHASES.BREAK) {
        tomatoElement.classList.add('sleeping'); // 給 .tomato 元素添加 'sleeping' 類別
        // 移除 Z 字樣生成相關的邏輯，因為現在是閉眼造型
        clearSleepingZ(); // 確保沒有舊的 Z 在那裡
    } else {
        tomatoElement.classList.remove('sleeping'); // 移除 'sleeping' 類別
        clearSleepingZ(); // 清除所有 Z 字樣 (如果存在，但在此情境下應該不會存在)
    }
    updateDisplay();
}

function toggleSettingsInputs(disable) {
    workInput.disabled = disable;
    breakInput.disabled = disable;
    if (cyclesInput) {
        cyclesInput.disabled = disable;
    }
}

function getPhaseTimeInSeconds() {
    const workTime = parseInt(workInput.value) || 30;
    const breakTime = parseInt(breakInput.value) || 10;

    if (currentPhase === PHASES.WORK1 || currentPhase === PHASES.WORK2) {
        return workTime * 60;
    } else if (currentPhase === PHASES.BREAK) {
        return breakTime * 60;
    }
    return 0;
}

function startTimer() {
    if (countdown) clearInterval(countdown);

    toggleSettingsInputs(true);

    countdown = setInterval(() => {
        if (!isPaused) {
            if (timeLeft <= 0) {
                clearInterval(countdown);

                if (currentPhase === PHASES.WORK1) {
                    alert(`工作結束 (1/2)，休息一下吧！(目前循環: ${completedCyclesCount + 1}/${totalCycles})`);
                    currentPhase = PHASES.BREAK;
                } else if (currentPhase === PHASES.BREAK) {
                    alert(`休息結束，開始工作 (2/2)！(目前循環: ${completedCyclesCount + 1}/${totalCycles})`);
                    currentPhase = PHASES.WORK2;
                } else if (currentPhase === PHASES.WORK2) {
                    completedCyclesCount++;
                    if (completedCyclesCount >= totalCycles) {
                        alert(`恭喜您，已完成所有 ${totalCycles} 個番茄鐘循環！`);
                        triggerFireworks('pomodoro-fireworks-container');
                        resetTimer(true);
                        return;
                    } else {
                        alert(`工作結束 (2/2)，準備開始第 ${completedCyclesCount + 1} / ${totalCycles} 個循環！`);
                        currentPhase = PHASES.WORK1;
                    }
                }
                timeLeft = getPhaseTimeInSeconds();
                startTimer();
                setTomatoState();
            } else {
                timeLeft--;
                updateDisplay();
            }
        }
    }, 1000);
}

function resetTimer(resetFull = true) {
    clearInterval(countdown);
    countdown = null;
    isPaused = false;

    if (resetFull) {
        currentPhase = PHASES.WORK1;
        completedCyclesCount = 0;
        totalCycles = (cyclesInput && parseInt(cyclesInput.value)) || 1;
        timeLeft = getPhaseTimeInSeconds();
        toggleSettingsInputs(false);
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
    } else {
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
    }

    updateDisplay();
    pauseBtn.textContent = '暫停';
    setTomatoState();
}

resetTimer(true);

startBtn.addEventListener('click', () => {
    totalCycles = (cyclesInput && parseInt(cyclesInput.value)) || 1;

    if (countdown === null) {
        currentPhase = PHASES.WORK1;
        timeLeft = getPhaseTimeInSeconds();
        isPaused = false;
    }

    isPaused = false;
    startTimer();
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    toggleSettingsInputs(true);
    setTomatoState();
});

pauseBtn.addEventListener('click', () => {
    if (!countdown) return;

    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '繼續' : '暫停';

    toggleSettingsInputs(isPaused ? false : true);
    setTomatoState();
});

resetBtn.addEventListener('click', () => {
    resetTimer(true);
});

workInput.addEventListener('input', () => {
    let newWorkTime = parseInt(workInput.value);
    if (isNaN(newWorkTime) || newWorkTime < 1) {
        newWorkTime = 1;
        workInput.value = 1;
    }

    if ((countdown === null || isPaused) && (currentPhase === PHASES.WORK1 || currentPhase === PHASES.WORK2)) {
        timeLeft = newWorkTime * 60;
    } else if (countdown === null) {
        timeLeft = newWorkTime * 60;
    }
    updateDisplay();
});

breakInput.addEventListener('input', () => {
    let newBreakTime = parseInt(breakInput.value);
    if (isNaN(newBreakTime) || newBreakTime < 1) {
        newBreakTime = 1;
        breakInput.value = 1;
    }

    if ((countdown === null || isPaused) && currentPhase === PHASES.BREAK) {
        timeLeft = newBreakTime * 60;
    }
    updateDisplay();
});

cyclesInput.addEventListener('input', () => {
    let newCycles = parseInt(cyclesInput.value);
    if (isNaN(newCycles) || newCycles < 1) {
        newCycles = 1;
        cyclesInput.value = 1;
    }
    if (countdown === null || isPaused) {
        totalCycles = newCycles;
    }
});


// --- To-Do List ---
const addBtn = document.getElementById('add-btn');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
renderTodos();

addBtn.addEventListener('click', () => {
    const text = todoInput.value.trim();
    if (text === '') return;

    const newTodo = {
        text,
        done: false
    };
    todos.push(newTodo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
});

todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addBtn.click();
    }
});

function markDone(index) {
    todos[index].done = !todos[index].done;
    // 將已完成的事項移動到列表末尾
    if (todos[index].done) {
        const [completedItem] = todos.splice(index, 1); // 移除並獲取完成的項目
        todos.push(completedItem); // 將其添加到末尾
    }
    saveTodos();
    renderTodos();
}

function deleteItem(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

let draggedItem = null; // 用於儲存正在被拖曳的項目

function renderTodos() {
    todoList.innerHTML = '';

    // 將未完成事項放在前面，已完成事項放在後面
    const incompleteTodos = todos.filter(item => !item.done);
    const completedTodos = todos.filter(item => item.done);

    const sortedTodos = [...incompleteTodos, ...completedTodos];

    sortedTodos.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (item.done ? ' completed' : '');
        li.setAttribute('data-index', index); // 設定 data-index 以便後續操作

        li.innerHTML = `
            <button class="mark-btn">${item.done ? '✔️' : '⬜'}</button>
            <span class="todo-text">${item.text}</span>
            <button class="delete-btn">❌</button>
        `;

        // 只有未完成事項才能拖曳
        if (!item.done) {
            li.setAttribute('draggable', 'true');
            li.addEventListener('dragstart', (e) => {
                draggedItem = li;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', li.innerHTML);
                li.classList.add('dragging'); // 添加拖曳時的樣式
            });

            li.addEventListener('dragend', () => {
                draggedItem.classList.remove('dragging');
                draggedItem = null;
            });

            li.addEventListener('dragover', (e) => {
                e.preventDefault(); // 允許放置
                if (draggedItem && draggedItem !== li && !li.classList.contains('completed')) {
                    // 確保只在未完成事項之間進行拖曳，並且不要在自己身上拖曳
                    const bounding = li.getBoundingClientRect();
                    const offset = bounding.y + (bounding.height / 2);
                    if (e.clientY - offset > 0) {
                        li.style.borderBottom = '2px solid #555';
                        li.style.borderTop = 'none';
                    } else {
                        li.style.borderTop = '2px solid #555';
                        li.style.borderBottom = 'none';
                    }
                }
            });

            li.addEventListener('dragleave', () => {
                li.style.borderBottom = 'none';
                li.style.borderTop = 'none';
            });

            li.addEventListener('drop', (e) => {
                e.preventDefault();
                li.style.borderBottom = 'none';
                li.style.borderTop = 'none';

                if (draggedItem && draggedItem !== li && !li.classList.contains('completed')) {
                    const fromIndex = parseInt(draggedItem.dataset.index);
                    const toIndex = parseInt(li.dataset.index);

                    // 實際操作原始的 todos 陣列
                    const incompleteOriginalIndices = todos
                        .map((item, idx) => ({ item, idx }))
                        .filter(entry => !entry.item.done)
                        .map(entry => entry.idx);

                    const originalFromIndex = incompleteOriginalIndices[fromIndex];
                    const originalToIndex = incompleteOriginalIndices[toIndex];


                    const [removed] = todos.splice(originalFromIndex, 1);
                    todos.splice(originalToIndex, 0, removed);

                    saveTodos();
                    renderTodos(); // 重新渲染列表以更新順序
                }
            });
        }

        todoList.appendChild(li);
    });

    document.querySelectorAll('.mark-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 由於 renderTodos 會重新排序，我們需要找到點擊按鈕對應的正確 todos 索引
            const listItem = e.target.closest('.todo-item');
            const clickedText = listItem.querySelector('.todo-text').textContent;
            const originalIndex = todos.findIndex(item => item.text === clickedText);
            
            if (originalIndex !== -1) {
                markDone(originalIndex);
            }
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const listItem = e.target.closest('.todo-item');
            const clickedText = listItem.querySelector('.todo-text').textContent;
            const originalIndex = todos.findIndex(item => item.text === clickedText);

            if (originalIndex !== -1) {
                deleteItem(originalIndex);
            }
        });
    });
}