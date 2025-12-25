import Stripe from 'stripe';
import i18n from '../config/i18n.js';
import Course from '../models/Course.js';
import Payment from '../models/Payment.js';
import Enrollment from '../models/Enrollment.js';
import { getAll, getOne } from './controller.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const getPayments = getAll(Payment);

export const getPayment = getOne(Payment, 'Payment');

export const createCheckoutSession = asyncErrorHandler(async (req, res) => {
	const { ids } = req.body;
	const promises = ids.map((id) => Course.findById(id));
	const courses = await Promise.all(promises);

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: courses.map((item) => ({
			price_data: {
				currency: 'ils',
				product_data: {
					name: item.name,
				},
				unit_amount: item.price * 100,
			},
			quantity: 1,
		})),
		metadata: {
			courses: ids.join(' '),
			user: req.user.id,
		},
		mode: 'payment',
		// include the session id so frontend can confirm payment if webhook isn't delivered
		success_url: `${process.env.FRONTEND_URL}/user/my-courses?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${process.env.FRONTEND_URL}/cancel`,
	});

	res.status(201).json({
		status: 'success',
		sessionUrl: session.url,
	});
});

// Confirm a checkout session (used when user returns to success_url)
export const confirmCheckoutSession = asyncErrorHandler(async (req, res) => {
	const { session_id } = req.query;
	if (!session_id) {
		return res.status(400).json({ status: 'fail', message: 'session_id is required' });
	}

	const session = await stripe.checkout.sessions.retrieve(session_id);

	if (session.payment_status !== 'paid') {
		return res.status(400).json({ status: 'fail', message: 'Payment not completed' });
	}

	const { metadata } = session;
	const ids = metadata.courses.split(' ');

	// create payment record if not exists for this session
	const existing = await Payment.findOne({ sessionId: session.id });
	if (!existing) {
		await Payment.create({
			user: metadata.user,
			amount: session.amount_total / 100,
			sessionId: session.id,
		});

		// create enrollments but avoid duplicates
		const promises = ids.map(async (id) => {
			const exists = await Enrollment.findOne({ user: metadata.user, course: id });
			if (!exists) {
				await Enrollment.create({ user: metadata.user, course: id });
			}
		});

		await Promise.all(promises);
	}

	return res.status(200).json({ status: 'success' });
});

export const webhook = asyncErrorHandler(async (req, res) => {
	console.log('Webhook received');
	const sig = req.headers['stripe-signature'];
	let event;

	try {
		event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
	} catch (err) {
		const errorMessage = i18n.__(
			{ phrase: 'generic.webhook_error', locale: 'en' },
			{ error_message: err.message },
		);
		console.error(errorMessage);
		return res.status(400).send(errorMessage);
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object;
		const { metadata } = session;
		const ids = metadata.courses.split(' ');

		// store session id to prevent double-processing (if frontend calls confirm)
		await Payment.create({
			user: metadata.user,
			amount: session.amount_total / 100,
			sessionId: session.id,
		});

		const promises = ids.map(async (id) => {
			const exists = await Enrollment.findOne({ user: metadata.user, course: id });
			if (!exists) return Enrollment.create({ user: metadata.user, course: id });
			return null;
		});
		await Promise.all(promises);
	}

	res.status(200).json({ status: i18n.__({ phrase: 'generic.received', locale: 'en' }) });
});
