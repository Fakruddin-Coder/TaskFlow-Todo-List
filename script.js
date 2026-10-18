const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');

let tasks = [
  { id: 1, title: 'Complete web development assignment', priority: 'High', completed: true, date: 'Today' },
  { id: 2, title: 'Practice JavaScript', priority: 'Medium', completed: false, date: 'Tomorrow' },
  { id: 3, title: 'Review DSA problems', priority: 'Low', completed: false, date: 'Oct 20, 2026' },
  { id: 4, title: 'Build personal project', priority: 'Medium', completed: false, date: 'Oct 22, 2026' }
];
let currentFilter = 'all';
let nextId = 5;

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  document.getElementById('totalCount').textContent = total;
  document.getElementById('completedCount').textContent = completed;
  document.getElementById('pendingCount').textContent = pending;
  document.getElementById('progressCount').textContent = progress + '%';
  document.getElementById('progressLabel').textContent = progress + '% completed';
  document.getElementById('progressBar').style.width = progress + '%';
}

function renderTasks() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = tasks.filter(task => {
    const matchesFilter = currentFilter === 'all' ||
      (currentFilter === 'completed' && task.completed) ||
      (currentFilter === 'pending' && !task.completed);
    return matchesFilter && task.title.toLowerCase().includes(query);
  });

  taskList.innerHTML = '';
  emptyState.classList.toggle('show', filtered.length === 0);
  if (!filtered.length) {
    emptyState.querySelector('h3').textContent = tasks.length ? 'No matching tasks' : 'No tasks yet';
    emptyState.querySelector('p').textContent = tasks.length ? 'Try another search or filter.' : 'Add your first task to get started.';
  }

  filtered.forEach((task, index) => {
    const row = document.createElement('article');
    row.className = 'task-row' + (task.completed ? ' completed' : '');
    row.style.animationDelay = `${Math.min(index * 45, 220)}ms`;

    const main = document.createElement('div');
    main.className = 'task-main';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-check';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Mark task completed');
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      renderTasks();
    });
    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = task.title;
    main.append(checkbox, title);

    const priority = document.createElement('span');
    priority.className = 'priority ' + task.priority;
    priority.textContent = task.priority === 'High' ? '🔥 High' : task.priority === 'Medium' ? '● Medium' : '● Low';

    const date = document.createElement('span');
    date.className = 'task-date';
    date.textContent = '▦ ' + task.date;

    const actions = document.createElement('div');
    actions.className = 'task-actions';
    const edit = document.createElement('button');
    edit.className = 'icon-btn';
    edit.type = 'button';
    edit.title = 'Edit task';
    edit.setAttribute('aria-label', 'Edit task');
    edit.textContent = '✎';
    edit.addEventListener('click', () => {
      const updated = prompt('Edit your task:', task.title);
      if (updated !== null && updated.trim()) {
        task.title = updated.trim();
        renderTasks();
      }
    });
    const remove = document.createElement('button');
    remove.className = 'icon-btn delete';
    remove.type = 'button';
    remove.title = 'Delete task';
    remove.setAttribute('aria-label', 'Delete task');
    remove.textContent = '♜';
    remove.addEventListener('click', () => {
      tasks = tasks.filter(item => item.id !== task.id);
      renderTasks();
    });
    actions.append(edit, remove);
    row.append(main, priority, date, actions);
    taskList.appendChild(row);
  });
  updateStats();
}

taskForm.addEventListener('submit', event => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) {
    taskInput.focus();
    return;
  }
  tasks.unshift({
    id: nextId++,
    title,
    priority: priorityInput.value,
    completed: false,
    date: 'Today'
  });
  taskInput.value = '';
  currentFilter = 'all';
  document.querySelectorAll('.filter').forEach(button => button.classList.toggle('active', button.dataset.filter === 'all'));
  searchInput.value = '';
  renderTasks();
  taskInput.focus();
});

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button));
    renderTasks();
  });
});
searchInput.addEventListener('input', renderTasks);

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  document.getElementById('themeToggle').textContent = isDark ? '☀' : '☾';
  document.getElementById('themeToggle').setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
});

renderTasks();
