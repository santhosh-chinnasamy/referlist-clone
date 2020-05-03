const mongoose = require('mongoose');
const Scheme = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
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
    }
});
const User = mongoose.model('user', userSchema);
module.exports = {
    User
};