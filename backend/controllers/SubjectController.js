import Subject from '../models/Subject.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

export const getAllSubjects = getAll(Subject);

export const createSubject = createOne(Subject);

export const getSubject = getOne(Subject, 'Subject');

export const updateSubject = updateOne(Subject, 'Subject');

export const deleteSubject = deleteOne(Subject, 'Subject');
