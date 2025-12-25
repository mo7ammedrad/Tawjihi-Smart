import Branch from '../models/Branch.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

export const getAllBranches = getAll(Branch);

export const createBranch = createOne(Branch);

export const getBranch = getOne(Branch, 'Branch');

export const updateBranch = updateOne(Branch, 'Branch');

export const deleteBranch = deleteOne(Branch, 'Branch');
