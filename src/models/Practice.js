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
        alphas: [{type: mongoose.ObjectId, ref: 'Alpha'}],
        activitySpaces: [{type: mongoose.ObjectId, ref: 'ActivitySpace'}],
        activities: [{type: mongoose.ObjectId, ref: 'Activity'}],
        activityAssociations: [{type: mongoose.ObjectId, ref: 'ActivityAssociation'}],
        workProducts: [{type: mongoose.ObjectId, ref: "WorkProduct"}],
        workProductManifests: [{type: mongoose.ObjectId, ref: 'WorkProductManifest'}],
        patterns: [{type: mongoose.ObjectId, ref: 'Pattern'}]
    },
    consistencyRules: String,
    objective: String,
    measures: [String],
    entry: [String],
    result: [String]
});

module.exports = mongoose.model('Practice', practiceSchema);