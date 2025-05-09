// routes/alarmRouter.js
import express from 'express';
import {
  createAlarm,
  getAlarmByCode,
  updateAlarmStatus,
  deleteAlarm
} from '../controllers/alarmController.js';

const router = express.Router();

// Create a new alarm
router.post('/create', createAlarm);

// Get alarm by security code
router.get('/:code', getAlarmByCode);

// Update alarm status
router.patch('/:code', updateAlarmStatus);

// Delete alarm
router.delete('/:code', deleteAlarm);

export default router;