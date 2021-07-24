const _console = require('consola');
const {validationResult} = require('express-validator');
const Method = require('../models/Method');

exports.addMethod = async (req, res) => {
    _console.info('Attempting to newPracticeValidationCriterion a method!');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e=>e.msg)});
    }
    try {
        const {} = req.body;

        const method = new Method({});
        const savedMethod = await method.save();
        res.status(201).json(savedMethod);
        _console.success('Method created!')
    } catch (e) {
        _console.error('Could not newPracticeValidationCriterion method', e);
        res.status(400).json({errors: ['Problems creating your method']});
    }
}