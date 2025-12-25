import express from 'express';

import { protect, allowedTo } from '../middlewares/authMiddleware.js';

import {
	createBranchValidator,
	updateBranchValidator,
	getBranchValidator,
	deleteBranchValidator,
} from '../utils/validators/branchValidator.js';

import {
	getAllBranches,
	createBranch,
	getBranch,
	updateBranch,
	deleteBranch,
} from '../controllers/BranchController.js';

const router = express.Router();

router
	.route('/')
	.get(getAllBranches)
	.post(protect, allowedTo('admin'), createBranchValidator, createBranch);

router
	.route('/:id')
	.get(getBranchValidator, getBranch)
	.patch(protect, allowedTo('admin'), updateBranchValidator, updateBranch)
	.delete(protect, allowedTo('admin'), deleteBranchValidator, deleteBranch);

export default router;
