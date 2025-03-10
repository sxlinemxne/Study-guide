document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  // Проверяем, какая тема сохранена
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "white") {
    root.style.setProperty("--bg-color", "#f6f6f6");
    root.style.setProperty("--font-color", "black");
  } else if (savedTheme === "black") {
    root.style.setProperty("--bg-color", "#232323");
    root.style.setProperty("--font-color", "white");
  }
});

var leftElements = document.querySelectorAll(".left");
var rightElements = document.querySelectorAll(".right");
var subscribeFormElement = document.querySelectorAll(".subscribe-form");
if (
  leftElements.length > 0 &&
  rightElements.length > 0 &&
  subscribeFormElement.length > 0
) {
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

var header = document.querySelector("header");
var sidebar = document.querySelector(".nav-panel");
var footer = document.querySelector("footer");

if (header && sidebar && footer) {
  var ticking = false;

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        var headerHeight = header.getBoundingClientRect().bottom;
        var footerTop = footer.getBoundingClientRect().top;
        var windowHeight = window.innerHeight;

        if (headerHeight >= 0) {
          sidebar.style.top = headerHeight + "px";
        } else {
          sidebar.style.top = "0px";
        }

        if (footerTop < windowHeight) {
          var overlap = windowHeight - footerTop;
          sidebar.style.bottom = overlap + "px";
        } else {
          sidebar.style.bottom = "0px";
        }

        var content = document.querySelector(".nav-panel-content");
        if (headerHeight > 0) {
          content.style.position = "sticky";
          content.style.top = headerHeight + "px";
        } else {
          content.style.position = "sticky";
          content.style.top = "0px";
        }

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
  console.log(isUserAuthenticated);
  if (!isUserAuthenticated) {
    const container = document.getElementById("authContainer");
    container.style.display = "block";
    setTimeout(() => container.classList.add("show"), 10); // Добавляем задержку для плавности
  }
}

function closeForm() {
  const container = document.getElementById("authContainer");
  container.classList.remove("show");
  container.classList.add("hide");
  setTimeout(() => {
    container.style.display = "none";
    container.classList.remove("hide");
  }, 300); // Ждём завершения анимации перед скрытием
}

// Закрытие при клике вне формы
document
  .getElementById("authContainer")
  .addEventListener("mousedown", function (event) {
    if (event.target === this) {
      closeForm();
    }
  });

document
  .getElementById("profile-icon")
  .addEventListener("mouseover", async function () {
    const isUserAuthenticated = await checkUser();
    console.log(isUserAuthenticated);
    if (isUserAuthenticated) {
      const container = document.getElementById("login-dropdown-content");
      container.style.display = "block";
    }
  });

document
  .getElementById("login-dropdown-content")
  .addEventListener("click", async function () {
    const container = document.getElementById("login-dropdown-content");
    container.style.display = "none";
  });
document
  .getElementById("profile-icon")
  .addEventListener("mouseout", function (event) {
    const container = document.getElementById("login-dropdown-content");
    if (!container.contains(event.relatedTarget)) {
      container.style.display = "none";
    }
  });

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    try {
      let response = await fetch("http://localhost:5000/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = await response.json();

      if (!response.ok) {
        console.error("Ошибка авторизации:", data.message);
        alert(data.message);
        return;
      }

      console.log("Успешный вход", data);
      localStorage.setItem("token", data.token);
      closeForm();
    } catch (error) {
      console.error("Ошибка запроса:", error);
    }
  });

async function checkUser() {
  try {
    if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token");
      let response = await fetch("http://localhost:5000/auth/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }, // Отправляем токен
      });
      if (!response.ok) {
        console.error("Ошибка получения пользователей");
        return false;
      } else {
        let user = await response.json();
        console.log(user.name + " - " + user.email);
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error("Ошибка запроса:", error);
  }
}

function endSession() {
  localStorage.removeItem("token");
  console.log("JWT удалён из localStorage");
}

document
  .getElementById("table-body")
  .addEventListener("click", function (event) {
    let targetRow = event.target.closest("tr");
    if (!targetRow) return;

    // Убираем выделение у всех строк
    document
      .querySelectorAll("#table-body tr")
      .forEach((row) => row.classList.remove("selected"));

    // Выделяем только одну строку
    targetRow.classList.add("selected");
  });

// Обработчик для смены роли
const roleSelect = document.getElementById("role");
roleSelect.addEventListener("change", () => {
  const selectedRole = roleSelect.value;
  loadUsers();  // Загружаем пользователей при смене роли
});

let users = [];  // Массив для хранения пользователей

// Функция для загрузки пользователей
async function loadUsers() {
  try {
    const role = document.getElementById("role").value;  // Получаем роль из селектора

    let response = await fetch(
      `http://localhost:5000/auth/users?role=${encodeURIComponent(role)}`
    );
    users = await response.json();  // Получаем данные от сервера

    console.log("Полученные пользователи:", users);  // Логируем, что приходит от сервера
    renderUsers(users, role);  // Отображаем пользователей
  } catch (error) {
    console.error("Ошибка загрузки пользователей:", error);
  }
}

document.getElementById("searchUsers").addEventListener("input", (event) => {
  const searchText = event.target.value.toLowerCase();  // Текст для поиска
  const filteredUsers = users.filter(user => 
    (user.name && user.name.toLowerCase().includes(searchText)) || 
    (user.email && user.email.toLowerCase().includes(searchText)) ||
    (user.group && user.group.toLowerCase().includes(searchText))
  );
  renderUsers(filteredUsers, document.getElementById("role").value);  // Отображаем отфильтрованных пользователей
});


function renderUsers(userList, role) {
  const tableHead = document.getElementById("table-head");
  const tableBody = document.getElementById("table-body");

  tableHead.innerHTML = "";  // Очищаем заголовок таблицы
  tableBody.innerHTML = "";  // Очищаем содержимое таблицы

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
      </tr>`).join("");  // Соединяем строки в одну для повышения производительности

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
      </tr>`).join(""); // Соединяем строки в одну для повышения производительности
  }

  // Вставляем собранные строки в таблицу
  tableHead.innerHTML = tableHeaders;
  tableBody.innerHTML = tableRows;

  // Добавляем обработчик события для двойного клика по строкам таблицы
  const rows = tableBody.querySelectorAll("tr");  // Находим все строки в таблице
  rows.forEach(row => {
    row.addEventListener("dblclick", (event) => {
      const userId = event.currentTarget.getAttribute("data-user-id");
      const userName = event.currentTarget.querySelector("td:nth-child(2)").textContent;
      const userEmail = event.currentTarget.querySelector("td:nth-child(3)").textContent;
      const userGroup = event.currentTarget.querySelector("td:nth-child(4)") ? event.currentTarget.querySelector("td:nth-child(4)").textContent : "";
      const userRating = event.currentTarget.querySelector("td:nth-child(5)") ? event.currentTarget.querySelector("td:nth-child(5)").textContent : "";

      // Логирование для проверки
      console.log(`Двойной клик по пользователю: ${userName} (${userEmail}) с ID: ${userId}`);

      // Открытие модального окна и передача данных в поля формы
      openEditModal(userId, userName, userEmail, userGroup, userRating, role);
    });
  });
}

// Открытие модального окна и заполнение данных
function openEditModal(userId, userName, userEmail, userGroup, userRating, role) {
  // Заполняем поля формы
  document.getElementById("editName").value = userName;
  document.getElementById("editEmail").value = userEmail;
  document.getElementById("editGroup").value = userGroup;
  document.getElementById("editRating").value = userRating;

  // В зависимости от роли скрываем или показываем дополнительные поля
  const groupField = document.getElementById("groupField");
  const ratingField = document.getElementById("ratingField");

  if (role === "Преподаватель") {
    groupField.style.display = "none";
    ratingField.style.display = "none";
  } else if (role === "Учащийся") {
    groupField.style.display = "block";
    ratingField.style.display = "block";
  }

  // Показываем модальное окно
  const modal = document.getElementById("editModal");
  modal.style.display = "block";

  // Обработчик закрытия модального окна
  document.getElementById("closeModal").addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Обработчик отправки формы
  document.getElementById("editUserForm").onsubmit = async function (e) {
    e.preventDefault();
  
    const updatedUser = {
      id: userId,
      name: document.getElementById("editName").value,
      email: document.getElementById("editEmail").value,
      group: document.getElementById("editGroup").value,
      rating: document.getElementById("editRating").value,
      role: document.getElementById("role").value // Роль
    };
  
    try {
      // Отправляем обновленные данные на сервер
      const response = await fetch(`http://localhost:5000/auth/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert("Данные успешно обновлены!");
        modal.style.display = "none";  // Закрываем модальное окно
        loadUsers();  // Обновляем список пользователей
      } else {
        alert(result.error || "Ошибка при обновлении данных.");
      }
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
      alert("Ошибка при отправке данных.");
    }
  };  
}


async function uploadFiles() {
  const filenames = [
    "js-themes.json",
    "js-tests.json",
    "css-themes.json",
    "css-tests.json",
    "html-themes.json",
    "html-tests.json"
  ];

  try {
    const response = await fetch("http://localhost:5000/file/uploadByName", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ filenames })
    });

    const data = await response.json();
    console.log(data); // Ответ от сервера

  } catch (error) {
    console.error("Ошибка при загрузке файлов:", error);
  }
}

async function fetchFile() {
  try {
    // Отправляем запрос на сервер
    const response = await fetch("http://localhost:5000/file");

    // Проверяем успешность ответа
    if (!response.ok) {
      throw new Error("Ошибка при получении файла");
    }

    // Получаем файл из ответа
    const fileData = await response.json();  // Поскольку сервер возвращает JSON, мы парсим его как JSON
    console.log("Полученные данные файла:", fileData);

  } catch (error) {
    console.error("Ошибка:", error);
  }
}
