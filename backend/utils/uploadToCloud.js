import fs from 'fs';
import cloudinary from '../config/cloudinary.js';
import CustomError from './CustomError.js';
import i18n from '../config/i18n.js';

const uploadToCloud = async (req) => {
	if (req.upload === 'course') {
		if (req.filePath) {
			const result = await cloudinary.uploader.upload(req.filePath, {
				folder: 'images/courses',
				resource_type: 'image',
				type: 'upload',
				access_mode: 'public',
			});
			if (!result.secure_url) {
				fs.unlinkSync(req.filePath);
				throw new CustomError(
					i18n.__({ phrase: 'uploads.failed_to_upload_cover_image', locale: 'en' }),
					500,
				);
			}

			fs.unlinkSync(req.filePath);
			req.body.coverImage = result.secure_url;
		}
	}

	if (req.upload === 'lesson') {
		if (req.filePath) {
			const result = await cloudinary.uploader.upload(req.filePath, {
				folder: 'videos/lessons',
				resource_type: 'video',
				type: 'upload',
				access_mode: 'public',
			});

			if (!result.secure_url) {
				fs.unlinkSync(req.filePath);
				throw new CustomError(
					i18n.__({ phrase: 'uploads.failed_to_upload_video', locale: 'en' }),
					500,
				);
			}

			fs.unlinkSync(req.filePath);

			req.body.video = result.secure_url;
		}
	}

	if (req.upload === 'new') {
		if (req.filePath) {
			const result = await cloudinary.uploader.upload(req.filePath, {
				folder: 'images/news',
				resource_type: 'image',
				type: 'upload',
				access_mode: 'public',
			});

			if (!result.secure_url) {
				fs.unlinkSync(req.filePath);
				throw new CustomError(
					i18n.__({ phrase: 'uploads.failed_to_upload_cover_image', locale: 'en' }),
					500,
				);
			}

			fs.unlinkSync(req.filePath);
			req.body.coverImage = result.secure_url;
		}
	}

	if (req.upload === 'resource') {
		if (req.filePath) {
			const result = await cloudinary.uploader.upload(req.filePath, {
				folder: 'files/resources',
				resource_type: 'raw',
				format: 'pdf',
				type: 'upload',
				access_mode: 'public',
			});

			if (!result.secure_url) {
				fs.unlinkSync(req.filePath);
				throw new CustomError(
					i18n.__({ phrase: 'uploads.failed_to_upload_video', locale: 'en' }),
					500,
				);
			}

			fs.unlinkSync(req.filePath);

			req.body.content = result.secure_url;
		}
	}

	if (req.upload === 'user') {
		if (req.coverImageFilePath) {
			const result = await cloudinary.uploader.upload(req.coverImageFilePath, {
				folder: 'images/users',
				resource_type: 'image',
				type: 'upload',
				access_mode: 'public',
			});

			if (!result.secure_url) {
				fs.unlinkSync(req.coverImageFilePath);
				throw new CustomError(
					i18n.__({ phrase: 'uploads.failed_to_upload_cover_image', locale: 'en' }),
					500,
				);
			}

			fs.unlinkSync(req.coverImageFilePath);
			req.body.coverImage = result.secure_url;
		}

		if (req.cvFilePath) {
			const result = await cloudinary.uploader.upload(req.cvFilePath, {
				folder: 'files/cvs',
				resource_type: 'raw',
				format: 'pdf',
				type: 'upload',
				access_mode: 'public',
			});
			if (!result.secure_url) {
				fs.unlinkSync(req.cvFilePath);
				throw new CustomError(
					i18n.__({ phrase: 'uploads.failed_to_upload_cv', locale: 'en' }),
					500,
				);
			}
			fs.unlinkSync(req.cvFilePath);

			req.body.cv = result.secure_url;
		}
	}
};

export default uploadToCloud;
