const _console = require('consola');
const {validationResult} = require('express-validator');
const WorkProduct = require('../models/WorkProduct');
const model = 'Work Product';

exports.addWorkProduct = async (req, res) => {
    _console.info(`Creating ${model}`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e => e.msg)});
    }
    const {name, description, owner} = req.body;
    await new WorkProduct({name, description, owner});


}