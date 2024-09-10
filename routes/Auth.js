const express = require('express');
const { createUser,loginUser,userExists,checkUser, checkAuth} = require('../controller/Auth');
const passport=require('passport');

const router = express.Router();
//to create user the data is passed in the body of request

router
.post('/signup', createUser)
.post('/login',passport.authenticate('local'),loginUser)
.get('/userexist',userExists)
.get('/check',passport.authenticate('jwt'),checkUser)
.get('/checkauth',passport.authenticate('jwt'),checkAuth);

exports.router = router