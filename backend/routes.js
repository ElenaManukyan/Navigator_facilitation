const express = require('express');
const router = express.Router();
// Контроллеры для работы с таблицей Vessel
const vesselController = require('./controllers/vesselController');
const { authenticateToken, authorizeRole } = require('./authMiddleware');

// Маршруты для работы с суднами (доступ только для авторизованных пользователей)
router.get('/vessels', authenticateToken, vesselController.getVessels);
router.post('/vessels', authenticateToken, authorizeRole('admin'), vesselController.createVessel);
router.put('/vessels/:id', authenticateToken, authorizeRole('admin'), vesselController.updateVessel);
router.delete('/vessels/:id', authenticateToken, authorizeRole('admin'), vesselController.deleteVessel);

module.exports = router;