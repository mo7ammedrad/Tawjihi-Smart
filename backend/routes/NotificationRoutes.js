import express from 'express';
import { protect, allowedTo } from '../middlewares/authMiddleware.js';
import {
	getMyNotifications,
	markAllMyNotificationsRead,
	markNotificationRead,
	broadcastNotification,
} from '../controllers/NotificationController.js';

const router = express.Router();

router.get('/me', protect, getMyNotifications);
router.patch('/me/read-all', protect, markAllMyNotificationsRead);
router.patch('/:id/read', protect, markNotificationRead);
router.post('/broadcast', protect, allowedTo('admin', 'teacher'), broadcastNotification);

export default router;
