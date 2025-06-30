import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String},
    profilePhoto:{
        type:String,
        default:"https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
    },
    description:{
        type:String,
        default:"As a passionate food lover, I revel in discovering diverse cuisines and savoring unique flavors. My culinary adventures lead me to explore new recipes and enjoy every gastronomic delight the world offers"
    },
    feedback:{type:String}
},{timestamps:true})

export default mongoose.model('Cheif',userSchema);