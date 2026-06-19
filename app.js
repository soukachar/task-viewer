const defaultTasks = [
  { id: 1, text: "Learn HTML basics", completed: true },
  { id: 2, text: "Practice JavaScript DOM", completed: false },
  { id: 3, text: "Build small projects", completed: false },
  { id: 4, text: "Push code to GitHub", completed: true },
  { id: 5, text: "Practice Bootstrap", completed: false },
  { id: 6, text: "Learn JavaScript events", completed: false },
  { id: 7, text: "Push code to GitHub", completed: true },
  { id: 8, text: "Improve README", completed: false },
  { id: 9, text: "Add localStorage", completed: true },
  { id: 10, text: "Prepare MLH application", completed: false }
];

let tasks = JSON.parse(localStorage.getItem("task-viewer-tasks")) || defaultTasks;

let currentFilter = "all";
let searchTerm = "";

let currentPage = 1;
const tasksPerPage = 5;

const taskTableBody = document.getElementById("taskTableBody");
const pagination = document.getElementById("pagination");

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
  searchTerm = "";
  currentPage = 1;

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.value = "";
  }

  taskInput.value = "";

  renderTasks();
}

function searchTasks(event) {
  event.preventDefault();

  const searchInput = document.getElementById("searchInput");
  searchTerm = searchInput.value.trim().toLowerCase();

  currentPage = 1;
  renderTasks();
}

function setFilter(filter) {
  currentFilter = filter;
  currentPage = 1;
  renderTasks();
}

function deleteTask(id) {
  const confirmation = confirm("Are you sure you want to delete this task?");

  if (!confirmation) {
    return;
  }

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

function editTask(id) {
  const task = tasks.find(task => task.id === id);

  if (!task) {
    return;
  }

  const newText = prompt("Edit task:", task.text);

  if (newText === null) {
    return;
  }

  const trimmedText = newText.trim();

  if (trimmedText === "") {
    alert("Task cannot be empty.");
    return;
  }

  task.text = trimmedText;
  saveTasks();
  renderTasks();
}

function getFilteredTasks() {
  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  if (searchTerm !== "") {
    filteredTasks = filteredTasks.filter(task =>
      task.text.toLowerCase().includes(searchTerm)
    );
  }

  return filteredTasks;
}

function renderTasks() {
  taskTableBody.innerHTML = "";

  const filteredTasks = getFilteredTasks();

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }

  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;

  const tasksToShow = filteredTasks.slice(startIndex, endIndex);

  if (tasksToShow.length === 0) {
    taskTableBody.innerHTML = `
      <tr>
        <td colspan="3" class="text-muted">
          No tasks found.
        </td>
      </tr>
    `;

    pagination.innerHTML = "";
    return;
  }

  tasksToShow.forEach(task => {
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

        <button class="btn btn-primary btn-sm me-2" onclick="editTask(${task.id})">
          Edit
        </button>

      <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
       ❌
</button>
      </td>
    `;

    taskTableBody.appendChild(row);
  });

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  pagination.innerHTML = "";

  if (totalPages <= 1) {
    return;
  }

  const previousButton = document.createElement("button");
  previousButton.textContent = "Previous";
  previousButton.className = "btn btn-outline-success";

  previousButton.disabled = currentPage === 1;

  previousButton.onclick = function () {
    currentPage--;
    renderTasks();
  };

  pagination.appendChild(previousButton);

  for (let page = 1; page <= totalPages; page++) {
    const pageButton = document.createElement("button");

    pageButton.textContent = page;

    if (page === currentPage) {
      pageButton.className = "btn btn-success";
    } else {
      pageButton.className = "btn btn-outline-success";
    }

    pageButton.onclick = function () {
      currentPage = page;
      renderTasks();
    };

    pagination.appendChild(pageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.className = "btn btn-outline-success";

  nextButton.disabled = currentPage === totalPages;

  nextButton.onclick = function () {
    currentPage++;
    renderTasks();
  };

  pagination.appendChild(nextButton);
}

renderTasks();
