import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const signIn=async (req,res)=>{
    const {email,password}=req.body;
    try {
        const result=await User.findOne({email});
        
        if(!result) res.status(400).json('User Not Found');

        const Password=await bcrypt.compare(password,result.password);

        if(!Password) res.status(400).json('Incorrect Password');

        const token=jwt.sign({email:result.email,id:result._id},process.env.JWT_SECRET,{expiresIn:'1h'})

        return  res.cookie('access_token',token,{httpOnly:true}).status(200).json(result);
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"});
    }
}

export const signUp=async(req,res)=>{
    const {name,email,password,confirmPassword,profilePhoto}=req.body;
    try {
        const userData=await User.findOne({email});
        if(userData) return res.status(400).json({message:'User Already exist'});
        if(req.body.password!=confirmPassword) return res.status(400).json({message:'Password Mismatched'});
        const hashedPassword=await bcrypt.hash(confirmPassword,12);
        const result=await User.create({name,email,password:hashedPassword,profilePhoto});
        const {password,...rest}=result._doc;

        const token=jwt.sign({email:result.email,id:result._id},process.env.JWT_SECRET,{expiresIn:'1h'});
       
       return res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
        
    } catch (error) {
       return res.status(500).json({message:"Something went wrong"});
    }
}

export const google=async(req,res)=>{
    const {name,email,profilePhoto}=req.body;
    try {
        const result=await User.findOne({email});
        if(result){
            const token=jwt.sign({email:result.email,id:result._id},process.env.JWT_SECRET,{expiresIn:'1h'});
            const {password,...rest}=result._doc;
            return res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
        }else{
            const generatedPassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
            const hashedPassword=bcrypt.hashSync(generatedPassword,10);
            const newUser=await User.create({name,email,password:hashedPassword,profilePhoto});
            const token=jwt.sign({email:newUser.email,id:newUser._id},process.env.JWT_SECRET,{expiresIn:'1h'});
            const {password,...rest}=newUser._doc;
            return res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
        }
    } catch (error) {
        return res.status(500).json({message:'something went wrong'});
    }
}
//every data coming from mongo is extracted via _doc;

export const getUser=async(req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        if(!user) return res.status(404).json({message:'User not Found'});
        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const updateUser=async(req,res)=>{
    try {
        console.log(req.body)
        const response=await User.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body
            },
            {new:true}
        )
        console.log(response)
        const {password,...rest}=response._doc;
        console.log(rest);
        if(!response) return res.status(404).json({message:'User in not found'})
        return res.status(200).json(rest)
    } catch (error) {
        return res.status(500).json({message:'SOmething went wrong'});
    }
}
