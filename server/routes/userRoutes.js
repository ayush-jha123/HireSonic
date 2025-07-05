import express from 'express';
import {signIn,signUp,google,getUser,updateUser,logout} from '../controllers/user.js';

const router=express.Router();
router.post('/signin',signIn);
router.post('/signup',signUp);
router.post('/google',google);
router.get('/getuser/:id',getUser);
router.put('/update/:id',updateUser);
router.post('/logout',logout);

export default router;

