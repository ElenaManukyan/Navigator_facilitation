// Подключение к базе данных
const pool = require('../db');
const Joi = require('joi');

// Схема валидации для судна
const vesselSchema = Joi.object({
  name: Joi.string().max(255).required(),
  imo: Joi.number().integer().min(1000000).max(9999999).required(),
  call_sing: Joi.string().max(255).required(),
  flag: Joi.string().max(100).required(),
  port_registry: Joi.string().max(255).required(),
  active: Joi.boolean().required(),
});

// Получить список всех судов
exports.getVessels = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vessel');
    if (result.rows.length === 0) {
      res.status(200).json([]);
    } else {
      res.status(200).json(result.rows);
    }
  } catch (err) {
    console.error('Ошибка при получении судов:', err.message);
    res.status(500).json({ error: 'Ошибка при получении судов:' });
  }
};

// Создать новое судно
exports.createVessel = async (req, res) => {
  const { error, value } = vesselSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, imo, call_sing, flag, port_registry, active } = value;
  try {
    const result = await pool.query('INSERT INTO vessel (name, imo, call_sing, flag, port_registry, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [
      name,
      imo,
      call_sing,
      flag,
      port_registry,
      active,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при создании судна:', err.message);
    res.status(500).json({ error: 'Ошибка при создании судна:' });
  }
};

// Обновить данные судна
exports.updateVessel = async (req, res) => {
  const { error, value } = vesselSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { id } = req.params;
  const { name, imo, call_sing, flag, port_registry, active } = value;
  try {
    const result = await pool.query('UPDATE vessel SET name = $1, imo = $2, call_sing = $3, flag = $4, port_registry = $5, active = $6 WHERE id = $7 RETURNING *', [
      name,
      imo,
      call_sing,
      flag,
      port_registry,
      active,
      id,
    ]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при обновлении судна:', err.message);
    res.status(500).json({ error: 'Ошибка при обновлении судна:' });
  }
};

// Удалить судно
exports.deleteVessel = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM vessel WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Ошибка при удалении судна:', err.message);
    res.status(500).json({ error: 'Ошибка при удалении судна:' });
  }
};
