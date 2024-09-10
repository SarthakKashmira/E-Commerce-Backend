const { User } = require('../model/User');
const crypto=require('crypto');
const jwt=require("jsonwebtoken");
const { filterUser } = require('../services/common');


exports.createUser=async(req,res)=>{
    try{
        
        const salt=crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function(err, hashedPassword){
        const user=new User({...req.body,password:hashedPassword,salt:salt});  
        const doc=await user.save();
        //now to create session we have to login and so passport has a function login 
        //This function also calls the serialize user function
        req.login(filterUser(doc),(err)=>{
            if(err)
            { res.status(400).json(err);}
            else{
                const SECRET_KEY='SECRET_KEY';
                const token=jwt.sign(filterUser(doc),SECRET_KEY);
                res.cookie('jwt',token,{expires:new Date(Date.now()+3600000),httpOnly:true}).status(200).json({id:doc.id,role:doc.role});  
              }
        })
    });
        
    }catch(err){
        res.status(400).json(err);
    }
}

exports.loginUser=async(req,res)=>{
    try{
        const token=req.user.token;
        res.cookie("jwt_token", token);
        res.json(token);  
    }catch(err)
    {
        res.send(err);
    }
}

exports.userExists=async(req,res)=>{
    try{
     const query=req.query.email;
     const user=await User.findOne({email:query},'id email name').exec();
     if(user===null){
     res.status(200).json({});}
     else{
        res.status(200).json(user);
     }
    }catch(err){
        res.status(401).json({message:"Invalid credentials"});
    }
}

exports.checkUser=async(req,res)=>{
    try{
        res.status(200).json({status:"success",user:req.user})
    }catch(err)
    {
        res.status(401).json(err);
    }
}


exports.checkAuth=async(req,res)=>{
    try{
        console.log("checking authentication")
        console.log(req.user);
        res.status(200).json({"token":req.user.token});
    }catch(err)
    {
        res.status(401).json(err);
    }
}