import express from 'express';
import { createInterview, getInterviews } from '../controllers/interview.js';
// import {signIn,signUp,google,getUser,updateUser} from '../controllers/user.js';

const router=express.Router();
router.post('/generate',createInterview);
router.get('/get',getInterviews);


export default router;

