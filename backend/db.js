const { Pool } = require('pg');
require('dotenv').config();

// Подключение к PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Простой запрос к базе данных для проверки
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.error('Ошибка подключения к БД:', err);
    } else {
      console.log('Успешное подключение к PostgreSQL. Текущее время:', result.rows[0].now);
    }
});

// Экспорт pool для использования в других файлах
module.exports = pool;