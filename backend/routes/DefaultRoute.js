import express from 'express';
import CustomError from '../utils/CustomError.js';

const router = express.Router();

router.all('*', (req, res, next) =>
	next(new CustomError(`لا يمكن العثور على ${req.originalUrl} على هذا الخادم`, 404)),
);

export default router;
