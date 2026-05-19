const tasks = [
  { id: 1, text: "Learn HTML basics", completed: true },
  { id: 2, text: "Practice JavaScript DOM", completed: false },
  { id: 3, text: "Build small projects", completed: false },
  { id: 4, text: "Push code to GitHub", completed: true }
];

let currentFilter = "all";

const taskList = document.getElementById("taskList");

function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

function deleteTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) tasks.splice(index, 1);
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks;

  if (currentFilter === "active") {
    filtered = tasks.filter(t => !t.completed);
  } else if (currentFilter === "completed") {
    filtered = tasks.filter(t => t.completed);
  }

  filtered.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="${task.completed ? "completed" : ""}">
        ${task.text}
      </span>
      <div>
        <button onclick="toggleTask(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">❌</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

renderTasks();