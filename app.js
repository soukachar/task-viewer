const defaultTasks = [
  { id: 1, text: "Learn HTML basics", completed: true },
  { id: 2, text: "Practice JavaScript DOM", completed: false },
  { id: 3, text: "Build small projects", completed: false },
  { id: 4, text: "Push code to GitHub", completed: true }
];

let tasks = JSON.parse(localStorage.getItem("task-viewer-tasks")) || defaultTasks;

let currentFilter = "all";

const taskList = document.getElementById("taskList");

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
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
      <li class="list-group-item text-center text-muted">
        No tasks found.
      </li>
    `;
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    li.className = "list-group-item d-flex justify-content-between align-items-center";

    if (task.completed) {
      li.classList.add("list-group-item-success");
    }

    li.innerHTML = `
      <div>
        <span class="${task.completed ? 'text-decoration-line-through' : ''}">
          ${task.text}
        </span>

        <span class="badge ${task.completed ? 'bg-success' : 'bg-warning text-dark'} ms-2">
          ${task.completed ? 'Completed' : 'Active'}
        </span>
      </div>

      <div>
        <button class="btn btn-sm btn-success me-2" onclick="toggleTask(${task.id})">
          ✔
        </button>

        <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">
          ❌
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

renderTasks();
