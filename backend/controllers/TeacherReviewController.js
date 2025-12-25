import TeacherReview from '../models/TeacherReview.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

export const getAllTeacherReviews = getAll(TeacherReview);

export const createTeacherReview = createOne(TeacherReview);

export const getTeacherReview = getOne(TeacherReview, 'TeacherReview');

export const updateTeacherReview = updateOne(TeacherReview, 'TeacherReview');

export const deleteTeacherReview = deleteOne(TeacherReview, 'TeacherReview');
