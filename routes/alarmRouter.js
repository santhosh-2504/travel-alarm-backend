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
router.get('/alarms/:code', getAlarmByCode);

// Update alarm status
router.patch('/alarms/:code', updateAlarmStatus);

// Delete alarm
router.delete('/alarms/:code', deleteAlarm);

export default router;