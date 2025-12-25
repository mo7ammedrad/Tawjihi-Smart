const extractPublicId = (url) => {
	const parts = url.split('/upload/');
	if (parts.length < 2) return null;

	const pathWithExtension = parts[1];

	const pathWithoutVersion = pathWithExtension.replace(/^v\d+\//, '');
	const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, '');

	return publicId;
};

export default extractPublicId;
