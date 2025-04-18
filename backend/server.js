const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes'); // Подключение маршрутов из routes.js
const userRoutes = require('./userRoutes');
require('dotenv').config(); // Подключение переменных окружения

const app = express();

// Middleware
// Разрешает кросс-доменные запросы
app.use(cors({
  origin: [
    'https://navigator-facilitation.onrender.com', // Фронтенд
    'http://localhost:3000' // Для локальной разработки
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешенные методы
  credentials: true, // Для куки/сессий
}));
// Позволяет серверу понимать и обрабатывать JSON-запросы
app.use(express.json());

// Установка лимита на тело запроса
// app.use(express.json({ limit: '50kb' }));
// Для данных, закодированных в URL
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Подключение маршрутов
// Все маршруты из routes.js будут доступны по префиксу /api
// Например, http://localhost:3000/api/vessels
app.use('/api', routes);
app.use('/', userRoutes);

// Middleware для логирования всех запросов на сервере
app.use((req, res, next) => {
  console.log(`Запрос: ${req.method} ${req.url}`);
  console.log('Заголовки:', req.headers);
  console.log('Тело запроса:', req.body);
  next();
});

app.get('/', (req, res) => {
  res.send('Добро пожаловать на сервер!');
});

// Если ни один маршрут не подошел
app.use((req, res) => {
  res.status(404).json({ error: 'Не найдено' });
});

// Обработка ошибок в middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Что-то пошло не так!' });
});

const PORT = process.env.PORT || 5000;
// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту: ${PORT}`);
});