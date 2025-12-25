import nodemailer from 'nodemailer';

export const sendEmail = async function (options) {
	const transporter = nodemailer.createTransport({
		host: process.env.HOST_EMAIL,
		port: process.env.PORT_EMAIL,
		auth: {
			user: process.env.USER_EMAIL,
			pass: process.env.PASS_EMAIL,
		},
	});

	await transporter.sendMail({
		from: options.from,
		to: options.to,
		subject: options.subject,
		text: options.text,
		html: options.html,
	});
};
