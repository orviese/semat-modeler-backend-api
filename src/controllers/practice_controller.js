
const _console = require('consola');
const {validationResult} = require('express-validator');
const Practice = require('../models/Practice');

exports.addPractice = async (req, res) => {
    _console.info('Attempting to create a practice!');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e=>e.msg)});
    }
    try {
        const {name, objective} = req.body;
        const practice = new Practice({name, objective});
        const savedPractice = await practice.save();
        res.status(201).json(savedPractice);
        _console.success('Practice created!')
    } catch (e) {
        _console.error('Could not create Practice', e);
        res.status(400).json({errors: ['Problems creating your Practice']});
    }
};

exports.updatePractice = async (req, res) => {
    _console.info('Attempting to update practice!!');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e=>e.msg)});
    }
    const {id, name, objective} = req.body;
    try {
        let practice = await Practice.findById(id);
        if (practice !== null) {
            practice.name = name;
            practice.objective = objective;
            practice.save();
            res.status(200).json({
                _id: practice._id,
                name: practice.name,
                objective: practice.objective
            });
            _console.info('Practice updated!')
        } else {
            res.status(404).json({errors: ['no practice found']});
        }

    } catch (e) {
        _console.error('Error editing practice', e);
        res.status(400).json({errors: ['no changes']});
    }
};