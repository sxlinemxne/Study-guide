const pool = require("../db");

async function logAction(userId, action, details = null) {
    try {
        await pool.query(
            "INSERT INTO logs (user_id, action, details) VALUES ($1, $2, $3)",
            [userId, action, details]
        );
    } catch (error) {
        console.error("Ошибка при записи в лог:", error);
    }
}

module.exports = logAction;
