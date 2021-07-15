const _console = require('consola');
const {validationResult} = require('express-validator');
const Competency = require('../models/Competency');
const model = 'Competency';

exports.addCompetency = async (req, res) => {
    _console.info(`Attempting to create ${model}`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e => e.msg)});
    }
    const {name, description, isKernel, areaOfConcern} = req.body;
    try {
        let competency = new Competency({name, description, isKernel, areaOfConcern});
        let response = await competency.save();
        return  res.json(response);
    } catch (e) {
        _console.error(e)
        res.status(400).json({errors: [`Problems creating the ${model}`]});
    }
}

exports.fetchAllCompetencies = async (req, res) => {
    _console.info(`Getting all ${model}`);
    try {
        let competencies = await Competency.find({});
        res.json({competencies});
    } catch (e) {
        _console.error(e);
        res.status(400).json({errors: [`Problems creating the ${model}`]});
    }
}

exports.updateCompetency = async (req, res) => {
    _console.info(`updating  ${model}`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e => e.msg)});
    }
    try {
        const {_id, name, description, areaOfConcern} = req.body;
        let competency = await Competency.findById(_id);
        if (competency !== null && competency !== undefined) {
            competency.name = name;
            competency.description = description;
            competency.areaOfConcern = areaOfConcern;
            competency.save();
            res.send(competency);
        }else {
            res.status(404).json({errors: [`${model} provided not found`]});
        }
    } catch (e) {
        _console.error(e);
        res.status(400).json({errors: [`Problems creating the ${model}`]});
    }
}