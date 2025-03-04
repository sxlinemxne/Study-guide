const pool = require("../db"); // Подключаем pool правильно

class User {
    // Найти пользователя по email
    static async findOne({ email }) {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        return result.rows[0] || null; // Если не найдено, вернуть null
    }

    // Создать нового пользователя
    static async create(name, email, password, role) {
        const result = await pool.query(
            `INSERT INTO users (name, email, password, role) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, email, password, role]
        );
        return result.rows[0]; // Возвращаем созданного пользователя
    }
}

module.exports = User; // Экспортируем класс User
