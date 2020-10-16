const express = require('express');
const router = express.Router();

const User = require('../models/users');
let index = require('../src/index');


router.post('/register', async function(req, res){
    console.log('efdds');
    const user = new User(req.body);
console.log('efdds');
    try {
        await user.save();
        res.send(user);
    } catch(e) {
        res.status(400).send(error);
    }
});

router.post('/login', async function(req, res){
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        index.setConnectedUsers(user);
        res.send(user);
    } catch (e) {
        res.status(400).send({error: 'incorrect email or password'});
    }
});

module.exports = router;