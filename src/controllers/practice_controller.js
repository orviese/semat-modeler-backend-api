const _console = require('consola');
const WorkProduct = require('../models/WorkProduct');
const WorkProductManifest = require('../models/WorkProductManifest');
const Practice = require('../models/Practice');
const Activity = require('../models/Activity');
const Pattern = require('../models/Pattern');
const ActivityAssociation = require('../models/ActivityAssociation');
const mongoose = require("mongoose");

exports.addPractice = async (req, res) => {
    _console.info('Attempting to create a practice!');
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
            }, {new: true})
            .populate([
                {path: 'ownedElements.workProducts'},
                {path: 'ownedElements.alphas', populate: {path: 'areaOfConcern', skipInvalidIds: true}},
                {path: 'ownedElements.activitySpaces', populate: {path: 'areaOfConcern', skipInvalidIds: true}},
                {
                    path: 'ownedElements.activityAssociations',
                    populate: [
                        {
                            path: 'end1',
                            skipInvalidIds: true,
                            populate: {path: 'requiredCompetencyLevel', skipInvalidIds: true}
                        },
                        {path: 'end2', skipInvalidIds: true, populate: {path: 'areaOfConcern', skipInvalidIds: true}}
                    ]
                }
            ]);
        res.status(200).json(practice);
    } catch (e) {
        _console.error('Error editing practice', e);
        res.status(400).json({errors: ['no changes']});
    }
};

exports.getAllPractices = async (req, res) => {
    _console.info('Attempting to get all practices!!');
    try {
        const practices = await Practice.find({})
            .populate([
                {path: 'ownedElements.workProducts'},
                {path: 'ownedElements.alphas', populate: {path: 'areaOfConcern', skipInvalidIds: true}},
                {path: 'ownedElements.activitySpaces', populate: {path: 'areaOfConcern', skipInvalidIds: true}},
                {
                    path: 'ownedElements.activityAssociations',
                    populate: [
                        {
                            path: 'end1',
                            skipInvalidIds: true,
                            populate: {path: 'requiredCompetencyLevel', skipInvalidIds: true}
                        },
                        {path: 'end2', skipInvalidIds: true, populate: {path: 'areaOfConcern', skipInvalidIds: true}}
                    ]
                }
            ]);
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
    _console.info(`Alpha to add into practice , ${req.params.alpha} , practice  ${req.params.practice}`);
    Practice.findOne({
        _id: mongoose.Types.ObjectId(req.params.practice),
        'ownedElements.alphas': req.params.alpha
    }).then(response => {
        if (response === null) {
            Practice.findByIdAndUpdate(req.params.practice,
                {$push: {'ownedElements.alphas': req.params.alpha}}, {new: true})
                .populate([
                    {
                        path: 'ownedElements.alphas',
                        populate: {path: 'areaOfConcern', skipInvalidIds: true}
                    }
                ])
                .then(response => {
                    res.send({alphas: response.ownedElements.alphas.sort()});
                })
                .catch(error => {
                    res.status(400).send({message: 'error after saving alpha item ' + error})
                });
        } else {
            res.status(400).send({message: 'Alpha already exist for the practice ' + req.params.alpha})
        }
    }).catch(error => {
        res.status(400).send({message: 'error while saving alpha to practice ' + error})
    });
}

exports.removeOwnedAlpha = async (req, res) => {
    _console.info("Alpha to remove from practice ", req.params.alpha)
    Practice.findByIdAndUpdate(req.params.practice, {
        $pull: {'ownedElements.alphas': req.params.alpha}
    }, {new: true}).populate([
        {
            path: 'ownedElements.alphas',
            skipInvalidIds: true,
            populate: {path: 'areaOfConcern', skipInvalidIds: true}
        },

    ])
        .then(response => {
            if (response !== null) {
                res.send({
                    alphas: response.ownedElements.alphas
                });
            } else {
                res.status(404).json({errors: [`Practice not found ${req.params.practice}`]})
            }
        }).catch(error => {
        _console.error(error)
        res.status(400).json({errors: ['Error removing practice alpha']});
    })
}

exports.addWorkProduct = async (req, res) => {
    _console.info(`Creating work product for practice`);
    const {name, description} = req.body;
    WorkProduct.create({name, description, owner: req.params.id})
        .then(wp => {
            return Practice.findByIdAndUpdate(req.params.id, {
                $push: {"ownedElements.workProducts": wp._id}
            }, {new: true})

        })
        .then(practice => {
            if (practice !== null) {
                practice.populate([
                    {path: 'ownedElements.workProducts'},
                    {path: 'ownedElements.alphas', populate: {path: 'areaOfConcern', skipInvalidIds: true}},
                    {path: 'ownedElements.activitySpaces', populate: {path: 'areaOfConcern', skipInvalidIds: true}},
                    {
                        path: 'ownedElements.activityAssociations',
                        populate: [
                            {
                                path: 'end1',
                                skipInvalidIds: true,
                                populate: {path: 'requiredCompetencyLevel', skipInvalidIds: true}
                            },
                            {
                                path: 'end2',
                                skipInvalidIds: true,
                                populate: {path: 'areaOfConcern', skipInvalidIds: true}
                            }
                        ]
                    }

                ], (error, doc) => {
                    if (error) {
                        res.status(400).json({errors: [`Problems updating practice work product ${error}`]});
                    }
                    res.json(doc);
                });

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

exports.addWorkProductManifest = async (req, res) => {
    _console.info(`Creating work product manifest for practice`);
    const owner = req.params.practice;
    const {lowerBound, upperBound, alpha, workProduct} = req.body;
    WorkProductManifest.create({
        owner, lowerBound, upperBound, alpha, workProduct
    }).then(response => {
        response.populate([{path: 'alpha', populate: {path: 'areaOfConcern'}}, {path: 'workProduct'}],
            (error, doc) => {
                if (error) {
                    res.status(400).json({errors: [`Problems updating practice work product ${error}`]});
                }
                Practice.findByIdAndUpdate(owner, {
                    $push: {'ownedElements.workProductManifests': response._id}
                }, {new: true})
                    .then(() => {
                        res.json(response);
                    }).catch(error => {
                    res.status(400).json({errors: [`Problems updating practice work product manifest${error}`]});
                })
            });
    }).catch(error => {
        res.status(400).json({errors: [`Problems updating practice work product ${error}`]});
    })
}
exports.getAllWorkProductManifest = async (req, res) => {
    _console.info(`Getting all work product manifest for practice`);
    WorkProductManifest.find({owner: req.params.practice})
        .populate([{path: 'alpha', populate: {path: 'areaOfConcern'}}, {path: 'workProduct'}])
        .then(response => {
            res.json({workProductManifest: response});
        }).catch(error => {
        res.status(400).json({errors: [`Problems updating practice work product ${error}`]});
    });
}

exports.deleteWorkProductManifest = async (req, res) => {
    _console.info(`deleting work product manifest from practice`);
    WorkProductManifest.findOneAndDelete({
        _id: mongoose.Types.ObjectId(req.params.id),
        owner: req.params.practice
    }).then(() => {
        WorkProductManifest.find({owner: req.params.practice})
            .populate([{path: 'alpha', populate: {path: 'areaOfConcern'}}, {path: 'workProduct'}])
            .then(response => {
                Practice.findByIdAndUpdate(req.params.practice, {
                    $pull: {'ownedElements.workProductManifests': req.params.id}
                })
                    .then(() => {
                        res.json({workProductManifests: response});
                    })
                    .catch(error => {
                        res.status(400).json({errors: [`Problems removing work product manifest ${error}`]});
                })
            }).catch(error => {
            res.status(400).json({errors: [`Problems getting practice work product ${error}`]});
        });
    }).catch(error => {
        res.status(400).json({errors: [`Problems deleting practice work product ${error}`]});
    });
}

exports.addOwnedActivitySpace = async (req, res) => {
    _console.info(`Activity Space to add into practice ,
     ${req.params.activitySpace} , practice  ${req.params.practice}`);
    Practice.findOne({
        _id: mongoose.Types.ObjectId(req.params.practice),
        'ownedElements.activitySpaces': req.params.activitySpace
    }).then(response => {
        if (response === null) {
            Practice.findByIdAndUpdate(req.params.practice,
                {$push: {'ownedElements.activitySpaces': req.params.activitySpace}}, {new: true})
                .populate([
                    {path: 'ownedElements.activitySpaces', populate: {path: 'areaOfConcern', skipInvalidIds: true}}
                ])
                .then(response => {
                    res.send({activitySpaces: response.ownedElements.activitySpaces});
                })
                .catch(error => {
                    res.status(400).send({message: 'error after saving activity space item ' + error})
                });
        } else {
            res.status(400).send({message: 'Activity Space already exist for the practice ' + req.params.alpha})
        }
    }).catch(error => {
        res.status(400).send({message: 'error while saving activity space to practice ' + error})
    });
}

exports.removeOwnedActivitySpace = async (req, res) => {
    _console.info('Attempting to remove owned activity space for practice ' + req.params.practice);
    Practice.findByIdAndUpdate(req.params.practice, {
        $pull: {'ownedElements.activitySpaces': req.params.activitySpace},
    }, {new: true})
        .populate([
            {path: 'ownedElements.activitySpaces', populate: {path: 'areaOfConcern', skipInvalidIds: true}}
        ])
        .then(response => {
            res.send({activitySpaces: response.ownedElements.activitySpaces});
        })
        .catch(error => {
            res.status(400).send({message: 'error after removing activity space item ' + error})
        });
}

exports.addActivityToPractice = async (req, res) => {
    _console.info('Attempting to create an activity for practice ' + req.params.practice);
    const {activitySpace, competencies, name} = req.body;
    try {
        const activity = await Activity.create({
            name,
            requiredCompetencyLevel: competencies,
            owner: req.params.practice
        });
        const activityAssociation = await ActivityAssociation.create({
            end1: activity._id,
            end2: activitySpace,
            owner: req.params.practice
        });
        const practice = await Practice.findByIdAndUpdate(req.params.practice, {
            $push: {
                'ownedElements.activities': activity._id,
                'ownedElements.activityAssociations': activityAssociation._id
            }
        }, {new: true})
            .populate([
                {path: 'ownedElements.workProducts'},
                {path: 'ownedElements.alphas', populate: {path: 'areaOfConcern', skipInvalidIds: true}},
                {path: 'ownedElements.activitySpaces', populate: {path: 'areaOfConcern', skipInvalidIds: true}},
                {
                    path: 'ownedElements.activityAssociations',
                    populate: [
                        {
                            path: 'end1',
                            skipInvalidIds: true,
                            populate: {path: 'requiredCompetencyLevel', skipInvalidIds: true}
                        },
                        {path: 'end2', skipInvalidIds: true, populate: {path: 'areaOfConcern', skipInvalidIds: true}}
                    ]
                }
            ]);
        res.json(practice);
    } catch (e) {
        res.status(400).send({message: 'error while saving activity to practice ' + e})
    }
}

exports.removeOwnedActivity = async (req, res) => {
    _console.info("Activity to remove from practice ", req.params.activity)
    const {activityAssociation} = req.body;
    try {

        await ActivityAssociation.findByIdAndDelete(req.params.activityAssociation);
        await Activity.findByIdAndDelete(req.params.activity);

        Practice.findByIdAndUpdate(req.params.practice, {
            $pull: {
                'ownedElements.activities': req.params.activity,
                'ownedElements.activityAssociations': activityAssociation
            },
        }, {new: true}).populate([
            {
                path: 'ownedElements.activityAssociations',
                populate: [
                    {
                        path: 'end1',
                        skipInvalidIds: true,
                        populate: {path: 'requiredCompetencyLevel', skipInvalidIds: true}
                    },
                    {path: 'end2', skipInvalidIds: true, populate: {path: 'areaOfConcern', skipInvalidIds: true}}
                ]
            }

        ])
            .then(response => {
                if (response !== null) {
                    res.send({
                        activities: response.ownedElements.activities,
                        activityAssociations: response.ownedElements.activityAssociations
                    });
                } else {
                    res.status(404).json({errors: [`Practice not found ${req.params.practice}`]})
                }
            }).catch(error => {
            _console.error(error)
            res.status(400).json({errors: ['Error removing practice activity']});
        });
    } catch (e) {
        res.status(400).send({message: 'error while removing activity to practice ' + e})
    }
}

exports.addPracticeActivitySpacePattern = async (req, res) => {
    _console.info("Activity Space pattern to practice ", req.params.practice)
    const {activitySpace, areaOfConcern, associationName, name, practice} = req.body;
    Pattern.create({
        owner: practice,
        name,
        target: 'activitySpace',
        areaOfConcern,
        associationName,
        activitySpaceElement: activitySpace
    })
        .then(response => {
            Practice.findByIdAndUpdate(practice, {
                $push: {'ownedElements.patterns': response._id}
            }).then(() => {
                response.populate([
                    {path: 'activitySpaceElement'},
                    {path: 'areaOfConcern'}
                ], (error, document) => {
                    if (error) {
                        res.status(400).json({errors: [`Problems creating activitySpace pattern ${error}`]});
                    }
                    res.json(document);
                });
            })
                .catch(error => {
                    _console.error(error)
                    res.status(400).json({errors: ['Error adding owned pattern to practice']});
                })
        })
        .catch(error => {
            _console.error(error)
            res.status(400).json({errors: ['Error adding activity space pattern']});
        });
}

exports.addPracticeAlphaPattern = async (req, res) => {
    _console.info("Alpha pattern to practice ", req.params.practice)
    const {alpha, areaOfConcern, associationName, name, practice} = req.body;
    Pattern.create({
        owner: practice,
        name,
        target: 'alpha',
        areaOfConcern,
        associationName,
        alphaElement: alpha
    })
        .then(response => {
            Practice.findByIdAndUpdate(practice, {
                $push: {'ownedElements.patterns': response._id}
            }).then(() => {
                response.populate([
                    {path: 'alphaElement'},
                    {path: 'areaOfConcern'}
                ], (error, document) => {
                    if (error) {
                        res.status(400).json({errors: [`Problems creating alpha pattern ${error}`]});
                    }
                    res.json(document);
                });
            }).catch(error => {
                _console.error(error)
                res.status(400).json({errors: ['Error adding owned pattern to practice']});
            })
        })
        .catch(error => {
            _console.error(error)
            res.status(400).json({errors: ['Error adding alpha pattern']});
        });
}

exports.addPracticeWorkProductPattern = async (req, res) => {
    _console.info("Work product pattern to practice ", req.params.practice)
    const {workProducts, areaOfConcern, associationName, name, practice} = req.body;
    Pattern.create({
        owner: practice,
        name,
        target: 'workProduct',
        areaOfConcern,
        associationName,
        workProductElements: workProducts
    })
        .then(response => {
            Practice.findByIdAndUpdate(practice, {
                $push: {'ownedElements.patterns': response._id}
            }).then(() => {
                response.populate([
                    {path: 'workProductElements'},
                    {path: 'areaOfConcern'}
                ], (error, document) => {
                    if (error) {
                        res.status(400).json({errors: [`Problems creating work product pattern ${error}`]});
                    }
                    res.json(document);
                });
            }).catch(error => {
                _console.error(error)
                res.status(400).json({errors: ['Error adding owned pattern to practice']});
            });
        })
        .catch(error => {
            _console.error(error)
            res.status(400).json({errors: ['Error adding work product pattern']});
        });
}

exports.getAllPracticePatterns = async (req, res) => {
    Pattern.find({owner: req.params.practice}).populate(
        [
            {path: 'activitySpaceElement'},
            {path: 'areaOfConcern'},
            {path: 'alphaElement'},
            {path: 'workProductElements'}
        ]
    ).then(response => {
        res.send(response);
    }).catch(error => {
        _console.error(error)
        res.status(400).json({errors: ['Error fetching all patters']});
    });
}

exports.deletePracticePattern = async (req, res) => {
    _console.info("Removing pattern practice with id", req.params.id)
    Pattern.findByIdAndRemove(req.params.id)
        .then((response) => {
            if (response !== null) {
                Practice.findByIdAndUpdate(response.owner, {
                    $pull: {'ownedElements.patterns': response._id}
                }).then(()=>{
                    res.json({
                        removed: response
                    });
                }).catch((error)=>{
                    res.status(400).json({errors: [`Error deleting owner pattern from practice ${error}`]});
                });
            }else {
                res.json({
                    removed: {}
                });
            }
        }).catch(error => {
        _console.error(error)
        res.status(400).json({errors: ['Error deleting patters']});
    });
}