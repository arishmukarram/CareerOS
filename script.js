const API_URL = '/api';

/* ============================
   TAB NAVIGATION
============================ */
function showTab(tabId, element) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  element.classList.add('active');
  localStorage.setItem('careeros-active-tab', tabId);
}

/* ============================
   THEME TOGGLE
============================ */
function toggleTheme() {
  const body = document.documentElement;
  const newTheme = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  body.setAttribute('data-theme', newTheme);
  fetch(`${API_URL}/user`, { 
    method: 'PUT', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({ theme: newTheme }) 
  });
}

/* ============================
   PROGRESS BAR
============================ */
function updateProgress() {
  const trackerChecks = document.querySelectorAll('.track-check');
  const total = trackerChecks.length;
  let completed = Array.from(trackerChecks).filter(c => c.checked).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  
  if (progressBar) progressBar.style.width = percentage + '%';
  if (progressText) progressText.innerText = percentage + '%';
}

/* ============================
   SYNC WITH MONGODB
============================ */
async function saveData(key, value) {
  const payload = {};
  payload[key] = value;
  await fetch(`${API_URL}/user`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

/* ============================
   TO-DO LIST (LocalStorage)
============================ */
const TODO_KEY = 'careeros-todos';
let todos = JSON.parse(localStorage.getItem(TODO_KEY) || '[]');

function saveTodos() { localStorage.setItem(TODO_KEY, JSON.stringify(todos)); renderTodos(); }

function addTodo(text, priority, due) {
  todos.unshift({ id: Date.now().toString(), text, priority, due, done: false });
  saveTodos();
}

function toggleTodo(id) {
  const t = todos.find(t => t.id === id);
  if (t) { t.done = !t.done; saveTodos(); }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
}

function renderTodos() {
  const listEl = document.getElementById('todo-list');
  const emptyEl = document.getElementById('todo-empty-state');
  
  if (todos.length === 0) {
      listEl.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'block';
  } else {
      if (emptyEl) emptyEl.style.display = 'none';
      listEl.innerHTML = todos.map(t => `
        <div class="todo-row ${t.done ? 'done' : ''}">
          <input type="checkbox" class="todo-check" ${t.done ? 'checked' : ''} onchange="toggleTodo('${t.id}')">
          <div class="todo-body">
            <div class="todo-text">${t.text}</div>
            <div class="todo-meta">
              <span class="todo-tag-pill ${t.priority}">${t.priority}</span>
              ${t.due ? `<span class="todo-due">📅 ${t.due}</span>` : ''}
            </div>
          </div>
          <button class="todo-delete" onclick="deleteTodo('${t.id}')">✕</button>
        </div>
      `).join('');
  }
  
  document.getElementById('todo-stat-total').textContent = todos.length;
  document.getElementById('todo-stat-done').textContent = todos.filter(t => t.done).length;
  document.getElementById('todo-stat-pending').textContent = todos.filter(t => !t.done).length;
}

/* ============================
   INITIALIZATION
============================ */
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Fetch saved data (MongoDB)
  try {
    const response = await fetch(`${API_URL}/user`);
    if (response.ok) {
      const data = await response.json();
      
      // Sync Theme
      if (data.theme) document.documentElement.setAttribute('data-theme', data.theme);

      // Loop through inputs
      const inputs = document.querySelectorAll('.save-input, .save-check, .track-check');
      inputs.forEach(el => {
        if (data[el.id] !== undefined) {
          if (el.type === 'checkbox') el.checked = data[el.id];
          else el.value = data[el.id];
        }
        el.addEventListener('change', (e) => {
          saveData(e.target.id, e.target.type === 'checkbox' ? e.target.checked : e.target.value);
          if(e.target.classList.contains('track-check')) updateProgress();
        });
      });
    }
  } catch (err) { console.error("Sync Error:", err); }

  // 2. Init To-Do List
  renderTodos();
  document.getElementById('todo-add-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo(
      document.getElementById('todo-input-text').value,
      document.getElementById('todo-input-priority').value,
      document.getElementById('todo-input-due').value
    );
    e.target.reset();
  });

  // 3. Restore UI State
  updateProgress();
  const savedTab = localStorage.getItem('careeros-active-tab');
  if (savedTab) {
    const btn = Array.from(document.querySelectorAll('.tab')).find(b => b.getAttribute('onclick').includes(savedTab));
    if (btn) showTab(savedTab, btn);
  }
});
