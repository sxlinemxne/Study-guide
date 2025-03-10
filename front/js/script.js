document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  // Проверка сохраненной темы
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "white") {
    root.style.setProperty("--bg-color", "#f6f6f6");
    root.style.setProperty("--font-color", "black");
  } else if (savedTheme === "black") {
    root.style.setProperty("--bg-color", "#232323");
    root.style.setProperty("--font-color", "white");
  }
});

const leftElements = document.querySelectorAll(".left");
const rightElements = document.querySelectorAll(".right");
const subscribeFormElement = document.querySelectorAll(".subscribe-form");

if (leftElements.length > 0 && rightElements.length > 0 && subscribeFormElement.length > 0) {
  window.sr = ScrollReveal({
    distance: "60px",
    duration: 800,
    delay: 200,
    reset: false,
  });

  sr.reveal(".left", { delay: 150, origin: "right" });
  sr.reveal(".right", { delay: 150, origin: "left" });
  sr.reveal(".subscribe-form", { delay: 200, origin: "bottom" });
}

const header = document.querySelector("header");
const sidebar = document.querySelector(".nav-panel");
const footer = document.querySelector("footer");

if (header && sidebar && footer) {
  let ticking = false;

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        const headerHeight = header.getBoundingClientRect().bottom;
        const footerTop = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        sidebar.style.top = headerHeight >= 0 ? headerHeight + "px" : "0px";
        sidebar.style.bottom = footerTop < windowHeight ? windowHeight - footerTop + "px" : "0px";

        const content = document.querySelector(".nav-panel-content");
        content.style.position = "sticky";
        content.style.top = headerHeight > 0 ? headerHeight + "px" : "0px";

        ticking = false;
      });

      ticking = true;
    }
  });
}

function switchWhite() {
  const root = document.documentElement;
  root.style.setProperty("--bg-color", "#f6f6f6");
  root.style.setProperty("--font-color", "black");
  localStorage.setItem("theme", "white");
}

function switchBlack() {
  const root = document.documentElement;
  root.style.setProperty("--bg-color", "#232323");
  root.style.setProperty("--font-color", "white");
  localStorage.setItem("theme", "black");
}

async function openForm() {
  const isUserAuthenticated = await checkUser();
  if (!isUserAuthenticated) {
    const container = document.getElementById("authContainer");
    container.style.display = "block";
    setTimeout(() => container.classList.add("show"), 10);
  }
}

function closeForm() {
  const container = document.getElementById("authContainer");
  container.classList.remove("show");
  container.classList.add("hide");
  setTimeout(() => {
    container.style.display = "none";
    container.classList.remove("hide");
  }, 300);
}

document.getElementById("authContainer").addEventListener("mousedown", function (event) {
  if (event.target === this) {
    closeForm();
  }
});

document.getElementById("profile-icon").addEventListener("mouseover", async function () {
  const isUserAuthenticated = await checkUser();
  if (isUserAuthenticated) {
    const container = document.getElementById("login-dropdown-content");
    container.style.display = "block";
  }
});

document.getElementById("login-dropdown-content").addEventListener("click", function () {
  const container = document.getElementById("login-dropdown-content");
  container.style.display = "none";
});

document.getElementById("profile-icon").addEventListener("mouseout", function (event) {
  const container = document.getElementById("login-dropdown-content");
  if (!container.contains(event.relatedTarget)) {
    container.style.display = "none";
  }
});

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5000/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    closeForm();
  } catch (error) {
    alert("Ошибка при авторизации");
  }
});

async function checkUser() {
  try {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/auth/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        return false;
      }

      const user = await response.json();
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

function endSession() {
  localStorage.removeItem("token");
}

document.getElementById("table-body").addEventListener("click", function (event) {
  const targetRow = event.target.closest("tr");
  if (!targetRow) return;

  document.querySelectorAll("#table-body tr").forEach((row) => row.classList.remove("selected"));
  targetRow.classList.add("selected");
});

const roleSelect = document.getElementById("role");
roleSelect.addEventListener("change", () => {
  loadUsers();
});

let users = [];

async function loadUsers() {
  try {
    const role = document.getElementById("role").value;
    const response = await fetch(`http://localhost:5000/auth/users?role=${encodeURIComponent(role)}`);
    users = await response.json();
    renderUsers(users, role);
  } catch (error) {
    alert("Ошибка загрузки пользователей");
  }
}

document.getElementById("searchUsers").addEventListener("input", (event) => {
  const searchText = event.target.value.toLowerCase();
  const filteredUsers = users.filter(user =>
    (user.name && user.name.toLowerCase().includes(searchText)) ||
    (user.email && user.email.toLowerCase().includes(searchText)) ||
    (user.group && user.group.toLowerCase().includes(searchText))
  );
  renderUsers(filteredUsers, document.getElementById("role").value);
});

function renderUsers(userList, role) {
  const tableHead = document.getElementById("table-head");
  const tableBody = document.getElementById("table-body");

  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  let tableHeaders = "";
  let tableRows = "";

  if (role === "Преподаватель") {
    tableHeaders = `
      <tr>
        <th>№</th>
        <th>Имя</th>
        <th>Email</th>
      </tr>`;
    tableRows = userList.map((user, index) => `
      <tr data-user-id="${user.id}">
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
      </tr>`).join("");
  } else if (role === "Учащийся") {
    tableHeaders = `
      <tr>
        <th>№</th>
        <th>Имя</th>
        <th>Email</th>
        <th>Группа</th>
        <th>Рейтинг</th>
      </tr>`;
    tableRows = userList.map((user, index) => `
      <tr data-user-id="${user.id}">
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.group || "Не указана"}</td>
        <td>${user.rating || "Не оценен"}</td>
      </tr>`).join("");
  }

  tableHead.innerHTML = tableHeaders;
  tableBody.innerHTML = tableRows;

  tableBody.querySelectorAll("tr").forEach(row => {
    row.addEventListener("dblclick", (event) => {
      const userId = event.currentTarget.getAttribute("data-user-id");
      const userName = event.currentTarget.querySelector("td:nth-child(2)").textContent;
      const userEmail = event.currentTarget.querySelector("td:nth-child(3)").textContent;
      const userGroup = event.currentTarget.querySelector("td:nth-child(4)") ? event.currentTarget.querySelector("td:nth-child(4)").textContent : "";
      const userRating = event.currentTarget.querySelector("td:nth-child(5)") ? event.currentTarget.querySelector("td:nth-child(5)").textContent : "";

      openEditModal(userId, userName, userEmail, userGroup, userRating, role);
    });
  });
}

function openEditModal(userId, userName, userEmail, userGroup, userRating, role) {
  document.getElementById("editName").value = userName;
  document.getElementById("editEmail").value = userEmail;
  document.getElementById("editGroup").value = userGroup;
  document.getElementById("editRating").value = userRating;

  const groupField = document.getElementById("groupField");
  const ratingField = document.getElementById("ratingField");

  if (role === "Преподаватель") {
    groupField.style.display = "none";
    ratingField.style.display = "none";
  } else if (role === "Учащийся") {
    groupField.style.display = "block";
    ratingField.style.display = "block";
  }

  const modal = document.getElementById("editModal");
  modal.style.display = "block";

  document.getElementById("closeModal").addEventListener("click", () => {
    modal.style.display = "none";
  });

  document.getElementById("editUserForm").onsubmit = async function (e) {
    e.preventDefault();

    const updatedUser = {
      id: userId,
      name: document.getElementById("editName").value,
      email: document.getElementById("editEmail").value,
      group: document.getElementById("editGroup").value,
      rating: document.getElementById("editRating").value,
      role: document.getElementById("role").value
    };

    try {
      const response = await fetch(`http://localhost:5000/auth/users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Данные успешно обновлены!");
        modal.style.display = "none";
        loadUsers();
      } else {
        alert(result.error || "Ошибка при обновлении данных.");
      }
    } catch (error) {
      alert("Ошибка при отправке данных.");
    }
  };
}
