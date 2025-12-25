import i18n from 'i18n';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

i18n.configure({
	// Available locales
	locales: ['en', 'ar'],

	// Directory where translation files are stored
	directory: path.join(__dirname, '..', 'locales'),

	// Default locale
	defaultLocale: 'ar',

	// The header field to detect language
	header: 'accept-language' || 'Accept-Language',

	// Query parameter to switch locale (e.g., /api/v1/users?lang=ar)
	queryParameter: 'lang',

	// Whether to write new keys to the locale file
	autoReload: true,

	// Sync all files when a new key is added
	syncFiles: true,

	// Object notation for nested keys
	objectNotation: true,
});

export default i18n;
