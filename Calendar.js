const calendarDays = document.getElementById('calendar-days');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

const eventForm = document.getElementById('event-form');
const eventDateInput = document.getElementById('event-date');
const eventDescInput = document.getElementById('event-desc');
const eventList = document.getElementById('event-list');
const eventMessage = document.getElementById('event-message');

let currentDate = new Date();
let selectedDate = null;
let events = JSON.parse(localStorage.getItem('calendarEvents') || '[]');

function formatDate(y, m, d) {
  return `${y}-${m.toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;
}

function saveEvents() {
  localStorage.setItem('calendarEvents', JSON.stringify(events));
}

// ➤ 渲染月曆
function renderCalendar() {
  calendarDays.innerHTML = '';

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent = `${year} 年 ${month + 1} 月`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const prevLastDay = new Date(year, month, 0).getDate();

  // 上月灰色日
  for (let i = startDay - 1; i >= 0; i--) {
    const div = document.createElement('div');
    div.classList.add('other-month');
    div.textContent = prevLastDay - i;
    calendarDays.appendChild(div);
  }

  // 本月日期
  for (let day = 1; day <= totalDays; day++) {
    const fullDateStr = formatDate(year, month + 1, day);
    const div = document.createElement('div');
    div.classList.add('calendar-day');

    const dayEvents = events.filter(e => e.date === fullDateStr);

    // 日期 + 📌 數
    const dateSpan = document.createElement('div');
    dateSpan.classList.add('day-number');
    if (dayEvents.length > 0) {
      dateSpan.textContent = `${day} 📌${dayEvents.length}`;
    } else {
      dateSpan.textContent = day;
    }
    div.appendChild(dateSpan);

    // 高亮今日
    const today = new Date();
    if (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    ) {
      div.classList.add('today');
    }

    // 若該日期是選擇的日期，添加 selected-day 樣式
    if (selectedDate === fullDateStr) {
      div.classList.add('selected-day');
    }

    div.addEventListener('click', () => {
      selectedDate = fullDateStr;
      eventDateInput.value = fullDateStr;

      // 移除所有日期的 selected-day 樣式
      document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected-day'));
      // 加上點擊日期的 selected-day 樣式
      div.classList.add('selected-day');

      renderEventList();
      eventDescInput.focus();
    });

    calendarDays.appendChild(div);
  }
}

// ➤ 渲染該日的行程列表（右欄）
function renderEventList() {
  eventList.innerHTML = '';

  const filteredEvents = selectedDate
    ? events.filter(ev => ev.date === selectedDate)
    : [];

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
        saveEvents();
        renderEventList();
        renderCalendar();
        eventMessage.textContent = '已刪除行程';
        setTimeout(() => { eventMessage.textContent = ''; }, 2000);
      }
    });

    div.appendChild(contentSpan);
    div.appendChild(deleteBtn);
    eventList.appendChild(div);
  });
}

// ➤ 新增行程
eventForm.addEventListener('submit', e => {
  e.preventDefault();

  const date = eventDateInput.value;
  const desc = eventDescInput.value.trim();

  if (!date || !desc) {
    alert('請輸入完整的日期與行程內容');
    return;
  }

  events.push({ date, desc });
  saveEvents();

  if (selectedDate === date) renderEventList();

  renderCalendar();

  eventMessage.textContent = '已新增行程！';
  setTimeout(() => { eventMessage.textContent = ''; }, 2000);

  eventDescInput.value = '';
  eventDescInput.focus();
});

// ➤ Enter 送出
eventDescInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    eventForm.requestSubmit();
  }
});

// 月份切換
prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});
nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// 初始化
renderCalendar();
