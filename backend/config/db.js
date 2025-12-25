import mongoose from 'mongoose';
import { config } from 'dotenv';
import i18n from './i18n.js'; // Import the i18n configuration

config({ path: './config.env' });

const connectDB = async (uri) => {
	try {
		await mongoose.connect(uri);
		// Use i18n for the success message
		console.log(
			i18n.__(
				{ phrase: 'database.connection_success', locale: 'en' },
				{ db_name: process.env.DB_NAME },
			),
		);
	} catch (error) {
		// Use i18n for the failure message
		console.error(
			i18n.__(
				{ phrase: 'database.connection_failed', locale: 'en' },
				{ error_message: error.message },
			),
		);
		process.exit(1);
	}
};

export { connectDB };
