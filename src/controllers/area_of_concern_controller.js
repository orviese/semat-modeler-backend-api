const _console = require('consola');
const {validationResult} = require('express-validator');
const AreaOfConcern = require('../models/AreaOfConcern');

exports.addAreaOfConcern = async (req, res) => {
    _console.info('Attempting to create an area of concern!!');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e => e.msg)});
    }
    try {
        const {name, description, colorConvention} = req.body;
        _console.log(req.body)
        const areaOfConcernFound = await AreaOfConcern.findOne({name: name});
        _console.log(areaOfConcernFound)
        if (areaOfConcernFound) {
            return res.status(400)
                .json({errors: ['Choose another name for the area of concern']});
        }
        const newAreaOfConcern = new AreaOfConcern({name, description, colorConvention});
        const result = await newAreaOfConcern.save();
        _console.log(result)
        res.status(201).json({
            _id: result._id,
            name: result.name,
            description: result.description,
            colorConvention: result.colorConvention
        });
    } catch (e) {
        _console.error('Problems creating area of concern', e);
        res.status(400).json({errors: ['Problems creating the area of concern']});
    }
}

exports.updateAreaOfConcern = async (req, res) => {
    _console.info('Attempting to update an area of concern!!');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e => e.msg)});
    }
    try {
        const {_id, name, description, colorConvention} = req.body;
        const areaOfConcernFound = await AreaOfConcern.findById(_id,
            '_id name description colorConvention');
        if (areaOfConcernFound) {
            areaOfConcernFound.name = name;
            areaOfConcernFound.description = description;
            areaOfConcernFound.colorConvention = colorConvention;
            areaOfConcernFound.save();
            res.status(200).json({
                _id: areaOfConcernFound._id,
                name: areaOfConcernFound.name,
                description: areaOfConcernFound.description,
                colorConvention: areaOfConcernFound.colorConvention
            });
        } else {
            res.status(404).send();
        }
    } catch (e) {
        _console.error('Problems updating area of concern', e);
        res.status(400).json({errors: ['Problems updating the ara of concern']});
    }
}

exports.getAllAreaOfConcern = async (req, res) => {
    _console.info('Attempting to get all areas of concern!!');
    try {
        const areasOfConcern = await AreaOfConcern.find({},
            'id name description colorConvention')
            .where('deleted').or([{deleted: false},{deleted: null}]);
        res.status(200).json({areasOfConcern});
    }catch (e) {
        _console.error('Problems getting area of concern', e);
        res.status(400).json({errors: ['Problems getting areas of concern']});
    }
}

exports.getAreaOfConcern = async (req, res) => {
    _console.info('Attempting to get an area of concern!!');
    try {
        const areaOfConcern = await AreaOfConcern.findById(req.params.id,
            'id name description colorConvention');
        if (!areaOfConcern) {
           return res.status(404).send();
        }
        res.status(200).json(areaOfConcern);
    }catch (e) {
        _console.error('Problems getting area of concern', e);
        res.status(400).json({errors: ['Problems getting areas of concern']});
    }
}

exports.deleteAreaOfConcern = async (req, res) => {
    _console.info('Attempting to delete an area of concern!!');
    try {
        const areaOfConcern = await AreaOfConcern.findById(req.params.id);
        if (!areaOfConcern) {
            return res.status(404).send();
        }
        areaOfConcern.deleted = true;
        areaOfConcern.save();
        res.status(201).json({});
    }catch (e) {
        _console.error('Problems getting area of concern', e);
        res.status(400).json({errors: ['Problems getting areas of concern']});
    }
}