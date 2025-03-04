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
        alert(data.message); // Выведет ошибку, если неправильный пароль или email
        return;
      }

      console.log("Успешный вход", data);
      localStorage.setItem("token", data.token); // Сохраняем токен
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
