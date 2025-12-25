import { config } from 'dotenv';
import { connectDB } from './config/db.js';

config({ path: './config.env' });

process.on('uncaughtException', (err) => {
	console.log(`UncaughtException: ${err.message}, ${err.stack}`);
	console.log('Shutting down the server due to uncaught exception');
	process.exit(1);
});

import app from './app.js';

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
	console.log(`Environment: ${process.env.NODE_ENV}`);
	console.log(`Server is running on ${process.env.BASE_URL}`);
});

connectDB(process.env.DB_URI);

process.on('unhandledRejection', (err) => {
	console.log(`UnhandledRejection: ${err.message}, ${err.stack}`);
	console.log('Shutting down the server due to unhandled promise rejection');
	server.close(() => {
		process.exit(1);
	});
});
