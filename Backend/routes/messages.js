const express = require('express');
const router = express.Router();

const Message = require('../models/messages');


router.post('/message', function(req, res){
    let obj = {};
    Message.find({}).then((msg) => {
        console.log(msg)
        if (parseInt(Math.max.apply(Math, msg.map((o) => o.messageId))) + 1){
            obj.messageId = parseInt(Math.max.apply(Math, msg.map((o) => o.messageId)) + 1);
        } else {
            obj.messageId = 1;
        }
        
        obj = {...obj, ...req.body}
        Message.create(obj).then(() => {
            res.send({message: 'message saved successfully'});
        });
    });
});email

router.get('/messages', function(req, res){
    Message.find({from: req.body.from, to: req.body.to}).then(function(msg){
        res.send(msg);
    });
});


module.exports = router;