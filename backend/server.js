const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // Подключение маршрутов из routes.js
const userRoutes = require('./userRoutes');
// const { Pool } = require("pg");
require('dotenv').config(); // Подключение переменных окружения

console.log('=== Application стартовала ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'установлен' : 'отсутствует');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'установлен' : 'отсутствует');

const app = express();

// Middleware
// Разрешает кросс-доменные запросы
app.use(cors({
  origin: [
    'https://navigator-facilitation.onrender.com', // Фронтенд
    'http://localhost:3000' // Для локальной разработки
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешенные методы
  allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
  credentials: true // Для куки/сессий
}));
// Позволяет серверу понимать и обрабатывать JSON-запросы
app.use(express.json());

// Установка лимита на тело запроса
// app.use(express.json({ limit: '50kb' }));
// Для данных, закодированных в URL
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Подключение маршрутов
// Все маршруты из routes.js будут доступны по префиксу /api
// Например, http://localhost:3000/api/vessels
app.use('/api', routes);
app.use('/auth', userRoutes);

// Если ни один маршрут не подошел
app.use((req, res) => {
  res.status(404).json({ error: 'Не найдено' });
});

// Обработка ошибок в middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Что-то пошло не так!' });
});

// Middleware для логирования всех запросов на сервере
app.use((req, res, next) => {
  console.log(`Запрос: ${req.method} ${req.url}`);
  console.log('Заголовки:', req.headers);
  console.log('Тело запроса:', req.body);
  next();
});

// Middleware для проверки объёма cookies, которые передаются серверу
/*
app.use((req, res, next) => {
  console.log('Cookie:', req.headers.cookie);
  next();
});
*/


app.get('/', (req, res) => {
  res.send('Добро пожаловать на сервер!');
});


const PORT = process.env.PORT || 5000;
// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});