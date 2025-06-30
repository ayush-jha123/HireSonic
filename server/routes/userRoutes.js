import express from 'express';
import {signIn,signUp,google,getUser,updateUser} from '../controllers/user.js';

const router=express.Router();
router.post('/signin',signIn);
router.post('/signup',signUp);
router.post('/google',google);
router.get('/getuser/:id',getUser);
router.put('/update/:id',updateUser);

export default router;

