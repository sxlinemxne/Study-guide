require('dotenv').config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,  // Должна быть строка
    port: process.env.DB_PORT || 5432,
});

// Создание таблицы (если её нет)
pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE
    )
`, (err, res) => {
    if (err) console.error(err);
    else console.log("Таблица users готова");
});

// Добавление пользователя
app.post("/addUser", async (req, res) => {
    const { name, email } = req.body;
    try {
        await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email]);
        res.send("Пользователь добавлен");
    } catch (err) {
        res.status(500).send("Ошибка добавления пользователя");
    }
});

// Получение всех пользователей
app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Ошибка получения пользователей");
    }
});

app.listen(5000, () => console.log("Сервер запущен на порту 5000"));
