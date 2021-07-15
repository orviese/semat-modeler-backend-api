const _console = require('consola');
const {validationResult} = require('express-validator');
const WorkProduct = require('../models/WorkProduct');
const Practice = require('../models/Practice');

exports.addPractice = async (req, res) => {
    _console.info('Attempting to create a practice!');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e => e.msg)});
    }
    try {
        const {name, objective, tags, resources, properties, measures, entry, result} = req.body;
        const practice = new Practice({name, objective, tags, resources, properties, measures, entry, result});
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
        return res.status(400).json({errors: errors.array().map(e => e.msg)});
    }
    const {_id, name, objective, tags, resources, properties, measures, entry, result} = req.body;
    try {
        let practice = await Practice.findByIdAndUpdate(_id,
            {
                name,
                objective,
                tags,
                resources,
                properties,
                measures,
                entry,
                result
            }, {new: true});
        res.status(200).json(practice);
    } catch (e) {
        _console.error('Error editing practice', e);
        res.status(400).json({errors: ['no changes']});
    }
};

exports.getAllPractices = async (req, res) => {
    _console.info('Attempting to get all practices!!');
    try {
        const practices = await Practice.find({}).populate('ownedElements.workProducts');
        if (practices !== null) {
            res.status(200).json({practices: practices});
        } else {
            res.status(400).json({errors: ['problems  getting all data']});
        }
    } catch (e) {
        _console.error('Error getting practice', e);
        res.status(400).json({errors: ['Error getting all data']});
    }
};

exports.addOwnedAlpha = async (req, res) => {
    try {
        _console.info("Alpha to add into practice ", req.body.alpha)
        const result = await Practice.findById(req.body.practiceId);
        if (null !== result) {
            result.ownedElements.alphas.push(req.body.alpha);
            result.save(function (err) {
                if (err !== null) {
                    res.status(400).send({message: 'error after saving alpha item'})
                } else {
                    res.send({
                        alphas: result.ownedElements.alphas
                    });
                }
            })
        }
    } catch (e) {
        console.error(e)
        res.status(400).json({errors: ['Error adding practice alpha']});
    }
}

exports.removeOwnedAlpha = async (req, res) => {
    try {
        _console.info("Alpha to remove from practice ", req.params.alpha)
        let practice = await Practice.findById(req.params.practice);
        if (practice !== null) {
            practice.ownedElements.alphas.id(req.params.alpha).remove();
            practice.save();
            res.send({
                alphas: practice.ownedElements.alphas
            });
        } else {
            res.status(404).json({errors: [`Practice not found ${req.params.practice}`]})
        }
    } catch (e) {
        res.status(400).json({errors: ['Error removing practice alpha']});
    }
}

exports.addWorkProduct = async (req, res) => {
    _console.info(`Creating work product for practice`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e => e.msg)});
    }
    const {name, description} = req.body;
    WorkProduct.create({name, description, owner: req.params.id})
        .then(wp => {
            return Practice.findByIdAndUpdate(req.params.id, {
                $push: {"ownedElements.workProducts": wp._id}
            }, {new: true}).populate('ownedElements.workProducts');
        })
        .then(practice => {
            if (practice !== null) {
                res.json(practice);
            } else {
                res.status(404).json({errors: [`Practice not found ${req.params.id}`]});
            }
        })
        .catch(err => {
            console.error(err);
            res.status(400).json({errors: ['Problems creating practice work product']});
        })
}

exports.updateWorkProduct = async (req, res) => {
    _console.info(`updating work product for practice`);
    const {_id, name, description} = req.body;
    WorkProduct.findByIdAndUpdate(_id, {name, description}, {new: true})
        .then(response => {
            if (response !== null) {
                res.status(201).send(response);
            } else {
                res.status(404).json({errors: [`Work Product not found ${_id}`]});
            }
        })
        .catch(error => {
            res.status(400).json({errors: [`Problems updating practice work product ${error}`]});
        });
}