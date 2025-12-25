import express from 'express';
import passport from 'passport';
import { createToken } from '../utils/JWTs.js';
import { protect } from '../middlewares/authMiddleware.js';

import {
	signupValidator,
	loginValidator,
	forgetPasswordValidator,
	verifyResetCodValidator,
	resetPasswordValidator,
} from '../utils/validators/authValidator.js';

import {
	signup,
	login,
	forgetPassword,
	verifyResetCod,
	resetPassword,
	logout,
	getToken,
} from '../controllers/AuthController.js';

import { uploadUserFiles, handleUserFiles } from '../controllers/UserController.js';

const router = express.Router();

const oauthCallbackHandler = function (req, res) {
	const token = createToken(req.user.id);
	const isDev = process.env.NODE_ENV !== 'production';
	const options = {
		httpOnly: true,
		sameSite: isDev ? 'Lax' : 'None',
		secure: !isDev,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	};

	res.cookie('token', token, options);

	res.redirect(`${process.env.FRONTEND_URL}/oauth-success`);
};

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/', session: false }),
	oauthCallbackHandler,
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get(
	'/facebook/callback',
	passport.authenticate('facebook', { failureRedirect: '/', session: false }),
	oauthCallbackHandler,
);

router.post('/signup', uploadUserFiles, handleUserFiles, signupValidator, signup);

router.post('/login', loginValidator, login);

router.post('/forgetPassword', forgetPasswordValidator, forgetPassword);

router.post('/verifyResetCode', verifyResetCodValidator, verifyResetCod);

router.patch('/resetPassword', resetPasswordValidator, resetPassword);

router.get('/logout', protect, logout);
router.get('/token', protect, getToken);

export default router;
