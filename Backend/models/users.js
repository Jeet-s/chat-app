const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, 'user name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'user email is required'],
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is Invalid');
            }
        }
    },
    password: {
        type: String,
        required: [true, 'user password is required'],
        trim: true,
        minlength: 6
    },
}, {
    timestamps: true
});

userSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'from'
});

userSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'to'
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

//hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;