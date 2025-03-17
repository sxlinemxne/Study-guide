document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOMContentLoaded сработал!");
    await loadLogs();
  });
  
  async function loadLogs() {
    try {
        const response = await fetch("http://localhost:5000/logs");
        const logs = await response.json();
        
        const tableHead = document.getElementById("table-head");
        const tableBody = document.getElementById("table-body");
  
        tableHead.innerHTML = "";
        tableBody.innerHTML = "";
  
        tableHead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Пользователь</th>
                <th>Действие</th>
                <th>Описание</th>
                <th>Дата</th>
            </tr>
        `;
  
        logs.forEach(log => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${log.id}</td>
                <td>${log.user_id || "Система"}</td>
                <td>${log.action}</td>
                <td>${log.details || "—"}</td>
                <td>${new Date(log.created_at).toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Ошибка загрузки логов:", error);
    }
  }
  