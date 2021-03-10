const _console = require('consola');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const {validationResult} = require('express-validator');


exports.signUp = async (req, res) => {
    _console.info('Attempting to create an account!!');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e=>e.msg)});
    }
    try {
        const {name, email, password} = req.body;
        const account = await Account.findOne({email: email});
        if (account) {
            return res.status(400)
                .json({errors: ['Account could not be created with information provided']});
        }
        const newAccount = new Account({name, email, password});
        const savedAccount = await newAccount.save();
        res.status(201).json({ id: savedAccount._id });
        _console.success('Account created!')
    } catch (e) {
        _console.error('Could not create account', e);
        res.status(400).json({errors: ['Problems creating your account']});
    }
};

exports.signIn = async (req, res) => {
    _console.info('Attempting to sign in!!');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e=>e.msg)});
    }
    const {email, password} = req.body;
    let account = await Account.findOne({email: email});
    if (account !== null){
        bcrypt.compare(password, account.password, (err,result) => {
            if(result === true){
                const token = jwt.sign({
                        id: account._id,
                        name: account.name,
                        email: account.email,
                        status: account.status
                    }, process.env.JWT_SECRET,
                    { expiresIn: '4h' });
                res.cookie('x-auth-token',`${token}`, {httpOnly: true, sameSite:"lax"});
                res.status(200).json({
                    id: account._id,
                    name: account.name,
                    email: account.email,
                    status: account.status,
                    token: token});
            }else {
                res.status(401).json({errors: ['Invalid account information!']});
            }
        });
    }else {
       res.status(401).json({errors: ['Invalid account information']});
    }
};

exports.updateAccount = async (req, res) => {
    _console.info('Attempting to update account!!');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e=>e.msg)});
    }
    const {id, name, email} = req.body;

    res.sendStatus(204);

};