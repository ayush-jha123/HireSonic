import express from 'express';
import { createInterview, getAllInterviews, getInterview } from '../controllers/interview.js';
// import {signIn,signUp,google,getUser,updateUser} from '../controllers/user.js';

const router=express.Router();
router.post('/generate',createInterview);
router.get('/get',getInterview);
router.get('/get/:id',getInterview);
router.get('/getAll',getAllInterviews);

export default router;

