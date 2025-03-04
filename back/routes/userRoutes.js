const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Подключаем модель
const router = express.Router();
const pool = require("../db")
// Авторизация (POST /auth)
router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Найти пользователя в БД
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Пользователь не найден" });
        }

        // 2. Проверить пароль
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Неверный пароль" });
        }

        // 3. Создать JWT-токен
        const token = jwt.sign({ userId: user.id }, "secretKey", { expiresIn: "1d" });

        console.log("Успешный вход");
        res.json({ user, token, message: "Успешный вход" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Получение всех пользователей (GET /auth/users)
router.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name, email, role FROM users"); // Без паролей
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Получение текущего пользователя (GET /auth/me)
router.get("/me", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Достаем токен
        if (!token) {
            return res.status(401).json({ message: "Нет токена, авторизация отклонена" });
        }

        // Декодируем токен
        const decoded = jwt.verify(token, "secretKey");

        // Ищем пользователя в базе
        const user = await pool.query(
            "SELECT id, name, email, role FROM users WHERE id = $1",
            [decoded.userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        res.json(user.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Неверный токен" });
    }
});

module.exports = router;
