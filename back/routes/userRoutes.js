const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Подключаем модель
const router = express.Router();
const pool = require("../db");
const logAction = require("../utils/logger");

router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Пользователь не найден" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Неверный пароль" });
        }

        const token = jwt.sign({ userId: user.id }, "secretKey", { expiresIn: "1d" });

        // Записываем в лог
        await logAction(user.id, "Вход в систему", `Пользователь ${user.email} вошел в систему`);

        res.json({ user, token, message: "Успешный вход" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.get("/users", async (req, res) => {
    try {
        const { role } = req.query;
        const result = await pool.query("SELECT * FROM users WHERE role = $1", [role]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.get("/me", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Нет токена, авторизация отклонена" });
        }
        const decoded = jwt.verify(token, "secretKey");
        const user = await pool.query(
            `SELECT id, name, email, role, rating, "group" FROM users WHERE id = $1`,
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

router.put("/users", async (req, res) => {
    const { id, name, email, group, rating } = req.body;

    if (!id) {
        return res.status(400).json({ error: "ID пользователя не передан" });
    }

    const query = 'UPDATE users SET name = $1, email = $2, "group" = $3, rating = $4 WHERE id = $5';
    const values = [name, email, group, rating, id];

    try {
        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.status(200).json({ message: "Данные успешно обновлены!" });
        } else {
            res.status(404).json({ error: "Пользователь не найден или нет изменений" });
        }
    } catch (error) {
        console.error("Ошибка при обновлении данных:", error);
        res.status(500).json({ error: "Ошибка при обновлении данных" });
    }
});



router.post("/users", async (req, res) => {
    const { name, email, password, group, rating, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Имя, Email и Пароль обязательны" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            'INSERT INTO users (name, email, password, "group", rating, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, email, hashedPassword, group || null, rating || 0, role]
        );

        const newUser = result.rows[0];

        // Записываем в лог
        await logAction(newUser.id, "Регистрация", `Пользователь ${email} зарегистрирован`);

        res.status(201).json({ message: "Пользователь добавлен!", user: newUser });
    } catch (error) {
        console.error("Ошибка при добавлении пользователя:", error);
        res.status(500).json({ error: "Ошибка при добавлении пользователя" });
    }
});
router.delete("/users", async (req, res) => { 
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email пользователя не передан" });
    }

    try {
        const result = await pool.query("DELETE FROM users WHERE email = $1 RETURNING id", [email]);

        if (result.rowCount > 0) {
            const deletedUserId = result.rows[0].id;

            // Записываем в лог
            await logAction(deletedUserId, "Удаление пользователя", `Пользователь ${email} удален`);

            res.status(200).json({ message: "Пользователь удален!" });
        } else {
            res.status(404).json({ error: "Пользователь не найден" });
        }
    } catch (error) {
        console.error("Ошибка при удалении пользователя:", error);
        res.status(500).json({ error: "Ошибка при удалении пользователя" });
    }
});

module.exports = router;
