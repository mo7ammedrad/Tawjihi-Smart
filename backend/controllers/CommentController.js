import Comment from '../models/Comment.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

export const getAllComments = getAll(Comment);

export const createComment = createOne(Comment);

export const getComment = getOne(Comment, 'Comment');

export const updateComment = updateOne(Comment, 'Comment');

export const deleteComment = deleteOne(Comment, 'Comment');
