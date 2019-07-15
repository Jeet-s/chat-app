const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    messageId: {
        type: Number,
        required: [true, 'messageId is required']
    },
    message: {
        type: String,
        required: [true, 'message is required']
    },
    from: {
        type: String,
        required: [true, 'from is required']
    },
    to: {
        type: String,
        required: [true, 'to is required']
    },
    dateTime: {
        type: Number,
        required: [true, 'dateTime is required']
    }
});

const Message = mongoose.model('message', MessageSchema);

module.exports = Message;