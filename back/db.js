require('dotenv').config();
const { Pool } = require("pg");
// Подключение к PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,  // Должна быть строка
    port: process.env.DB_PORT || 5432,
});
console.log("Подключение установлено");
module.exports = pool;