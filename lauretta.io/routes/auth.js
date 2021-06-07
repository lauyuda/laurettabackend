const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {loginValidation} = require('../validation');

const dotenv = require('dotenv');
dotenv.config();
var http = require('http');
var country_code;

http.get('http://api.ipstack.com/check?access_key=' + process.env.IP_API, function(resp){
    var body = ''
    resp.on('data', function(data){
        body += data;
    });

    resp.on('end', function(){
        var loc = JSON.parse(body);
        country_code = loc.country_code
    });
});

router.post('/login', async (req, res) => {
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const nameExist = await User.findOne({name: req.body.name});
    const nameCountry = await req.body.name.slice(0, 2).toUpperCase();
    if (nameCountry !== country_code) return res.status(400).send('Does not meet the 2 letter country code criteria.');
    if (!nameExist) return res.status(400).send('Username or password is wrong.');
    const validPass = await bcrypt.compare(req.body.password, nameExist.password);
    if (!validPass) return res.status(400).send('Username or password is wrong.');

    const token = jwt.sign({_id: nameExist._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
    // res.send('Logged in');
});

module.exports = router;