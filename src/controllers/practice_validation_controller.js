const _console = require('consola');
const PracticeValidation = require('../models/PracticeValidation');
const model = 'Practice Validation';

exports.fetchAllValidationCriteria = async (req, res) => {
    PracticeValidation.find({owner: req.params.owner})
        .then(response => {
            res.send(response);
        }).catch(error => {
        _console.error(error)
        res.status(400).json({errors: ['Error fetching all criteria']});
    });
}

exports.addPracticeValidationCriterion = async (req, res) => {
    _console.info(`Creating ${model}`);
    const {owner, name, description, expression, variables} = req.body;
    const variablesToSave = variables.map(element => {
        return {
            symbol: element.symbol,
            meaning: element.meaning
        }
    });
    PracticeValidation.create({owner, name, description, expression, variables: variablesToSave})
        .then(response => {
            res.send(response);
        }).catch(error => {
        _console.error(error)
        res.status(400).json({errors: ['Error adding criterion']});
    });
}

exports.deletePracticeValidationCriterion = async (req, res) => {
    PracticeValidation.findByIdAndDelete(req.params.id)
        .then(()=>{
            res.send();
        }).catch(error => {
        _console.error(error)
        res.status(400).json({errors: ['Error adding criterion']});
    });
}