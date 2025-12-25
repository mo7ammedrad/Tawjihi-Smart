import util from 'util';
import jwt from 'jsonwebtoken';

export const createToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED });

export const verifyToken = (token) => util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
