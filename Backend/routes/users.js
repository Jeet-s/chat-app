const express = require('express');
const router = express.Router();

const User = require('../models/users');
let index = require('../index');


router.post('/register', function(req, res){
    let obj = {};
    User.find({}).then((user) => {
        console.log(user)
        if (parseInt(Math.max.apply(Math, user.map((o) => o.userId))) + 1){
            obj.userId = parseInt(Math.max.apply(Math, user.map((o) => o.userId)) + 1);
        } else {
            obj.userId = 1;
        }
        
        obj = {...obj, ...req.body}
        User.create(obj).then(() => {
            res.send({message: 'user created successfully'});
        });
    });
});

router.post('/login', function(req, res){
    User.find({email: req.body.email, password: req.body.password}).then(function(user){
        if(user.length > 0){
            res.cookie("userData", user); 
            index.setConnectedUsers(user);
            res.send({message: 'login successful', data: user});
        } else{
            res.send({error: 'incorrect email or password'});
        }
        
    });
});


module.exports = router;