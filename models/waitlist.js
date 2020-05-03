const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const waitlistSchema = new Schema({
    list_name: String,
    description: String,
    domain: String,
    company: String,
    website_url:String,
    users:[{
        email:String,
        position:{type:String,default:99},
        mail_notify:{type:Boolean,default:false}
    }]
});

const List = mongoose.model('waitlist', waitlistSchema);
module.exports = {
    List
};