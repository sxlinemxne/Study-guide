const roleSelect = document.getElementById("role");
roleSelect.addEventListener("change", () => {
  loadUsers();
});

let users = [];
document.addEventListener("DOMContentLoaded", async () => {
    await loadUsers(); 
  });
  
async function loadUsers() {
    try {
      const role = document.getElementById("role").value;
      const response = await fetch(
        `http://localhost:5000/auth/users?role=${encodeURIComponent(role)}`
      );
      users = await response.json();
      renderUsers(users, role);
    } catch (error) {
      alert("Ошибка загрузки пользователей");
    }
  }
  
  document.getElementById("searchUsers").addEventListener("input", (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
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
      tableRows = userList
        .map(
          (user, index) => `
        <tr data-user-id="${user.id}">
          <td>${index + 1}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
        </tr>`
        )
        .join("");
    } else if (role === "Учащийся") {
      tableHeaders = `
        <tr>
          <th>№</th>
          <th>Имя</th>
          <th>Email</th>
          <th>Группа</th>
          <th>Рейтинг</th>
        </tr>`;
      tableRows = userList
        .map(
          (user, index) => `
        <tr data-user-id="${user.id}">
          <td>${index + 1}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.group || "Не указана"}</td>
          <td>${user.rating || "Не оценен"}</td>
        </tr>`
        )
        .join("");
    }
  
    tableHead.innerHTML = tableHeaders;
    tableBody.innerHTML = tableRows;
  
    tableBody.querySelectorAll("tr").forEach((row) => {
      row.addEventListener("dblclick", (event) => {
        const userId = event.currentTarget.getAttribute("data-user-id");
        const userName =
          event.currentTarget.querySelector("td:nth-child(2)").textContent;
        const userEmail =
          event.currentTarget.querySelector("td:nth-child(3)").textContent;
        const userGroup = event.currentTarget.querySelector("td:nth-child(4)")
          ? event.currentTarget.querySelector("td:nth-child(4)").textContent
          : "";
        const userRating = event.currentTarget.querySelector("td:nth-child(5)")
          ? event.currentTarget.querySelector("td:nth-child(5)").textContent
          : "";
  
        openEditModal(userId, userName, userEmail, userGroup, userRating, role);
      });
    });
  }
  
  function openEditModal(
    userId,
    userName,
    userEmail,
    userGroup,
    userRating,
    role
  ) {
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
        role: document.getElementById("role").value,
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
  
  
  
  
  
  
  function openModal() {
    document.getElementById("modal2").style.display = "flex";
  }
  
  function closeModal() {
    document.getElementById("modal2").style.display = "none";
  }
  
  async function addUser() {
    const name = document.getElementById("usName").value;
    const email = document.getElementById("usEmail").value;
    const group = document.getElementById("usGroup").value;
    const rating = document.getElementById("usRating").value;
    const password = document.getElementById("usPassword").value;
    const role = document.getElementById("role").value
    if (!name || !email || !password) {
        alert("Имя, Email и Пароль обязательны!");
        return;
    }
    
   
    try {
      const response = await fetch("http://localhost:5000/auth/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, group, rating, role }),
    });
  
  
        const data = await response.json();
        if (response.ok) {
            alert("Пользователь добавлен!");
            closeModal();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert("Ошибка при добавлении пользователя");
    }
  }
  
  async function deleteUser() {
    const email = document.getElementById("editEmail").value;
  
    if (!email) {
        alert("Введите Email пользователя!");
        return;
    }
  
    try {
        const response = await fetch(`http://localhost:5000/auth/users`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
  
        const data = await response.json();
        if (response.ok) {
            alert("Пользователь удален!");
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert("Ошибка при удалении пользователя");
    }
  }
  