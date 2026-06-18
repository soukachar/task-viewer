const defaultTasks = [
  { id: 1, text: "Learn HTML basics", completed: true },
  { id: 2, text: "Practice JavaScript DOM", completed: false },
  { id: 3, text: "Build small projects", completed: false },
  { id: 4, text: "Push code to GitHub", completed: true }
];

let tasks = JSON.parse(localStorage.getItem("task-viewer-tasks")) || defaultTasks;

let currentFilter = "all";

const taskTableBody = document.getElementById("taskTableBody");

function saveTasks() {
  localStorage.setItem("task-viewer-tasks", JSON.stringify(tasks));
}

function addTask(event) {
  event.preventDefault();

  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();

  currentFilter = "all";
  renderTasks();

  taskInput.value = "";
}

function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find(task => task.id === id);

  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function renderTasks() {
  taskTableBody.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  if (filteredTasks.length === 0) {
    taskTableBody.innerHTML = `
      <tr>
        <td colspan="3" class="text-muted">No tasks found.</td>
      </tr>
    `;
    return;
  }

  filteredTasks.forEach(task => {
    const row = document.createElement("tr");

    if (task.completed) {
      row.classList.add("table-success");
    }

    row.innerHTML = `
      <td class="${task.completed ? 'text-decoration-line-through' : ''}">
        ${task.text}
      </td>

      <td>
        <span class="badge ${task.completed ? 'bg-success' : 'bg-warning text-dark'}">
          ${task.completed ? 'Completed' : 'Active'}
        </span>
      </td>

      <td>
        <button class="btn btn-success btn-sm me-2" onclick="toggleTask(${task.id})">
          ✔
        </button>

        <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
          ❌
        </button>
      </td>
    `;

    taskTableBody.appendChild(row);
  });
}

renderTasks();
