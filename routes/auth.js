const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



const { registerValidation, loginValidation } = require('../validation');

router.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    // Validate the data
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    // checking if the user is already in the database 
    User.findOne({ email: req.body.email })
        .then(validatedEmail => {
            if (validatedEmail) {
                return res.status(400).send('Email already exists')
            }
            return bcrypt
                .hash(password, 10)
                .then(hashedPassword => {
                    const user = new User({
                        name: name,
                        email: email,
                        password: hashedPassword
                    });
                    return user.save();
                })
                .then(user => {
                    res.send({ user: user._id });
                })
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// Login
router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    // Validate the data
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    // Checking if the email exists
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(400).send('Email or password is wrong');
            }
            // Password is correct
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (!doMatch) {
                        return res.status(400).send('Invalid password');
                    }
                    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
                    res.header('auth-token', token).send(token);
                })
                .catch(err => {
                    console.log(err, 'Error message from nixon');
                })
        })
})






module.exports = router;



