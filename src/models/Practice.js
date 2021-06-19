const mongoose = require('mongoose');

const practiceSchema = mongoose.Schema({
    isSuppressible: {type: Boolean, default: true},
    owner: {type: String, default: ''},
    tags: [String],
    resources: [String],
    properties: [String],
    name: {type: String, required: true, trim: true},
    icon: String,
    briefDescription: String,
    description: {type: String, trim: true},
    referredElements: {
        alphas: [String],
        activitySpaces: [String]
    },
    ownedElements: {
        alphas: [
            {
                isSuppressible: {type: Boolean, default: true},
                isKernel: {type: Boolean, default: false},
                areaOfConcern: String,
                owner: {type: String, default: ''},
                tags: [String],
                resources: [String],
                properties: [String],
                name: {type: String, required: true, trim: true},
                icon: String,
                briefDescription: String,
                description: {type: String, trim: true},
                states: [String]
            }
        ],
        activitySpaces: [],
        activities: [],
        activityAssociations: [],
        workProducts: [],
        actions: []
    },
    consistencyRules: String,
    objective: String,
    measures: [String],
    entry: [String],
    result: [String]
});

module.exports = mongoose.model('Practice', practiceSchema);