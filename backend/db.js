const { Pool } = require('pg');
require('dotenv').config();

// Подключение к PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Простой запрос к базе данных для проверки
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err);
    } else {
      console.log('Результат запроса:', result.rows[0]);
    }
});

// Экспорт pool для использования в других файлах
module.exports = pool;