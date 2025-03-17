const express = require("express");
const pool = require("../db");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;
        let query = "SELECT * FROM logs ORDER BY created_at DESC";
        let values = [];

        if (userId) {
            query = "SELECT * FROM logs WHERE user_id = $1 ORDER BY created_at DESC";
            values.push(userId);
        }

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error("Ошибка при получении логов:", error);
        res.status(500).json({ error: "Ошибка при получении логов" });
    }
});

module.exports = router;
