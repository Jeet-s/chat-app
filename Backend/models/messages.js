const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    message: {
        type: String,
        required: [true, 'message is required']
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'from is required'],
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'to is required'],
        ref: 'User'
    }
}, {
    timestamps: true
});

const Message = mongoose.model('message', messageSchema);

module.exports = Message;