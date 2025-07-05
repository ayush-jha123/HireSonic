import express from 'express';
import { createFeedback, createInterview, getAllInterviews, getFeedback, getInterview, getUserInterviews } from '../controllers/interview.js';
// import {signIn,signUp,google,getUser,updateUser} from '../controllers/user.js';

const router=express.Router();
router.post('/generate',createInterview);
router.get('/getAll',getAllInterviews);
router.get('/get/:id',getInterview);
router.get('/user/:userId',getUserInterviews);
router.post('/feedback',createFeedback);
router.get('/feedback/:id',getFeedback);

export default router;

