const _console = require('consola');
const {validationResult} = require('express-validator');
const Alpha = require('../models/Alpha');
const model = 'Alpha'

exports.addAlpha = async (req, res) => {
    _console.info(`Attempting to create ${model}!!`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e => e.msg)});
    }
    try {
        const {name, description, briefDescription, isKernel, areaOfConcern, owner, superAlpha} = req.body;
        _console.log(req.body)
        const alphaFound = await Alpha.findOne({name: name});
        _console.log(alphaFound);
        if (alphaFound) {
            return res.status(400)
                .json({errors: [`Choose another name for the ${model}`]});
        }
        const newAlpha = new Alpha({
            name, description, briefDescription, isKernel, areaOfConcern, owner, superAlpha
        });
        const result = await newAlpha.save();
        _console.log(result)
        res.status(201).json(result);
    } catch (e) {
        _console.error(`Problems creating ${model}`, e);
        res.status(400).json({errors: [`Problems creating the ${model}`]});
    }
}

exports.updateAlpha = async (req, res) => {
    _console.info(`Attempting to update ${model}!!`);
    try {
        let alphaFound = await Alpha.findById(req.body._id);
        if (null !== alphaFound) {
            const { name, description, briefDescription, isKernel, areaOfConcern, owner, superAlpha } = req.body;
            alphaFound.name = name;
            alphaFound.description = description;
            alphaFound.briefDescription = briefDescription;
            alphaFound.isKernel = isKernel;
            alphaFound.areaOfConcern = areaOfConcern;
            alphaFound.superAlpha = superAlpha;
            alphaFound.owner = owner;
            let result = await alphaFound.save(req.body);
            res.status(200).json(result);
        }
    }catch (e) {
        res.status(400).json({errors: ['Problems updating alpha']});
    }
}

exports.fetchAllAlphas = async (req, res) => {
    _console.info(`Attempting to get all ${model}!!`);
    try {
        const alphas = await Alpha.find({},
            'id isKernel name briefDescription description owner areaOfConcern superAlpha');
        res.status(200).json({alphas});
    }catch (e) {
        res.status(404).json({errors: ['Problems getting alphas']});
    }
}

exports.fetchKernelAndPracticeAlphas = async (req, res) => {
    const id = req.params.id;
    try {
        const alphas = await  Alpha.find({$or: [{isKernel:true}, {owner:id}]});
        console.log(alphas);
        res.status(200).json({alphas});
    } catch (e) {
        res.status(400).json({errors: ['Problems getting alphas']});
    }
}

/*
exports.updateAlpha = async (req, res) => {
    _console.info('Attempting to update an area of concern!!');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        _console.warn('Validation problems!!')
        return res.status(400).json({errors: errors.array().map(e => e.msg)});
    }
    try {
        const {id, name, description, colorConvention} = req.body;
        const areaOfConcernFound = await AreaOfConcern.findById(id,
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

exports.getAllAlpha = async (req, res) => {
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

exports.getAlpha = async (req, res) => {
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

exports.deleteAlpha = async (req, res) => {
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
}*/