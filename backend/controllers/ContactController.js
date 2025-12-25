import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { sendEmail } from '../utils/emails.js';
import CustomError from '../utils/CustomError.js';

export const sendContactMessage = asyncErrorHandler(async (req, res) => {
	const { name, email, message } = req.body;

	const to = process.env.USER_EMAIL;
	if (!to) throw new CustomError('Email service not configured', 500);

	const html = `
    <h2>New contact message</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${String(message).replace(/\n/g, '<br />')}</p>
  `;

	try {
		await sendEmail({
			from: 'Tawjihi Contact',
			to,
			subject: `Contact message from ${name}`,
			text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
			html,
		});
	} catch (e) {
		throw new CustomError('Failed to send message', 500);
	}

	res.status(200).json({ status: 'success' });
});
