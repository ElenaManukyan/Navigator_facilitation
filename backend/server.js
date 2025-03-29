const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes'); // Подключение маршрутов из routes.js
const userRoutes = require('./userRoutes');
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
  credentials: true, // Для куки/сессий
  exposedHeaders: ['Authorization']
}));
// Позволяет серверу понимать и обрабатывать JSON-запросы
app.use(express.json());

// Установка лимита на тело запроса
// app.use(express.json({ limit: '50kb' }));
// Для данных, закодированных в URL
app.use(express.urlencoded({ extended: true }));

// Если фронтенд - это React/Vue сборка
app.use(express.static(path.join(__dirname, '../frontend/build')));

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

// Обработка всех остальных запросов (для SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'src/index.js'));
});


app.get('/', (req, res) => {
  res.send('Добро пожаловать на сервер!');
});


const PORT = process.env.PORT || 5000;
// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});