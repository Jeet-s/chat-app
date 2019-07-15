const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userId: {
        type: Number,
        required: [true, 'user id is required']
    },
    userName: {
        type: String,
        required: [true, 'user name is required']
    },
    email: {
        type: String,
        required: [true, 'user email is required']
    },
    password: {
        type: String,
        required: [true, 'user password is required']
    },
});

const User = mongoose.model('user', UserSchema);

module.exports = User;