const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    password: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
        trim: true
    },
    created_at: Date,
    updated_at: Date,
    status: {
        type: String,
        default: "B",
        enum: ['A', 'B', 'T']
    },
    unique_code:String
});
const User = mongoose.model('user', userSchema);
module.exports = {
    User
};