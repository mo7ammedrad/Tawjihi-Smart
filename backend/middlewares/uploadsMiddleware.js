import multer, { memoryStorage } from 'multer';

const upload = multer({
	storage: memoryStorage(),
});

export const uploadSingleField = (fieldName) => upload.single(fieldName);

export const uploadMultipleFields = (fields) => upload.fields(fields);
