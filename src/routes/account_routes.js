const express = require('express');
const router = express.Router();
const accountControl = require('../controllers/account_controller');
const auth = require('../middlewares/auth');
const {body, check} = require("express-validator");

router.post('/signup',
    [
        body('name', 'A name is necessary to identify you')
            .not().isEmpty(),
        body('email', 'Email is required for your account')
            .isEmail(),
        body('password', 'Password required to secure your account')
            .trim().isLength({min: 6})
    ], accountControl.signUp);

router.post('/signin',
    [
        body('email', 'Provide more info to identify you.').isEmail(),
        body('password', 'Come on! provide your account password.')
    ],
    accountControl.signIn);

router.post('/signout', accountControl.signOut);

router.patch('/', [
        auth,
        body('id', 'Invalid id').not().isEmpty(),
        body('name', 'Name is necessary to identify you').not().isEmpty(),
        body('email', 'Email is required for your account').isEmail()
    ],
    accountControl.updateAccount);

module.exports = router;
