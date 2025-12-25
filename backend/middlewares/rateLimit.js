import rateLimit from 'express-rate-limit';

export const aiGenerateRateLimit = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 50,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: 'Too many AI quiz requests. Try again later.' },
});

export const aiChatRateLimit = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 30,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: 'Too many AI chat requests. Please slow down.' },
});
