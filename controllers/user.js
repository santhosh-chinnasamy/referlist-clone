const User = require('../models/user').User;
const apiResponse = require('../_helpers/apiresponse');
const random = require('../_helpers/random');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

exports.login = async (req,res) => {
    let {email,password} = req.body;
    password = await md5(password);
    let user = await User.findOne({email,password},{password:false},(err,result)=>{
        if(err) return apiResponse.ErrorResponse(res,err.message);
        else result;
    }).lean();
    
    if(user){
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
    user.accessToken = accessToken;
    return apiResponse.successResponseWithData(res,"login success",user);
    }
    else{
        return apiResponse.successResponse(res,"No user found");
    }
};

exports.signup = async (req,res) => {
    let {
        name,
        password,
        email,
        status
    } = req.body;
    password = md5(password);
    let created_at = new Date();
    let updated_at = new Date();
    let unique_code = random.randomString(process.env.RS_LENGTH);

    let newUser = new User({name,password,email,status,created_at,updated_at,unique_code},(err,result)=>{
        if(err) return apiResponse.ErrorResponse(res,err.message);
        else result;
    });

    await newUser.save((err,result)=>{
        if(err) return apiResponse.ErrorResponse(res,err.message);
        else return apiResponse.successResponse(res,"user created successfully");
    });

}