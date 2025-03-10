const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Подключаем модель
const router = express.Router();
const pool = require("../db");

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

router.get("/users", async (req, res) => {
    try {
        const {role} = req.query;
        console.log(role);
        const result = await pool.query("SELECT id, name, email FROM users WHERE role = $1", [role]); // Без паролей
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


router.put('/users', async (req, res) => {
    const { id, name, email, group, rating, role } = req.body;
  
    // Логируем для отладки
    console.log("Получены данные для обновления:", req.body);
  
    // Проверяем, что id существует
    if (!id) {
      return res.status(400).json({ error: 'ID пользователя не передан' });
    }
  
    let query = 'UPDATE users SET name = $1, email = $2, "group" = $3, rating = $4 WHERE id = $5';
    const values = [name, email, group, rating, id];
  
    try {
      // Логируем запрос для отладки
      console.log("SQL запрос: ", query);
      console.log("Параметры запроса: ", values);
  
      const result = await pool.query(query, values);
  
      // Проверяем результат обновления
      if (result.rowCount > 0) {
        console.log("Данные успешно обновлены");
        res.status(200).json({ message: 'Данные успешно обновлены!' });
      } else {
        console.log("Пользователь не найден или нет изменений");
        res.status(404).json({ error: 'Пользователь не найден или нет изменений' });
      }
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
      res.status(500).json({ error: 'Ошибка при обновлении данных' });
    }
  });
  
  
  

module.exports = router;
