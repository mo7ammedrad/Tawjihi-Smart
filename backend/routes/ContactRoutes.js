import express from 'express';
import { sendContactMessage } from '../controllers/ContactController.js';
import { contactValidator } from '../utils/validators/contactValidator.js';

const router = express.Router();

router.post('/', contactValidator, sendContactMessage);

export default router;
