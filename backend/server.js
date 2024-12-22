const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // Подключение маршрутов из routes.js
const userRoutes = require('./userRoutes');
require('dotenv').config(); // Подключение переменных окружения

const app = express();

// Middleware
// Разрешает кросс-доменные запросы
app.use(cors());
// Позволяет серверу понимать и обрабатывать JSON-запросы
app.use(express.json());

// Подключение маршрутов
// Все маршруты из routes.js будут доступны по префиксу /api
// Например, http://localhost:3000/api/vessels
app.use('/api', routes);
app.use('/auth', userRoutes);

app.get('/', (req, res) => {
  res.send('Добро пожаловать на сервер!');
});


const PORT = process.env.PORT || 3000;
// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});