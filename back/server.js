require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/userRoutes");
const pool = require("./db")
app.use(cors());
app.use(express.json());

// Подключение маршрутов
app.use("/auth", userRoutes);

// Запуск сервера
const PORT = process.env.PORT || 5000;

// // Создание таблицы (если её нет)
// pool.query(`
//     CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(100) UNIQUE NOT NULL,
//         email VARCHAR(100) UNIQUE NOT NULL,
//         password VARCHAR(100) NOT NULL,
//         role VARCHAR(100) NOT NULL,
//         "group" VARCHAR(20)
//     )
//     `, (err, res) => {
//     if (err) console.error(err);
//     else console.log("Таблица users готова");
// });



// Получение всех пользователей
app.get("/users22", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Ошибка получения пользователей");
    }
});
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
