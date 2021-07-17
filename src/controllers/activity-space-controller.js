const _console = require('consola');
const {validationResult} = require('express-validator');
const ActivitySpace = require('../models/ActiviySpace');
const model = 'Activity Space'

exports.addActivitySpace = async (req, res) => {
    _console.info(`Attempting to create a/an ${model}`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e => e.msg)});
    }
    const {name, description, isKernel, areaOfConcern} = req.body;
    try {
        let activitySpace = new ActivitySpace({name, description, isKernel, areaOfConcern});
        let response = await activitySpace.save();
        return  res.send({response});
    } catch (e) {
        _console.error(e)
        res.status(400).json({errors: [`Problems creating the ${model}`]});
    }
}

exports.fetchAllActivitySpaces = async (req, res) => {
    _console.info(`Getting all ${model}`);
    try {
        let activitySpaces = await ActivitySpace.find({});
        res.json({activitySpaces});
    } catch (e) {
        _console.error(e);
        res.status(400).json({errors: [`Problems creating the ${model}`]});
    }
}

exports.fetchAllActivitySpacesWithAreas = async (req, res) => {
    _console.info(`Getting all ${model}`);
    try {
        let activitySpaces = await ActivitySpace.find({})
            .populate('areaOfConcern');
        res.json({activitySpaces});
    } catch (e) {
        _console.error(e);
        res.status(400).json({errors: [`Problems creating the ${model}`]});
    }
}

exports.updateActivitySpace = async (req, res) => {
    _console.info(`updating  ${model}`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e => e.msg)});
    }
    try {
        const {_id, name, description, areaOfConcern} = req.body;
        let activitySpace = await ActivitySpace.findById(_id);
        if (activitySpace !== null) {
            activitySpace.name = name;
            activitySpace.description = description;
            activitySpace.areaOfConcern = areaOfConcern;
            activitySpace.save();
            res.send(activitySpace);
        }else {
            res.status(404).json({errors: [`${model} provided not found`]});
        }
    } catch (e) {
        _console.error(e);
        res.status(400).json({errors: [`Problems creating the ${model}`]});
    }
}