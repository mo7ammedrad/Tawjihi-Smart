import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import i18n from './config/i18n.js';
import routes from './routes/index.js';
import { webhook } from './controllers/PaymentController.js';
import { googleStrategy, facebookStrategy } from './config/passport.js';
import { globalErrorHandler } from './middlewares/errorMiddleware.js';
import path from 'path';

const app = express();

passport.use(googleStrategy);
passport.use(facebookStrategy);

app.use(i18n.init);

app.use(morgan('dev'));
const allowedOrigins = [
	process.env.FRONTEND_URL,
	'http://localhost:3000',
	'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
	cors({
		origin(origin, cb) {
			if (!origin) return cb(null, true); // Postman / server-to-server
			if (allowedOrigins.includes(origin)) return cb(null, true);
			return cb(new Error(`CORS blocked for origin: ${origin}`));
		},
		credentials: true,
	}),
);

app.post('/api/v1/webhook', express.raw({ type: 'application/json' }), webhook);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use(express.static(uploadsPath));
// دعم المسار القديم تحت /api/v1/uploads لتفادي 404 للروابط القديمة
app.use('/api/v1/uploads', express.static(uploadsPath));
app.use(passport.initialize());

// Mount routes
routes(app);

// Global error handler
app.use(globalErrorHandler);

export default app;
