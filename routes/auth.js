const router = require('express').Router();
const User = require('../model/User');

const { registerValidation } = require('../validation');



router.post('/register', (req, res) => {
    const {error} = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save()
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            res.status(400).send(err);
        })
});



module.exports = router;