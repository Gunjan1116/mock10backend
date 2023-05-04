const express=require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const {Usermodel}=require("../models/userModel");
require("dotenv").config();
const userRoute=express.Router();

userRoute.post("/register",async(req,res)=>{
    let {name,email,password}=req.body;
    try {
        let reqData=await Usermodel.find({email});
        if(reqData.length>0){
            return res.json({"msg":"You already register"})
        }
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                console.log("error while hashing the password",err);
                res.json({"msg":"error in hashing password"})
            }else{
                let sendingData=new Usermodel({name,email,password:hash});
                await sendingData.save();
                res.json({"msg":"successfully registered"})
            }
        })
    } catch (error) {
        console.log("error while registering the user",error);
        res.json({"msg":"error while registering the user"})
    }
})

userRoute.post("/login",async(req,res)=>{
    let {email,password}=req.body;
    try {
        let reqUser=await Usermodel.find({email});
        if(reqUser.length==0){
            return res.json({"msg":"Register first"})
        }
        bcrypt.compare(password,reqUser[0].password,async(err,result)=>{
            if(result){
                let token=jwt.sign({userId:reqUser[0]._id,name:reqUser[0].name},process.env.key);
                res.json({"msg":"login success","token":token})
            }else{
                res.json({"msg":"Wrong Credential"})
            }
        })
    } catch (error) {
        console.log("error while login the user",error);
        res.json({"msg":"error while login the user"})
    }
})

module.exports={
    userRoute
}