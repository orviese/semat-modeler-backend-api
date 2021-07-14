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
        return res.status(400).json({errors: errors.array().map(e=>e.msg)});
    }
    const {_id, name, objective, tags, resources, properties, measures, entry, result} = req.body;
    try {
        let practice = await Practice.findById(_id);
        if (practice !== null) {
            practice.name = name;
            practice.objective = objective;
            practice.tags = tags;
            practice.resources = resources;
            practice.properties = properties;
            practice.measures = measures;
            practice.entry = entry;
            practice.result = result;
            practice.save();
            res.status(200).json(practice);
            /*
            res.status(200).json({
             _id: practice._id,
                name: practice.name,
                objective: practice.objective,
                tags: practice.tags,
                resources: practice.resources,
                properties: practice.properties,
                measures: practice.measures,
                entry: practice.entry,
                result: practice.result
                practice
            });*/
            _console.info('Practice updated!', practice)
        } else {
            res.status(404).json({errors: ['no practice found']});
        }

    } catch (e) {
        _console.error('Error editing practice', e);
        res.status(400).json({errors: ['no changes']});
    }
};

exports.getAllPractices = async (req, res) => {
    _console.info('Attempting to get all practices!!');
    try {
        const practices = await Practice.find({});
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
        _console.info("Alpha to add into practice ",req.body.alpha)
        const result = await Practice.findById(req.body.practiceId);
        if (null !== result) {
            result.ownedElements.alphas.push(req.body.alpha);
            result.save(function (err) {
                console.log('error after saving alpha practice >> ' + err);
                if (err !== null){
                    res.status(400).send({message:'error after saving alpha item'})
                }else{
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
        _console.info("Alpha to remove from practice ",req.params.alpha)
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
    }catch (e) {
        res.status(400).json({errors: ['Error removing practice alpha']});
    }
}