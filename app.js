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
    taskList.innerHTML = "<p>No tasks found.</p>";
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleTask(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">❌</button>
      </div>
    `;

    if (task.completed) {
      li.classList.add("completed");
    }

    taskList.appendChild(li);
  });
}

renderTasks();s
