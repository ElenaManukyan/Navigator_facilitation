const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Регистрация пользователя
exports.register = async (req, res) => {
  console.log('Получен запрос на регистрацию:', req.body);

  const { username, password, role } = req.body;

  if (!username || !password) {
    console.log('Отсутствуют обязательные поля');
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Сохранение пользователя в базе данных
    const result = await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *', [username, hashedPassword, role || 'user']);

    const newUser = result.rows[0];

    // Генерация JWT
    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username, role: newUser.role },
      token,
    });

    console.log('Успешная регистрация:', user.username);
  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).json({ error: 'Ошибка при регистрации пользователя', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
};

// Авторизация пользователя (вход)
exports.login = async (req, res) => {
  console.log('Получен запрос на вход:', req.body);

  const { username, password } = req.body;
  console.log('Введённый пароль:', `"${password}"`);

  if (!username || !password) {
    console.log('Отсутствует username или password');
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {

    console.error("Тестовый лог " + new Date().toISOString()); // error логи выводятся быстрее
    process.stdout.write("Принудительный вывод\n"); // сброс буфера

    console.log('Попытка найти пользователя:', username);
    // Проверка, существует ли пользователь
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    // console.log(`result= ${JSON.stringify(result, null, 2)}`);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Проверка пароля
    console.log('Сравнение паролей');
    console.log(`user= ${JSON.stringify(user, null, 2)}`);
    console.log('Хеш из БД:', user.password);
    console.log('Длина пароля:', password.length); // Для 'admin' должно быть 5
    console.log('HEX пароля:', Buffer.from(password).toString('hex'));
    
    const isMatch = await bcrypt.compare(
      password.trim(),
      user.password
    );
    console.log(`isMatch= ${isMatch}`);


    const testPassword = 'admin'; // Пароль, который должен подходить
    const testHash = '$2b$10$yrtHjacabNIth2vAhP/f3ulAOeu3y7xBiEAnUbW1ySnMegGI8.3jy';

    const manualCheck = await bcrypt.compare(testPassword, testHash);
    console.log('Ручная проверка:', manualCheck); // Должно быть true
    console.log('Сравнение хешей:', user.password === testHash); // Должно быть true

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Генерация JWT
    console.log('Генерация токена');
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Отправка ответа с токеном');
    // res.status(200).json({ message: 'Login successful', token });
    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Ошибка при входе:', err.message);
    res.status(500).json({ error: 'Ошибка при входе' });
  }
};
