import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { inbox, markRead, sendMessage, sent } from '../controllers/MessageController.js';

const router = express.Router();

router.use(protect);
router.get('/inbox', inbox);
router.get('/sent', sent);
router.post('/', sendMessage);
router.patch('/:id/read', markRead);

export default router;
