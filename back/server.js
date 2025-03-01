const express = require('express');
const app = express();

// Порт, на котором будет работать сервер
const PORT = 3000;

// Главный маршрут
app.get('/', (req, res) => {
    res.send('Привет, это мой первый сервер на Node.js!');
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

app.use(express.json());

let users = [
    { id: 1, name: "Иван" },
    { id: 2, name: "Мария" },
];

// 1️⃣ Получить всех пользователей
app.get('/users', (req, res) => {
    res.json(users);
});

// 2️⃣ Получить пользователя по ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === Number(req.params.id));
    user ? res.json(user) : res.status(404).json({ message: "Пользователь не найден" });
});

// 3️⃣ Добавить нового пользователя
app.post('/users', (req, res) => {
    const newUser = { id: users.length + 1, name: req.body.name };
    users.push(newUser);
    res.status(201).json(newUser);
});

// 4️⃣ Удалить пользователя
app.delete('/users/:id', (req, res) => {
    users = users.filter(u => u.id !== Number(req.params.id));
    res.json({ message: "Пользователь удален" });
});