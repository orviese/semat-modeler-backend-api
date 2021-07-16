const _console = require('consola');
const WorkProduct = require('../models/WorkProduct');
const WorkProductManifest = require('../models/WorkProductManifest');
const Practice = require('../models/Practice');
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
                {
                    path: 'ownedElements.alphas',
                    populate: {path: 'areaOfConcern', skipInvalidIds: true}
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
                {
                    path: 'ownedElements.alphas',
                    populate: {path: 'areaOfConcern', skipInvalidIds: true}
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
        }
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
                    {path: 'ownedElements.alphas', populate: {path: 'areaOfConcern', skipInvalidIds: true}}
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
        response.populate([{path: 'alpha'}, {path: 'workProduct'}],
            (error, doc) => {
                if (error) {
                    res.status(400).json({errors: [`Problems updating practice work product ${error}`]});
                }
                res.json(response);
            });
    }).catch(error => {
        res.status(400).json({errors: [`Problems updating practice work product ${error}`]});
    })
}
exports.getAllWorkProductManifest = async (req, res) => {
    _console.info(`Getting all work product manifest for practice`);
    WorkProductManifest.find({owner: req.params.practice})
        .populate([{path: 'alpha'}, {path: 'workProduct'}])
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
            .populate([{path: 'alpha'}, {path: 'workProduct'}])
            .then(response => {
                res.json({workProductManifests: response});
            }).catch(error => {
            res.status(400).json({errors: [`Problems getting practice work product ${error}`]});
        });
    }).catch(error => {
        res.status(400).json({errors: [`Problems deleting practice work product ${error}`]});
    });
}