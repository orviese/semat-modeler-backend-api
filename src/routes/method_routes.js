const express = require('express');
const router = express.Router();
const methodControl = require('../controllers/method_controller');
const auth = require('../middlewares/auth');
const {body, check} = require("express-validator");

router.post('/method',
    [
        auth,
        body('name', 'A name is necessary to identify you')
            .not().isEmpty(),
        body('email', 'Email is required for your account')
            .isEmail(),
        body('password', 'Password required to secure your account')
            .trim().isLength({min: 6})
    ], methodControl.addMethod);


router.patch('/', [
        auth,
        body('id', 'Invalid id').not().isEmpty(),
        body('name', 'Name is necessary to identify you').not().isEmpty(),
        body('email', 'Email is required for your account').isEmail()
    ],
    methodControl.updateMethod);

module.exports = router;