require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const pool = require("./db")
app.use(cors());
app.use(express.json());

// Подключение маршрутов
app.use("/auth", userRoutes);
app.use("/file", fileRoutes);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
