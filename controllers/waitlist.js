const User = require('../models/user').User;
const List = require('../models/waitlist').List;
const apiResponse = require('../_helpers/apiresponse');
const random = require('../_helpers/random');

exports.createlist = async (req,res) => {
    let {
        list_name,
        description,
        company,
        website_url,
        domain
    } = req.body;

    let newList = new List({list_name,description,company,website_url,domain});
    await newList.save((err,result)=>{
        if(err) return apiResponse.ErrorResponse(res,err.message);
        else return apiResponse.successResponse(res,"list created successfully");
    });
};

exports.readlist = async (req,res)=>{
    let { id } = req.params;
    let {with_users} = req.query;

    let filter = with_users ? {} : {users:false};
    let getlist = await List.findOne({_id:id},filter,(err,result)=>{
        if(err) return apiResponse.ErrorResponse(res,err.message);
        else result;
    });
    return apiResponse.successResponseWithData(res,"requested list found",getlist);
};

exports.editlist = async (req,res)=>{
    let { 
        list_id,
        list_name,
        description,
        domain,
        company
     } = req.body;

     let updatelist = await List.findByIdAndUpdate({_id:list_id},{$set:{list_name,description,domain,company}},(err,result)=>{
        if(err) return apiResponse.ErrorResponse(res,err.message);
        else result;
     });

     return apiResponse.successResponse(res,"list updated",updatelist);
};

exports.deletelist = async (req,res) => {
    let { id } = req.params;

    let deletelist = await List.findByIdAndDelete({_id:id},(err,result)=>{
        if(err) return apiResponse.ErrorResponse(res,err.message);
        else result;
    });

    return apiResponse.successResponse(res,"list deleted");
}

exports.joinlist = async (req,res) =>{
    let { domain} = req.params;
    let { email } = req.query;


    // check if domain exists
    let is_domain_exists = await List.findOne({domain},(err,result)=>{
        if(err) return apiResponse.ErrorResponse(res,err.message);
        else result;
    });

    // check if email exists in users collection
    let is_user_exists = await User.findOne({email},(err,result)=>{
        if(err) return apiResponse.ErrorResponse(res,err.message);
        else result;
    });

    // check if email already in waiting list
    let is_email_exists = await List.findOne({domain,"users.email":email},(err,result)=>{
        if(err) return apiResponse.ErrorResponse(res,err.message);
        else result;
    });

    if(!is_domain_exists) return apiResponse.ErrorResponse(res,"domain not exists");
    
    let response = {};
    if(!is_user_exists && !is_email_exists){ // add new user to users collection
        let unique_code = random.randomString(7);
        let adduser = new User({email,unique_code});
        await adduser.save((err,resut)=>{
            if(err) return apiResponse.ErrorResponse(res,err.message);
        });
        // add email to list
       await List.findOneAndUpdate({domain},{$addToSet :{users: {email}}},(err,result)=>{
            if(err) return apiResponse.ErrorResponse(res,err.message);
            else result;
        });

        response = await List.findOne({domain,"users.email":email},{"users.$":true},(err,result)=>{
            if(err) return apiResponse.ErrorResponse(res,err.message);
            else result;
        });
    }else if(is_user_exists && !is_email_exists){ // user exists but not in waiting list
        await List.findOneAndUpdate({domain},{$addToSet :{users: {email}}},(err,result)=>{
            if(err) return apiResponse.ErrorResponse(res,err.message);
            else result;
        });

        response = await List.findOne({domain,"users.email":email},{"users.$":true},(err,result)=>{
            if(err) return apiResponse.ErrorResponse(res,err.message);
            else result;
        });
    }else if(is_user_exists && is_email_exists){
        response = await List.findOne({domain,"users.email":email},{"users.$":true},(err,result)=>{
            if(err) return apiResponse.ErrorResponse(res,err.message);
            else result;
        });
    }
    return apiResponse.successResponseWithData(res,"added to waitlist",response);
};

exports.referlist = async (req,res) => {
    let {refcode,domain,email} = req.query;
    
    // check if refcode exists
    let is_valid_code = await User.findOne({unique_code:refcode},{email:true},(err,result)=>{
        if(err) return apiResponse.ErrorResponse(res,err.message);
        else result;
    });

    // check domain exists
    let is_domain_exists = await List.findOne({domain},(err,result)=>{
        if(err) return apiResponse.ErrorResponse(res,err.message);
        else result;
    });

    // check if email exists in users collection
    let is_user_exists = await User.findOne({email},(err,result)=>{
        if(err) return apiResponse.ErrorResponse(res,err.message);
        else result;
    });

    // check if email already in waiting list
    let is_email_exists = await List.findOne({domain,"users.email":email},(err,result)=>{
        if(err) return apiResponse.ErrorResponse(res,err.message);
        else result;
    });

    if(!is_valid_code) return apiResponse.ErrorResponse(res,"invalid referral code");
    if(!is_domain_exists) return apiResponse.ErrorResponse(res,"domain not exists");

    let position = {};
    if(is_valid_code){
       let getposition = await List.findOne({domain,"users.email":is_valid_code.email},{"users.$":true},(err,result)=>{
            if(err) return apiResponse.ErrorResponse(res,err.message);
            else result;
        });
        if(getposition) position = getposition.users[0].position;
    }
       
    let response = {};
    if(!is_user_exists && !is_email_exists){
        let unique_code = random.randomString(7);
        let adduser = new User({email,unique_code});
        await adduser.save((err,resut)=>{
            if(err) return apiResponse.ErrorResponse(res,err.message);
        });
        // add email to list
       await List.findOneAndUpdate({domain},{$addToSet :{users: {email}}},(err,result)=>{
            if(err) return apiResponse.ErrorResponse(res,err.message);
            else result;
        });

        // update referral position
        position = position > 1 ? position-1 : 1;
        let is_notified = false;
        if(position == 1) {
            is_notified = true;
            console.log("send mail");
        }
        let updatepos = await List.findOneAndUpdate(
            {domain,"users.email":is_valid_code.email},{$set:{"users.$.position":position,"users.$.mail_notify":is_notified}},(err,result)=>{
            if(err) return apiResponse.ErrorResponse(res,err.message);
            else result;
        });

        
        response = await List.findOne({domain,"users.email":email},{"users.$":true},(err,result)=>{
            if(err) return apiResponse.ErrorResponse(res,err.message);
            else result;
        });
    }else if(is_user_exists && !is_email_exists){

         // update referral position
         position = position > 1 ? position-1 : 1;
         let is_notified = false;
         if(position == 1) {
             is_notified = true;
             console.log("send mail");
         }
         let updatepos = await List.findOneAndUpdate(
             {domain,"users.email":is_valid_code.email},{$set:{"users.$.position":position,"users.$.mail_notify":is_notified}},(err,result)=>{
             if(err) return apiResponse.ErrorResponse(res,err.message);
             else result;
         });
 
         response = await List.findOne({domain,"users.email":email},{"users.$":true},(err,result)=>{
             if(err) return apiResponse.ErrorResponse(res,err.message);
             else result;
         });
    }
    else{
        response = await List.findOne({domain,"users.email":email},{"users.$":true},(err,result)=>{
            if(err) return apiResponse.ErrorResponse(res,err.message);
            else result;
        });
        return apiResponse.successResponseWithData(res,"already in waitlist",response);
    }

    return apiResponse.successResponseWithData(res,"added to wait list",response)
}