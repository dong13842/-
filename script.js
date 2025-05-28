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

// 在您的 script.js 文件中找到或新增此段代碼
document.addEventListener('DOMContentLoaded', () => {
    // ... 其他現有的 DOMContentLoaded 程式碼 ...

    // --- Navbar Toggle Logic ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarLinks = document.querySelector('.navbar-links');

    if (menuToggle && navbarLinks) {
        menuToggle.addEventListener('click', () => {
            navbarLinks.classList.toggle('active');
            menuToggle.classList.toggle('active'); // 添加類名用於漢堡圖標動畫
        });

        // 當點擊連結後，自動關閉菜單 (可選)
        navbarLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) { // 只在小螢幕觸發
                    navbarLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        });
    }
});

// --- Global DOM Elements and Helper Functions ---
// Annual Goal Section Elements
const fireworksContainer = document.getElementById('fireworks-container');
const saveGoalBtn = document.getElementById('save-goal-btn');
const goalInputs = document.querySelectorAll('.goal-item');

// Weather & Horoscope DOM elements
const weatherLocation = document.getElementById('weather-location');
const weatherTemp = document.getElementById('weather-temp');
const weatherDescription = document.getElementById('weather-description');
const horoscopeSelect = document.getElementById('horoscope-select');
const horoscopeResult = document.getElementById('horoscope-result');

// Calendar DOM elements
const calendarDays = document.getElementById('calendar-days');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const eventForm = document.getElementById('event-form');
const eventDateInput = document.getElementById('event-date');
const eventDescInput = document.getElementById('event-desc');
const eventList = document.getElementById('event-list');
const eventMessage = document.getElementById('event-message');

// Pomodoro DOM elements
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const workInput = document.getElementById('work-time');
const breakInput = document.getElementById('break-time');
const cyclesInput = document.getElementById('cycles-input');
const tomatoElement = document.querySelector('.tomato'); // The main tomato element

// To-Do List DOM elements
const addBtn = document.getElementById('add-btn');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');


// --- Fireworks Function (通用) ---
function createFireworkParticle(x, y, colorClass, container) {
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

    container.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// 觸發煙火動畫 (確保能傳入容器 ID)
function triggerFireworks(containerId) {
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


// --- Annual Goal Functionality ---
let goalsSaved = false;

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
        triggerFireworks('fireworks-container'); 
        goalsSaved = true;// Trigger fireworks for Annual Goal section
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


// --- Weather & Horoscope Section Logic ---
const OPENWEATHER_API_KEY = '9deb1198e7f930fefc85d8dfe2f5c275';
const CITY_NAME = 'Taipei'; 

const initWeatherHoroscope = () => {
    const fetchWeather = async () => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=zh_tw`);
            const data = await response.json();

            if (response.ok) {
                weatherLocation.textContent = `${data.name}, ${data.sys.country}`;
                weatherTemp.textContent = `${Math.round(data.main.temp)}°C`;
                weatherDescription.textContent = data.weather[0].description;
            } else {
                weatherLocation.textContent = '無法獲取天氣資訊';
                weatherTemp.textContent = '';
                weatherDescription.textContent = data.message;
                console.error('Error fetching weather:', data.message);
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
            weatherLocation.textContent = '載入天氣失敗';
            weatherTemp.textContent = '';
            weatherDescription.textContent = '請檢查網路連線或 API Key。';
        }
    };

    const getWeatherData = () => {
        if (navigator.geolocation) {
            weatherLocation.textContent = '正在獲取您的位置...';
            weatherTemp.textContent = '';
            weatherDescription.textContent = '';

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    fetchWeatherByCoordinates(latitude, longitude);
                },
                (error) => {
                    console.warn('Geolocation error:', error.code, error.message);
                    let errorMessage = '無法獲取您的位置。';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += '您已拒絕位置共享。';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += '位置資訊不可用。';
                            break;
                        case error.TIMEOUT:
                            errorMessage += '獲取位置超時。';
                            break;
                        default:
                            errorMessage += '發生未知錯誤。';
                            break;
                    }
                    weatherLocation.textContent = errorMessage;
                    weatherTemp.textContent = '';
                    weatherDescription.textContent = `將顯示 ${DEFAULT_CITY_NAME} 的天氣。`;
                    // Fallback to default city if geolocation fails
                    fetchWeatherByCityName(DEFAULT_CITY_NAME);
                },
                {
                    enableHighAccuracy: true, // 嘗試獲取高精確度位置
                    timeout: 5000,          // 5秒內未獲取到位置則超時
                    maximumAge: 0           // 不使用舊的緩存位置
                }
            );
        } else {
            console.warn('Geolocation is not supported by this browser.');
            weatherLocation.textContent = '您的瀏覽器不支援地理位置。';
            weatherTemp.textContent = '';
            weatherDescription.textContent = `將顯示 ${DEFAULT_CITY_NAME} 的天氣。`;
            // Fallback to default city if geolocation is not supported
            fetchWeatherByCityName(DEFAULT_CITY_NAME);
        }
    };

    // Horoscope data (simulated)
    const horoscopeData = {
        aries: "充滿活力，適合展開新計畫，但要小心衝動。",
        taurus: "財運亨通，適合處理財務問題，保持耐心。",
        gemini: "社交活躍，溝通順暢，但要避免說話過於輕率。",
        cancer: "家庭和睦，適合居家活動，多關心家人。",
        leo: "自信滿滿，適合展現領導力，但要留意與人合作。",
        virgo: "工作效率高，細節處理得當，注意身體健康。",
        libra: "人際關係良好，適合協商合作，保持平衡。",
        scorpio: "直覺敏銳，適合深入思考，避免過於執著。",
        sagittarius: "思維開闊，適合學習旅行，保持樂觀。",
        capricorn: "事業有成，適合專注目標，多注意休息。",
        aquarius: "創意無限，適合獨立思考，多參與社團活動。",
        pisces: "情感豐富，適合藝術創作，注意情緒起伏。"
    };

    const displayHoroscope = () => {
        const selectedHoroscope = horoscopeSelect.value;
        if (selectedHoroscope) {
            horoscopeResult.textContent = horoscopeData[selectedHoroscope] || "未知的星座運勢。";
        } else {
            horoscopeResult.textContent = "請選擇你的星座以查看今日運勢。";
        }
    };

    // Event Listeners for Weather & Horoscope
    horoscopeSelect.addEventListener('change', () => {
        displayHoroscope();
        // Save selected horoscope to localStorage
        localStorage.setItem('selectedHoroscope', horoscopeSelect.value);
    });

    // Initial load for weather and horoscope
    fetchWeather();
    const savedHoroscope = localStorage.getItem('selectedHoroscope');
    if (savedHoroscope) {
        horoscopeSelect.value = savedHoroscope;
        displayHoroscope();
    }
};

    const fetchWeatherByCoordinates = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=zh_tw`);
            const data = await response.json();

            if (response.ok) {
                weatherLocation.textContent = `${data.name}, ${data.sys.country}`;
                weatherTemp.textContent = `${Math.round(data.main.temp)}°C`;
                weatherDescription.textContent = data.weather[0].description;
            } else {
                console.error('Error fetching weather by coordinates:', data.message);
                weatherLocation.textContent = '無法獲取天氣資訊';
                weatherTemp.textContent = '';
                weatherDescription.textContent = `錯誤: ${data.message}`;
            }
        } catch (error) {
            console.error('Error fetching weather by coordinates:', error);
            weatherLocation.textContent = '載入天氣失敗';
            weatherTemp.textContent = '';
            weatherDescription.textContent = '請檢查網路連線或 API Key。';
        }
    };

    const fetchWeatherByCityName = async (cityName) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=zh_tw`);
            const data = await response.json();

            if (response.ok) {
                weatherLocation.textContent = `${data.name}, ${data.sys.country}`;
                weatherTemp.textContent = `${Math.round(data.main.temp)}°C`;
                weatherDescription.textContent = data.weather[0].description;
            } else {
                console.error('Error fetching weather by city name:', data.message);
                weatherLocation.textContent = '無法獲取天氣資訊';
                weatherTemp.textContent = '';
                weatherDescription.textContent = `錯誤: ${data.message}`;
            }
        } catch (error) {
            console.error('Error fetching weather by city name:', error);
            weatherLocation.textContent = '載入天氣失敗';
            weatherTemp.textContent = '';
            weatherDescription.textContent = '請檢查網路連線或 API Key。';
        }
    };

// --- Calendar Functionality ---
let currentCalendarDate = new Date();
let selectedCalendarDate = null;
// Ensure events is an object mapping dates to arrays of events
let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

function formatCalendarDate(y, m, d) {
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function saveCalendarEvents() {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
}

function renderCalendar() {
    calendarDays.innerHTML = '';

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    monthYear.textContent = `${year} 年 ${month + 1} 月`;

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Day of week (0 for Sunday)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Previous month's days
    for (let i = firstDayOfMonth; i > 0; i--) {
        const div = document.createElement('div');
        div.classList.add('other-month');
        div.textContent = daysInPrevMonth - i + 1;
        calendarDays.appendChild(div);
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const fullDateStr = formatCalendarDate(year, month + 1, day);
        const div = document.createElement('div');
        div.classList.add('calendar-day');

        const dayNumberSpan = document.createElement('span');
        dayNumberSpan.classList.add('day-number');
        dayNumberSpan.textContent = day;
        div.appendChild(dayNumberSpan);

        // Add event count if any
        if (events[fullDateStr] && events[fullDateStr].length > 0) {
            const eventCountSpan = document.createElement('span');
            eventCountSpan.classList.add('calendar-event-count');
            eventCountSpan.textContent = `${events[fullDateStr].length} 項`;
            dayNumberSpan.appendChild(eventCountSpan);
        }

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
            selectCalendarDate(fullDateStr);
        });

        calendarDays.appendChild(div);
    }

    // Next month's days to fill the grid (ensure 6 rows if needed)
    const totalDaysDisplayed = firstDayOfMonth + daysInMonth;
    const remainingDays = 42 - totalDaysDisplayed; // Max 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
        const div = document.createElement('div');
        div.classList.add('other-month');
        div.textContent = i;
        calendarDays.appendChild(div);
    }
}

function selectCalendarDate(date) {
    // Remove selected-day from all previous selections
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected-day'));

    // Add selected-day to the newly selected day
    const selectedDayElement = calendarDays.querySelector(`[data-date="${date}"]`);
    if (selectedDayElement) {
        selectedDayElement.classList.add('selected-day');
    } else {
        // If the element for the selected date is not in the current view, clear the selection
        selectedCalendarDate = null;
    }

    selectedCalendarDate = date; // Update the global selected date
    eventDateInput.value = date; // Update the form date input
    renderEventList(); // Display events for the selected date
    eventDescInput.focus(); // Focus on event description input
}

function renderEventList() {
    eventList.innerHTML = ''; // Clear existing list

    if (!selectedCalendarDate) {
        eventList.textContent = '請選擇日期。';
        return;
    }

    const filteredEvents = events[selectedCalendarDate] || [];

    if (filteredEvents.length === 0) {
        eventList.textContent = '此日期沒有行程。';
        return;
    }

    filteredEvents.forEach((event, index) => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'space-between';
        div.style.padding = '6px 8px';
        div.style.borderBottom = '1px solid #eee';

        const contentSpan = document.createElement('span');
        contentSpan.textContent = `📌 ${event.desc}`;
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
            // Remove the event using its index for the specific date
            events[selectedCalendarDate].splice(index, 1);
            if (events[selectedCalendarDate].length === 0) {
                delete events[selectedCalendarDate]; // Remove the date key if no events left
            }
            saveCalendarEvents();
            renderCalendar(); // Re-render calendar to update event counts
            renderEventList(); // Re-render event list
            eventMessage.textContent = '已刪除行程';
            setTimeout(() => {
                eventMessage.textContent = '';
            }, 2000);
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

    if (!events[date]) {
        events[date] = []; // Initialize array for this date if it doesn't exist
    }
    events[date].push({ desc }); // Add event description

    saveCalendarEvents();

    renderCalendar(); // Re-render to update event counts on calendar
    selectCalendarDate(date); // Reselect to update event list and highlight

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


// --- Pomodoro Timer Functionality ---
const PHASES = {
    WORK: 'work',
    BREAK: 'break',
};

let countdown = null;
let timeLeft = 0;
let isPaused = false;
let currentPhase = PHASES.WORK;
let totalCycles = 1;
let completedCyclesCount = 0;

const pomodoroFireworksContainer = document.getElementById('pomodoro-fireworks-container'); // This container should exist in HTML

function updateDisplay() {
    let min = Math.floor(timeLeft / 60);
    let sec = timeLeft % 60;
    timerDisplay.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function setTomatoState() {
    if (currentPhase === PHASES.BREAK) {
        tomatoElement.classList.add('sleeping'); // Add 'sleeping' class for break
    } else {
        tomatoElement.classList.remove('sleeping'); // Remove 'sleeping' class for work
    }
    updateDisplay();
}

function toggleSettingsInputs(disable) {
    workInput.disabled = disable;
    breakInput.disabled = disable;
    if (cyclesInput) { // Check if cyclesInput exists
        cyclesInput.disabled = disable;
    }
}

function getPhaseTimeInSeconds() {
    const workTime = parseInt(workInput.value) || 25; // Default to 25 if not set
    const breakTime = parseInt(breakInput.value) || 5; // Default to 5 if not set

    return currentPhase === PHASES.WORK ? workTime * 60 : breakTime * 60;
}

function startTimer() {
    if (countdown) clearInterval(countdown);

    toggleSettingsInputs(true);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;

    // Initialize timeLeft if starting a new session or resuming from pause
    if (!isPaused || timeLeft <= 0) {
        timeLeft = getPhaseTimeInSeconds();
    }
    isPaused = false; // Ensure it's not paused when starting

    setTomatoState(); // Update tomato appearance based on current phase

    countdown = setInterval(() => {
        if (!isPaused) {
            if (timeLeft <= 0) {
                clearInterval(countdown);
                // Play sound alert (You need an audio file for this, e.g., 'alarm.mp3')
                // new Audio('alarm.mp3').play().catch(e => console.error("Error playing sound:", e));
                alert(`${currentPhase === PHASES.WORK ? '工作' : '休息'}時間結束！`);

                if (currentPhase === PHASES.WORK) {
                    completedCyclesCount++;
                    if (completedCyclesCount >= totalCycles) {
                        alert(`恭喜您，已完成所有 ${totalCycles} 個番茄鐘循環！`);
                        triggerFireworks('pomodoro-fireworks-container'); // Trigger fireworks for Pomodoro section
                        resetTimer(true); // Full reset after all cycles are done
                        return;
                    }
                    currentPhase = PHASES.BREAK;
                } else {
                    currentPhase = PHASES.WORK;
                }
                timeLeft = getPhaseTimeInSeconds(); // Set time for next phase
                startTimer(); // Auto-start next phase
            } else {
                timeLeft--;
                updateDisplay();
            }
        }
    }, 1000);
}

function pauseTimer() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(countdown);
        pauseBtn.textContent = '繼續';
        toggleSettingsInputs(false); // Enable settings when paused
    } else {
        startTimer();
        pauseBtn.textContent = '暫停';
        toggleSettingsInputs(true); // Disable settings when running
    }
    setTomatoState(); // Update tomato appearance
}

function resetTimer(fullReset = true) {
    clearInterval(countdown);
    countdown = null;
    isPaused = false;
    pauseBtn.textContent = '暫停'; // Reset button text

    if (fullReset) {
        currentPhase = PHASES.WORK;
        completedCyclesCount = 0;
        totalCycles = parseInt(cyclesInput.value) || 1; // Get current cycles setting
        timeLeft = getPhaseTimeInSeconds();
        toggleSettingsInputs(false); // Enable settings
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
    } else {
        // Partial reset (e.g., after a phase ends but not all cycles)
        timeLeft = getPhaseTimeInSeconds();
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
        toggleSettingsInputs(true);
    }
    updateDisplay();
    setTomatoState(); // Update tomato appearance
}

// Initial setup for Pomodoro
resetTimer(true);

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', () => resetTimer(true)); // Full reset on button click

// Update time when input values change (only if timer is not running or is paused)
workInput.addEventListener('input', () => {
    let newWorkTime = parseInt(workInput.value);
    if (isNaN(newWorkTime) || newWorkTime < 1) newWorkTime = 1;
    workInput.value = newWorkTime; // Ensure input shows valid number
    if (countdown === null || isPaused) {
        if (currentPhase === PHASES.WORK) {
            timeLeft = newWorkTime * 60;
            updateDisplay();
        }
    }
});

breakInput.addEventListener('input', () => {
    let newBreakTime = parseInt(breakInput.value);
    if (isNaN(newBreakTime) || newBreakTime < 1) newBreakTime = 1;
    breakInput.value = newBreakTime; // Ensure input shows valid number
    if (countdown === null || isPaused) {
        if (currentPhase === PHASES.BREAK) {
            timeLeft = newBreakTime * 60;
            updateDisplay();
        }
    }
});

cyclesInput.addEventListener('input', () => {
    let newCycles = parseInt(cyclesInput.value);
    if (isNaN(newCycles) || newCycles < 1) newCycles = 1;
    cyclesInput.value = newCycles; // Ensure input shows valid number
    totalCycles = newCycles; // Update totalCycles immediately
});


// --- To-Do List Functionality ---
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let draggedItem = null; // Used for drag-and-drop

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';

    // Separate incomplete and completed todos for rendering
    const incompleteTodos = todos.filter(item => !item.done);
    const completedTodos = todos.filter(item => item.done);

    // Render incomplete todos first
    incompleteTodos.forEach((item, index) => {
        const li = createTodoListItem(item, index, false); // Pass isCompleted = false
        todoList.appendChild(li);
    });

    // Render completed todos next
    completedTodos.forEach((item, index) => {
        const li = createTodoListItem(item, incompleteTodos.length + index, true); // Adjust index for completed
        todoList.appendChild(li);
    });

    if (todos.length === 0) {
        todoList.innerHTML = '<p style="text-align: center; color: #777; margin-top: 20px;">目前沒有待辦事項。新增一個吧！</p>';
    }
}

function createTodoListItem(item, displayIndex, isCompleted) {
    const li = document.createElement('li');
    li.className = 'todo-item' + (isCompleted ? ' completed' : '');
    li.setAttribute('data-original-index', todos.findIndex(t => t === item)); // Store original index
    li.setAttribute('data-display-index', displayIndex); // Store display index for drag-and-drop

    // Only draggable if not completed
    if (!isCompleted) {
        li.setAttribute('draggable', 'true');
    }

    li.innerHTML = `
        <button class="mark-btn">${item.done ? '✔️' : '⬜'}</button>
        <span class="todo-text">${item.text}</span>
        <button class="delete-btn">❌</button>
    `;

    li.querySelector('.mark-btn').addEventListener('click', () => {
        const originalIndex = parseInt(li.dataset.originalIndex);
        markDone(originalIndex);
    });
    li.querySelector('.delete-btn').addEventListener('click', () => {
        const originalIndex = parseInt(li.dataset.originalIndex);
        deleteItem(originalIndex);
    });

    if (!isCompleted) {
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('dragleave', handleDragLeave);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('dragend', handleDragEnd);
    }

    return li;
}

function addTodo() {
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
}

function markDone(originalIndex) {
    if (originalIndex >= 0 && originalIndex < todos.length) {
        todos[originalIndex].done = !todos[originalIndex].done;
        // If an item is marked as done, we re-sort the todos array to move it to the end
        if (todos[originalIndex].done) {
            const [completedItem] = todos.splice(originalIndex, 1);
            todos.push(completedItem);
        }
        saveTodos();
        renderTodos();
    }
}

function deleteItem(originalIndex) {
    if (originalIndex >= 0 && originalIndex < todos.length) {
        todos.splice(originalIndex, 1);
        saveTodos();
        renderTodos();
    }
}

// Drag and Drop Handlers
function handleDragStart(e) {
    draggedItem = this;
    setTimeout(() => {
        draggedItem.classList.add('dragging');
    }, 0);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.originalIndex); // Pass original index
}

function handleDragOver(e) {
    e.preventDefault();
    if (draggedItem && draggedItem !== this && !this.classList.contains('completed')) {
        const bounding = this.getBoundingClientRect();
        const offset = bounding.y + (bounding.height / 2);
        if (e.clientY - offset > 0) {
            this.style.borderBottom = '2px solid #555';
            this.style.borderTop = 'none';
        } else {
            this.style.borderTop = '2px solid #555';
            this.style.borderBottom = 'none';
        }
    }
}

function handleDragLeave() {
    this.style.borderBottom = 'none';
    this.style.borderTop = 'none';
}

function handleDrop(e) {
    e.preventDefault();
    this.style.borderBottom = 'none';
    this.style.borderTop = 'none';

    if (draggedItem && draggedItem !== this && !this.classList.contains('completed')) {
        const fromOriginalIndex = parseInt(draggedItem.dataset.originalIndex);
        const toOriginalIndex = parseInt(this.dataset.originalIndex);

        // Find the actual position in the *currently displayed incomplete items*
        const incompleteTodosInOriginalOrder = todos.filter(item => !item.done);
        const draggedTodo = todos[fromOriginalIndex];

        // Find the index of the dragged item within the incomplete list
        const draggedIncompleteIndex = incompleteTodosInOriginalOrder.findIndex(item => item === draggedTodo);

        // Find the index of the target item within the incomplete list
        const targetTodo = todos[toOriginalIndex];
        const targetIncompleteIndex = incompleteTodosInOriginalOrder.findIndex(item => item === targetTodo);

        // Perform the splice operation on the `todos` array based on the original indices
        const [removed] = todos.splice(fromOriginalIndex, 1);

        // Determine the correct insertion point for the `removed` item
        // This is tricky because the original indices shift after `splice`.
        // A simpler way is to work with the filtered `incompleteTodos` array and then reconstruct `todos`.
        
        // Temporarily remove all completed items for sorting purposes
        let tempIncompleteTodos = todos.filter(item => !item.done);
        let tempCompletedTodos = todos.filter(item => item.done);

        // Find the position in the tempIncompleteTodos based on the new `targetIncompleteIndex`
        const draggedItemForReorder = tempIncompleteTodos.splice(draggedIncompleteIndex, 1)[0];
        tempIncompleteTodos.splice(targetIncompleteIndex, 0, draggedItemForReorder);

        // Reconstruct the main `todos` array
        todos = [...tempIncompleteTodos, ...tempCompletedTodos];
        
        saveTodos();
        renderTodos();
    }
}

function handleDragEnd() {
    if (draggedItem) {
        draggedItem.classList.remove('dragging');
        draggedItem = null;
    }
    // Remove border styles from all items after drag ends
    document.querySelectorAll('.todo-item').forEach(item => {
        item.style.borderBottom = 'none';
        item.style.borderTop = 'none';
    });
}


addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTodo();
    }
});


// --- Initialize All Sections on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    loadGoals(); // Initialize Annual Goals
    initWeatherHoroscope(); // Initialize Weather & Horoscope
    renderCalendar(); // Initialize Calendar
    resetTimer(true); // Initialize Pomodoro Timer
    renderTodos(); // Initialize To-Do List
});