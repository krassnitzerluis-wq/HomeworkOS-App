const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const subjectSelect = document.getElementById('subjectSelect');
const dueDate = document.getElementById('dueDate');
const prioritySelect = document.getElementById('prioritySelect');

const todayCount = document.getElementById('todayCount');
const tomorrowCount = document.getElementById('tomorrowCount');
const weekCount = document.getElementById('weekCount');
const doneCount = document.getElementById('doneCount');

const dashboardBtn = document.getElementById('dashboardBtn');
const tasksBtn = document.getElementById('tasksBtn');
const calendarBtn = document.getElementById('calendarBtn');
const notesBtn = document.getElementById('notesBtn');
const statsBtn = document.getElementById('statsBtn');
const examBtn = document.getElementById('examBtn');
const settingsBtn = document.getElementById('settingsBtn');
const backupBtn = document.getElementById('backupBtn');
const trashBtn = document.getElementById('trashBtn');
const pageTitle = document.getElementById('pageTitle');
const dashboardSection = document.getElementById('dashboardSection');
const newTaskSection = document.getElementById('newTaskSection');
const taskSection = document.getElementById('taskSection');
const notesSection = document.getElementById('notesSection');
const notesInput = document.getElementById('notesInput');
const statsSection = document.getElementById('statsSection');
const statsDone = document.getElementById('statsDone');
const statsOpen = document.getElementById('statsOpen');
const statsHigh = document.getElementById('statsHigh');
const statsChart = document.getElementById('statsChart');
const calendarSection = document.getElementById('calendarSection');
const calendarList = document.getElementById('calendarList');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const examSection = document.getElementById('examSection');
const examInput = document.getElementById('examInput');
const examSubjectSelect = document.getElementById('examSubjectSelect');
const addExamButton = document.getElementById('addExamButton');
const examList = document.getElementById('examList');
const settingsSection = document.getElementById('settingsSection');
const exportBtn = document.getElementById('exportBtn');
const importInput = document.getElementById('importInput');

const calendarGrid = document.getElementById('calendarGrid');
const currentMonth = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const taskToolbar = document.getElementById('taskToolbar');
const filterSubjectSelect = document.getElementById('filterSubjectSelect');
const filterStatusSelect = document.getElementById('filterStatusSelect');
const sortSelect = document.getElementById('sortSelect');

const backupSection = document.getElementById('backupSection');
const trashSection = document.getElementById('trashSection');
const trashList = document.getElementById('trashList');
const emptyTrashBtn = document.getElementById('emptyTrashBtn');


let currentDate = new Date();

const detailsModal = document.createElement('div');
detailsModal.style.position = 'fixed';
detailsModal.style.top = '50%';
detailsModal.style.left = '50%';
detailsModal.style.transform = 'translate(-50%, -50%)';
detailsModal.style.background = '#1f2937';
detailsModal.style.padding = '20px';
detailsModal.style.borderRadius = '15px';
detailsModal.style.boxShadow = '0 0 30px rgba(0,0,0,0.5)';
detailsModal.style.display = 'none';
detailsModal.style.zIndex = '1000';
document.body.appendChild(detailsModal);

const editModal = document.createElement('div');
editModal.className = 'modal-overlay';
editModal.style.display = 'none';
editModal.style.zIndex = '1001';
document.body.appendChild(editModal);

const searchInput = document.createElement('input');
searchInput.placeholder = '🔍 Aufgabe suchen...';
searchInput.style.width = '100%';
searchInput.style.marginBottom = '20px';
newTaskSection.parentNode.insertBefore(searchInput, newTaskSection);
searchInput.style.display = 'none';

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let exams = JSON.parse(localStorage.getItem('exams')) || [];
let deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];
deletedTasks = deletedTasks.filter(task => {
  return Date.now() - task.deletedAt < 30 * 24 * 60 * 60 * 1000;
});

tasks = tasks.filter(task => {
  if (!task.completed || !task.completedAt) {
    return true;
  }

  return Date.now() - task.completedAt < 24 * 60 * 60 * 1000;
});

saveTasks();

notesInput.value = localStorage.getItem('notes') || '';

notesInput.addEventListener('input', () => {
  localStorage.setItem('notes', notesInput.value);
});

function updateDashboard() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];

  const weekStart = new Date(now);
  const dayOfWeek = weekStart.getDay();
  const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  weekStart.setDate(weekStart.getDate() + offsetToMonday);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  let todayTasks = 0;
  let tomorrowTasks = 0;
  let weekTasks = 0;
  let openTasks = 0;
  let completedTasks = 0;

  tasks.forEach(task => {
    if (task.completed) {
      completedTasks++;
      return;
    }

    openTasks++;

    if (task.date === today) {
      todayTasks++;
    }

    if (task.date === tomorrowDate) {
      tomorrowTasks++;
    }

    if (task.date) {
      const taskDate = new Date(task.date + 'T00:00:00');
      if (taskDate >= weekStart && taskDate <= weekEnd) {
        weekTasks++;
      }
    }
  });

  todayCount.textContent = todayTasks;
  tomorrowCount.textContent = tomorrowTasks;
  weekCount.textContent = weekTasks;
  doneCount.textContent = completedTasks;

  statsDone.textContent = completedTasks;
  statsOpen.textContent = openTasks;
  statsHigh.textContent = tasks.filter(task => !task.completed && task.priority.includes('🔴')).length;

  const ctx = statsChart.getContext('2d');
  ctx.clearRect(0, 0, statsChart.width, statsChart.height);

  const total = Math.max(tasks.length, 1);
  const doneAngle = (completedTasks / total) * Math.PI * 2;

  ctx.beginPath();
  ctx.moveTo(150,150);
  ctx.arc(150,150,100,0,doneAngle);
  ctx.fillStyle = '#22c55e';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(150,150);
  ctx.arc(150,150,100,doneAngle,Math.PI*2);
  ctx.fillStyle = '#ef4444';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(150,150,50,0,Math.PI*2);
  ctx.fillStyle = '#1f2937';
  ctx.fill();

  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  progressFill.style.width = progress + '%';
  progressText.textContent = progress + '% erledigt';

  if (pageTitle.textContent === '🏠 Dashboard') {
    document.title = `HomeworkOS (${progress}% erledigt)`;
  }
}

function renderCalendar() {
  calendarGrid.innerHTML = '';

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  currentMonth.textContent = currentDate.toLocaleString('de-DE', {
    month: 'long',
    year: 'numeric'
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  weekdays.forEach(name => {
    const header = document.createElement('div');
    header.className = 'calendar-day';
    header.style.minHeight = '40px';
    header.style.fontWeight = 'bold';
    header.style.textAlign = 'center';
    header.textContent = name;
    calendarGrid.appendChild(header);
  });

  let firstDay = new Date(year, month, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'calendar-day';
    emptyDiv.style.opacity = '0.2';
    calendarGrid.appendChild(emptyDiv);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const div = document.createElement('div');
    div.className = 'calendar-day';

    const today = new Date();

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      div.style.border = '2px solid #3b82f6';
      div.style.boxShadow = '0 0 20px rgba(59,130,246,0.5)';
    }

    const dateString = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

    const dayTasks = tasks.filter(task => task.date === dateString);
    const completedTasks = dayTasks.filter(task => task.completed);
    const dayExams = exams.filter(exam => exam.date === dateString);

    div.innerHTML = `<div class="calendar-date">${day}</div>`;

    dayTasks.forEach(task => {
      let color = '#ffffff';
      if (task.subject.includes('Mathe')) color = '#60a5fa';
      if (task.subject.includes('Englisch')) color = '#22c55e';
      if (task.subject.includes('Deutsch')) color = '#facc15';
      if (task.subject.includes('Physik')) color = '#a855f7';
      if (task.subject.includes('Geographie')) color = '#fb923c';
      if (task.subject.includes('Französisch')) color = '#ec4899';
      if (task.subject.includes('HOE')) color = '#14b8a6';
      if (task.completed) {
        div.innerHTML += `<small style="color:${color};">✅ ${task.subject}<br>${task.text}</small><br>`;
      } else {
        div.innerHTML += `<small style="color:${color}">${task.subject}<br>${task.text}</small><br>`;
      }
    });

    dayExams.forEach(exam => {
      const examSubject = exam.subject || '📘 Allgemein';
      div.innerHTML += `<small style="color:#f87171;">📚 ${examSubject} - ${exam.name}</small><br>`;
    });

    div.addEventListener('click', () => {
      const details = dayTasks.map(task =>
        `<div>${task.completed ? '✅' : '📝'} ${task.text}</div>`
      ).join('');

      const examsText = dayExams.map(exam => {
        const examSubject = exam.subject || '📘 Allgemein';
        return `<div style="color:#f87171;">📚 ${examSubject} - ${exam.name}</div>`;
      }).join('');

      detailsModal.innerHTML = `
        <h3>${dateString}</h3>
        ${details}
        ${examsText}
        <br><br>
        <button id="closeModalBtn">Schließen</button>
      `;

      detailsModal.style.display = 'block';

      document.getElementById('closeModalBtn').onclick = () => {
        detailsModal.style.display = 'none';
      };
    });
    calendarGrid.appendChild(div);
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function openEditTaskModal(task) {
  editModal.innerHTML = `
    <div class="modal-card">
      <h3>✏️ Aufgabe bearbeiten</h3>
      <label>Aufgabe
        <input id="editTaskText" type="text" value="${escapeHtml(task.text)}">
      </label>
      <label>Fach
        <select id="editTaskSubject">
          <option>📐 Mathe</option>
          <option>🇬🇧 Englisch</option>
          <option>📖 Deutsch</option>
          <option>🧪 Physik</option>
          <option>🌍 Geographie</option>
          <option>🇫🇷 Französisch</option>
          <option>🛠 HOE</option>
        </select>
      </label>
      <label>Datum
        <input id="editTaskDate" type="date" value="${task.date || ''}">
      </label>
      <label>Priorität
        <select id="editTaskPriority">
          <option>🟢 Niedrig</option>
          <option>🟡 Mittel</option>
          <option>🔴 Hoch</option>
        </select>
      </label>
      <div class="modal-actions">
        <button id="saveTaskEdit">Speichern</button>
        <button id="cancelTaskEdit">Abbrechen</button>
      </div>
    </div>
  `;

  editModal.style.display = 'flex';
  document.getElementById('editTaskSubject').value = task.subject;
  document.getElementById('editTaskPriority').value = task.priority;

  document.getElementById('cancelTaskEdit').onclick = () => {
    editModal.style.display = 'none';
  };

  document.getElementById('saveTaskEdit').onclick = () => {
    const newText = document.getElementById('editTaskText').value.trim();
    if (newText === '') return;

    task.text = newText;
    task.subject = document.getElementById('editTaskSubject').value;
    task.date = document.getElementById('editTaskDate').value;
    task.priority = document.getElementById('editTaskPriority').value;

    saveTasks();
    renderTasks();
    renderCalendar();
    editModal.style.display = 'none';
  };
}

function renderTasks() {
  taskList.innerHTML = '';
  calendarList.innerHTML = '';
  updateDashboard();

  const searchText = searchInput.value.toLowerCase();
  const subjectFilter = filterSubjectSelect ? filterSubjectSelect.value : 'all';
  const statusFilter = filterStatusSelect ? filterStatusSelect.value : 'all';
  const sortType = sortSelect ? sortSelect.value : 'date';

  const filteredTasks = tasks.filter(task => {
    if (
      !task.text.toLowerCase().includes(searchText) &&
      !task.subject.toLowerCase().includes(searchText)
    ) {
      return false;
    }

    if (subjectFilter !== 'all' && task.subject !== subjectFilter) {
      return false;
    }

    if (statusFilter === 'open' && task.completed) {
      return false;
    }

    if (statusFilter === 'completed' && !task.completed) {
      return false;
    }

    return true;
  });

  const sortedTasks = filteredTasks.slice();

  if (sortType === 'date') {
    sortedTasks.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
  } else if (sortType === 'priority') {
    const order = { '🔴 Hoch': 0, '🟡 Mittel': 1, '🟢 Niedrig': 2 };
    sortedTasks.sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3));
  } else if (sortType === 'subject') {
    sortedTasks.sort((a, b) => a.subject.localeCompare(b.subject, 'de', { sensitivity: 'base' }));
  }

  sortedTasks.forEach((task, index) => {
    const li = document.createElement('li');

    if (task.priority.includes('🔴')) {
      li.style.borderLeft = '6px solid #ef4444';
    } else if (task.priority.includes('🟡')) {
      li.style.borderLeft = '6px solid #facc15';
    } else {
      li.style.borderLeft = '6px solid #22c55e';
    }

    if (task.completed) {
      li.style.opacity = '0.6';
      li.style.textDecoration = 'line-through';
    }

    let subjectColor = '#ffffff';
    if (task.subject.includes('Mathe')) subjectColor = '#60a5fa';
    if (task.subject.includes('Englisch')) subjectColor = '#22c55e';
    if (task.subject.includes('Deutsch')) subjectColor = '#facc15';
    if (task.subject.includes('Physik')) subjectColor = '#a855f7';
    if (task.subject.includes('Geographie')) subjectColor = '#fb923c';
    if (task.subject.includes('Französisch')) subjectColor = '#ec4899';
    if (task.subject.includes('HOE')) subjectColor = '#14b8a6';
    li.innerHTML = `
      <strong style="color:${subjectColor}">${task.subject}</strong><br>
      ${task.text}<br>
      📅 ${task.date || 'Kein Datum'}<br>
      ${task.priority}
    `;

    const doneButton = document.createElement('button');
    doneButton.textContent = task.completed ? '↩️ Rückgängig' : '✅ Erledigt';
    doneButton.style.marginTop = '10px';
    doneButton.style.marginRight = '10px';

    doneButton.addEventListener('click', () => {
      task.completed = !task.completed;

      if (task.completed) {
        task.completedAt = Date.now();
      } else {
        delete task.completedAt;
      }

      saveTasks();
      renderTasks();
      renderCalendar();
    });

    const editButton = document.createElement('button');
    editButton.textContent = '✏️';
    editButton.style.marginTop = '10px';
    editButton.style.marginRight = '10px';
    editButton.addEventListener('click', () => {
      openEditTaskModal(task);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '❌';
    deleteButton.style.marginTop = '10px';

    deleteButton.addEventListener('click', () => {
      if (confirm('Aufgabe in den Papierkorb verschieben?')) {
        deletedTasks.push({
          ...task,
          deletedAt: Date.now()
        });

        const originalIndex = tasks.indexOf(task);
        if (originalIndex !== -1) {
          tasks.splice(originalIndex, 1);
        }

        saveTasks();
        renderTasks();
      }
    });

    li.appendChild(document.createElement('br'));
    li.appendChild(doneButton);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    li.style.transition = '0.2s';
    li.addEventListener('mouseenter', () => {
      li.style.transform = 'translateY(-3px)';
    });

    li.addEventListener('mouseleave', () => {
      li.style.transform = 'translateY(0px)';
    });

    if (task.date) {
      const calendarItem = document.createElement('li');
      calendarItem.textContent = `${task.date} - ${task.subject} - ${task.text}`;
      calendarList.appendChild(calendarItem);
    }

    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === '') return;

  tasks.push({
    text: text,
    subject: subjectSelect.value,
    date: dueDate.value,
    priority: prioritySelect.value,
    completed: false
  });

  saveTasks();
  renderTasks();

  taskInput.value = '';
  dueDate.value = '';
  prioritySelect.selectedIndex = 0;
  subjectSelect.selectedIndex = 0;
}

addButton.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

searchInput.addEventListener('input', renderTasks);
filterSubjectSelect.addEventListener('change', renderTasks);
filterStatusSelect.addEventListener('change', renderTasks);
sortSelect.addEventListener('change', renderTasks);

function renderExams() {
  examList.innerHTML = '';
  exams.forEach((exam, index) => {
    const li = document.createElement('li');
    exam.daysLeft = Math.ceil((new Date(exam.date) - new Date()) / (1000 * 60 * 60 * 24));
    const examSubject = exam.subject || '📘 Allgemein';
    li.innerHTML = `📚 ${examSubject} - ${exam.name}<br>📅 ${exam.date}<br>⏳ ${exam.daysLeft} Tage verbleibend`;

    if (exam.daysLeft <= 3) {
      li.style.borderLeft = '6px solid #ef4444';
    }

    const button = document.createElement('button');
    button.textContent = '❌';
    button.onclick = () => {
      exams.splice(index,1);
      localStorage.setItem('exams', JSON.stringify(exams));
      renderExams();
    };

    li.appendChild(document.createElement('br'));
    li.appendChild(button);
    examList.appendChild(li);
  });
}

prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
renderExams();
renderTasks();
updateDashboard();

if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('Service Worker registered:', registration.scope);
      })
      .catch(error => {
        console.warn('Service Worker registration failed:', error);
      });
  });
}

function checkReminders() {
  const today = new Date().toISOString().split('T')[0];

  tasks.forEach(task => {
    if (
      task.date === today &&
      !task.completed &&
      Notification.permission === 'granted'
    ) {
      const notification = new Notification('📚 HomeworkOS', {
        body: `${task.subject}: ${task.text}`
      });
      setTimeout(() => notification.close(), 3000);
    }
  });

  exams.forEach(exam => {
    const daysLeft = Math.ceil((new Date(exam.date) - new Date()) / (1000 * 60 * 60 * 24));

    if (Notification.permission === 'granted') {
      if (daysLeft === 3) {
        const notification = new Notification('📚 Prüfung in 3 Tagen', {
          body: `${exam.name} am ${exam.date}`
        });
        setTimeout(() => notification.close(), 3000);
      }

      if (daysLeft === 1) {
        const notification = new Notification('⚠️ Prüfung morgen!', {
          body: `${exam.name} am ${exam.date}`
        });
        setTimeout(() => notification.close(), 3000);
      }

      if (daysLeft === 0) {
        const notification = new Notification('🚨 Prüfung heute!', {
          body: `${exam.name}`
        });
        setTimeout(() => notification.close(), 3000);
      }
    }
  });
}

checkReminders();

setInterval(checkReminders, 60 * 60 * 1000);

addExamButton.addEventListener('click', () => {
  if (examInput.value.trim() === '') return;

  const examDate = prompt('Datum der Prüfung (YYYY-MM-DD):');
  if (!examDate) return;

  const daysLeft = Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24));

  exams.push({
    name: examInput.value,
    date: examDate,
    subject: examSubjectSelect ? examSubjectSelect.value : '📘 Allgemein',
    daysLeft: daysLeft
  });

  localStorage.setItem('exams', JSON.stringify(exams));
  examInput.value = '';
  renderExams();
});

function hideAllSections() {
  dashboardSection.style.display = 'none';
  newTaskSection.style.display = 'none';
  taskSection.style.display = 'none';
  notesSection.style.display = 'none';
  statsSection.style.display = 'none';
  calendarSection.style.display = 'none';
  examSection.style.display = 'none';
  settingsSection.style.display = 'none';
  backupSection.style.display = 'none';
  trashSection.style.display = 'none';
  if (taskToolbar) taskToolbar.style.display = 'none';
}

dashboardBtn.addEventListener('click', () => {
  hideAllSections();
  progressFill.parentElement.style.display = 'block';
  progressText.parentElement.style.display = 'block';
  pageTitle.textContent = '🏠 Dashboard';
  searchInput.style.display = 'none';
  dashboardSection.style.display = 'grid';
  newTaskSection.style.display = 'block';
  taskSection.style.display = 'block';
  updateDashboard();
});

tasksBtn.addEventListener('click', () => {
  hideAllSections();
  pageTitle.textContent = '📚 Aufgaben';
  searchInput.style.display = 'block';
  searchInput.placeholder = '🔍 Aufgabe suchen...';
  newTaskSection.style.display = 'block';
  taskSection.style.display = 'block';
  if (taskToolbar) taskToolbar.style.display = 'flex';
});

calendarBtn.addEventListener('click', () => {
  hideAllSections();
  pageTitle.textContent = '📅 Kalender';
  searchInput.style.display = 'none';
  calendarSection.style.display = 'block';
});

notesBtn.addEventListener('click', () => {
  hideAllSections();
  progressFill.parentElement.style.display = 'none';
  notesInput.style.minHeight = '500px';
  progressText.parentElement.style.display = 'none';
  pageTitle.textContent = '📝 Notizen';
  searchInput.style.display = 'none';
  notesSection.style.display = 'block';
});

statsBtn.addEventListener('click', () => {
  hideAllSections();
  pageTitle.textContent = '📊 Statistik';
  searchInput.style.display = 'none';
  statsSection.style.display = 'block';
});

examBtn.addEventListener('click', () => {
  hideAllSections();
  pageTitle.textContent = '📚 Prüfungen';
  searchInput.style.display = 'none';
  examSection.style.display = 'block';
});

exportBtn.addEventListener('click', () => {
  const data = {
    tasks,
    exams,
    notes: notesInput.value
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'homeworkos-backup.json';
  a.click();
});

importInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const data = JSON.parse(reader.result);
    tasks = data.tasks || [];
    exams = data.exams || [];
    notesInput.value = data.notes || '';

    saveTasks();
    localStorage.setItem('exams', JSON.stringify(exams));
    localStorage.setItem('notes', notesInput.value);

    renderTasks();
    renderExams();
  };
  reader.readAsText(file);
});

backupBtn.addEventListener('click', () => {
  hideAllSections();
  pageTitle.textContent = '☁️ Backup';
  searchInput.style.display = 'none';
  backupSection.style.display = 'block';
});

function openTrash() {
  hideAllSections();
  pageTitle.textContent = '🗑 Papierkorb';
  searchInput.style.display = 'none';
  trashSection.style.display = 'block';
  // Hide the dashboard progress card on the trash page
  const progressSection = document.getElementById('progressSection');
  if (progressSection) progressSection.style.display = 'none';

  trashList.innerHTML = '';

  if (deletedTasks.length === 0) {
    trashList.innerHTML = '<p>🗑 Papierkorb ist leer</p>';
    return;
  }

  deletedTasks.forEach((task, index) => {
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `
      <strong>${task.subject}</strong><br>
      ${task.text}<br>
      📅 Fällig: ${task.date || 'Kein Datum'}<br>
      🗓 Gelöscht am: ${new Date(task.deletedAt).toLocaleString('de-DE')}<br><br>
    `;

    const restoreBtn = document.createElement('button');
    restoreBtn.textContent = '↩️ Wiederherstellen';
    restoreBtn.onclick = () => {
      delete task.deletedAt;
      tasks.push(task);
      deletedTasks.splice(index,1);
      saveTasks();
      openTrash();
      renderTasks();
    };

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '❌ Endgültig löschen';
    removeBtn.onclick = () => {
      if (confirm('Aufgabe endgültig löschen?')) {
        deletedTasks.splice(index,1);
        saveTasks();
        openTrash();
      }
    };

    div.appendChild(restoreBtn);
    div.appendChild(removeBtn);
    trashList.appendChild(div);
  });
}

settingsBtn.addEventListener('click', () => {
  hideAllSections();
  pageTitle.textContent = '⚙️ Einstellungen';
  searchInput.style.display = 'none';
  settingsSection.style.display = 'block';
});

emptyTrashBtn.addEventListener('click', () => {
  if (confirm('Papierkorb wirklich komplett leeren?')) {
    deletedTasks = [];
    saveTasks();
    openTrash();
  }
});

trashBtn.addEventListener('click', () => {
  openTrash();
});