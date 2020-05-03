const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const waitlistSchema = new Schema({
    list_name: String,
    description: String,
    domain: { type:String, unique:true},
    company: { type:String },
    website_url:String,
    created_by:String,
    users:[{
        email:String,
        position:{ type:Number,default:99},
        mail_notify:{ type:Boolean,default:false}
    }]
});

const List = mongoose.model('waitlist', waitlistSchema);
module.exports = {
    List
};