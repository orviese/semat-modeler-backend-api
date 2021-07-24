const _console = require('consola');
const PracticeValidation = require('../models/PracticeValidationCriterion');
const PracticeValidationResult = require('../models/PracticeValidationResult');
const WorkProductManifest = require('../models/WorkProductManifest');
const mongoose = require("mongoose");
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

exports.fetchAllValidationCriteriaAggregated = async (req, res) => {
    console.log('Getting details for owner' + req.params.owner);
    PracticeValidation.aggregate()
        .match({owner: mongoose.Types.ObjectId(req.params.owner)})
        .unwind('$validations')
        .project('owner name expression validations.formulaResult')
        .group({
            _id: {
                criterion: '$_id', name: '$name', expression: '$expression'
            },
            average: {
                $avg: '$validations.formulaResult'
            }
        })
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
        .then(() => {
            res.send();
        }).catch(error => {
        _console.error(error)
        res.status(400).json({errors: ['Error adding criterion']});
    });
}

exports.deleteValidationsFromPractice = async (req, res) => {
    PracticeValidation.findByIdAndUpdate(req.params.criterion, {
        validations: []
    }, {new: true})
        .then(response => {
            res.send(response);
        }).catch(error => {
        _console.error(error)
        res.status(400).json({errors: ['Error removing validations from criterion']});
    });
}

exports.addPracticeValidationResult = (req, res) => {
    const {criteria} = req.body;
    let criteriaUpdated = [];
    criteria.forEach(criterion => {
        PracticeValidation.findByIdAndUpdate(criterion.criterionId, {
            $push: {
                'validations': {
                    variables: criterion.variables,
                    formulaResult: criterion.result
                }
            }
        }, {new: true}, (error, response) => {
            if (error) {
                _console.error(error)
                res.status(400).json({errors: ['Error adding validation']});
            }
            criteriaUpdated.push(response);
        });
    });
    res.status(200).send();
}

exports.createNewPublicPracticeValidation = async (req, res) => {
    const practice = req.params.practice;
    const {criteria} = req.body
    (await PracticeValidationResult.create({practice, criteria}))
        .populate([{
            path: 'practice',
            select: 'name'
        }])
        .then(response => {
            res.send(response);
        })
        .catch(error => {
            _console.error(error)
            res.status(400).json({errors: ['Error adding validation to practice']});
        })
}

exports.getAllPracticeValidationResults = async (req, res) => {
    const practice = req.params.practice;
    PracticeValidationResult.find({practice})
        .populate([{
            path: 'practice',
            select: 'name'
        }])
        .then(response => {
            res.json(response);
        })
        .catch(error => {
            _console.error(error)
            res.status(400).json({errors: ['Error getting all public practice validations']});
        });
}

exports.getPublicPracticeValidation = async (req, res) => {
    _console.info(`Getting validation for revision ${req.params.validationId}`)
    PracticeValidationResult.findById(req.params.validationId)
        .populate([
            {
                path: 'practice',
                populate: [
                    {path: 'ownedElements.workProducts'},
                    {path: 'ownedElements.alphas', populate: {path: 'areaOfConcern', skipInvalidIds: true}},
                    {path: 'ownedElements.activitySpaces', populate: {path: 'areaOfConcern', skipInvalidIds: true}},
                    {
                        path: 'ownedElements.activityAssociations',
                        populate: [
                            {
                                path: 'end1',
                                skipInvalidIds: true,
                                populate: {
                                    path: 'requiredCompetencyLevel',
                                    skipInvalidIds: true,
                                    populate: {
                                        path: 'areaOfConcern',
                                        select: 'name colorConvention'
                                    }
                                }
                            },
                            {
                                path: 'end2',
                                skipInvalidIds: true,
                                populate: {
                                    path: 'areaOfConcern',
                                    select: 'name colorConvention',
                                    skipInvalidIds: true
                                }
                            }
                        ]
                    },
                    {
                        path: 'ownedElements.patterns',
                        populate: [
                            {
                                path: 'areaOfConcern',
                                select: 'name colorConvention',
                                skipInvalidIds: true
                            },
                            {
                                path: 'workProductElements'
                            },
                            {
                                path: 'activitySpaceElement'
                            },
                            {
                                path: 'alphaElement'
                            }
                        ]
                    },
                    {
                        path: 'ownedElements.workProductManifests',
                        populate: [
                            {path: 'alpha', populate: {path: 'areaOfConcern'}},
                            {path: 'workProduct'}
                        ]
                    }
                ]
            }
        ])
        .then(response => {
            if (response !== null) {
                res.json(response)
            } else {
                res.status(400).json({errors: ['No information found for practice validation']});
            }

        })
        .catch(error => {
            _console.error(error)
            res.status(400).json({errors: ['Error getting public practice validation ' + error]});
        })
}

exports.closePublicPracticeValidation = async (req, res) => {
    const {personName, email, comment} = req.body;

    console.log(req.body.criteria);
    PracticeValidationResult.findByIdAndUpdate(req.params.validationId, {
        personName, responseDate: Date.now(),
        email, comment, finished: true, variables: req.body.variables
    }, {new: true})
        .populate([
            {
                path: 'practice',
                populate: [
                    {path: 'ownedElements.workProducts'},
                    {path: 'ownedElements.alphas', populate: {path: 'areaOfConcern', skipInvalidIds: true}},
                    {path: 'ownedElements.activitySpaces', populate: {path: 'areaOfConcern', skipInvalidIds: true}},
                    {
                        path: 'ownedElements.activityAssociations',
                        populate: [
                            {
                                path: 'end1',
                                skipInvalidIds: true,
                                populate: {
                                    path: 'requiredCompetencyLevel',
                                    skipInvalidIds: true,
                                    populate: {
                                        path: 'areaOfConcern',
                                        select: 'name colorConvention'
                                    }
                                }
                            },
                            {
                                path: 'end2',
                                skipInvalidIds: true,
                                populate: {
                                    path: 'areaOfConcern',
                                    select: 'name colorConvention',
                                    skipInvalidIds: true
                                }
                            }
                        ]
                    },
                    {
                        path: 'ownedElements.patterns',
                        populate: [
                            {
                                path: 'areaOfConcern',
                                select: 'name colorConvention',
                                skipInvalidIds: true
                            },
                            {
                                path: 'workProductElements'
                            },
                            {
                                path: 'activitySpaceElement'
                            },
                            {
                                path: 'alphaElement'
                            }
                        ]
                    },
                    {
                        path: 'ownedElements.workProductManifests',
                        populate: [
                            {path: 'alpha', populate: {path: 'areaOfConcern'}},
                            {path: 'workProduct'}
                        ]
                    }
                ]
            }
        ]).then(response => {
        if (response !== null) {
            res.json(response)
        } else {
            res.status(400).json({errors: ['No information found for practice validation']});
        }
    }).catch(error => {
        _console.error(error)
        res.status(400).json({errors: ['Error closing public practice validation ' + error]});
    })
}