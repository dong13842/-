const addBtn = document.getElementById('add-btn');
const todoInput = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority-select');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  // 清空四個分類區清單
  ['light', 'heavy', 'slow', 'urgent'].forEach(cat => {
    document.getElementById(`todo-list-${cat}`).innerHTML = '';
  });

  todos.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (item.done ? ' done' : '');
    li.draggable = true;
    li.dataset.index = index;

    li.innerHTML = `
      <span class="todo-text${item.done ? ' done-text' : ''}">${item.text}</span>
      <div class="todo-buttons">
        <button class="mark-btn" data-index="${index}">${item.done ? '✅' : '⬜'}</button>
        <button class="delete-btn" data-index="${index}">🗑️</button>
      </div>
    `;

    // 拖曳開始事件
    li.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', index);
    });

    document.getElementById(`todo-list-${item.category}`).appendChild(li);
  });

  // 標記完成按鈕事件
  document.querySelectorAll('.mark-btn').forEach(btn => {
    btn.onclick = (e) => {
      const idx = e.target.dataset.index;
      markDone(idx);
    };
  });

  // 刪除按鈕事件
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = (e) => {
      const idx = e.target.dataset.index;
      deleteItem(idx);
    };
  });
}

addBtn.addEventListener('click', () => {
  addTodo();
});

// 支援按 Enter 鍵新增
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
});

function addTodo() {
  const text = todoInput.value.trim();
  const category = prioritySelect.value;

  if (text === '') return;

  todos.push({ text, done: false, category });
  saveTodos();
  renderTodos();

  todoInput.value = '';
}

function markDone(index) {
  todos[index].done = !todos[index].done;
  saveTodos();
  renderTodos();
}

function deleteItem(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

// 拖曳區塊監聽，改變分類
['light', 'heavy', 'slow', 'urgent'].forEach(cat => {
  const ul = document.getElementById(`todo-list-${cat}`);

  ul.addEventListener('dragover', (e) => {
    e.preventDefault(); // 允許放置
  });

  ul.addEventListener('drop', (e) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData('text/plain');
    if (draggedIndex === '') return;
    todos[draggedIndex].category = cat;
    saveTodos();
    renderTodos();
  });
});

// 頁面載入時渲染
renderTodos();
