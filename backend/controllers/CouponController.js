import Coupon from '../models/Coupon.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

export const getAllCoupons = getAll(Coupon);

export const createCoupon = createOne(Coupon);

export const getCoupon = getOne(Coupon, 'coupon');

export const updateCoupon = updateOne(Coupon, 'coupon');

export const deleteCoupon = deleteOne(Coupon, 'coupon');
