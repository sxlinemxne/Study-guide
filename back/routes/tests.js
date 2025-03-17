const express = require("express");
const pool = require("../db");
const router = express.Router();
const logAction = require("../utils/logger");
const jwt = require("jsonwebtoken");

router.post("/submitTest", async (req, res) => {
  try {
    const { token, themeId, correctAnswers, totalQuestions, subject } = req.body; 
    
    if (!token || !themeId || correctAnswers === undefined || totalQuestions === undefined || !subject) {
      return res.status(400).json({ error: "Не все данные переданы" });
    }

    const decoded = jwt.verify(token, "secretKey");
    const userId = decoded.userId;

    // Проверяем, проходил ли пользователь этот тест в рамках данной темы
    const existingResult = await pool.query(
      "SELECT * FROM test_results WHERE user_id = $1 AND theme_id = $2 AND subject = $3",
      [userId, themeId, subject]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({ error: "Вы уже проходили этот тест в этой теме" });
    }

    // Сохраняем результат
    await pool.query(
      "INSERT INTO test_results (user_id, theme_id, correct_answers, total_questions, subject) VALUES ($1, $2, $3, $4, $5)",
      [userId, themeId, correctAnswers, totalQuestions, subject]
    );

    // Обновляем рейтинг пользователя
    await pool.query(
      "UPDATE users SET rating = rating + $1 WHERE id = $2",
      [correctAnswers, userId]
    );

    res.json({ message: "Результат сохранён, рейтинг обновлён" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при сохранении теста", details: error.message });
  }
});


module.exports = router;
