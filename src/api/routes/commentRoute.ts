import express from 'express';
import {body} from 'express-validator';
import {validate} from '../../middlewares';
import {commentPost} from '../controllers/commentController';

const router = express.Router();

router.route('/').post(
  body('comment').notEmpty().escape().withMessage('Comment is required'),
  body('style').optional().isIn(['nice', 'funny', 'mean', 'sarcastic', 'professional', 'casual']).withMessage('Style must be one of: nice, funny, mean, sarcastic, professional, casual'),
  validate, 
  commentPost
);

export default router;
