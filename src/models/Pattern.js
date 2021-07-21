const mongoose = require('mongoose');

const patternSchema = mongoose.Schema({
    isSuppressible: {type: Boolean, default: true},
    owner: {type: String, default: ''},
    tags: [String],
    resources: [String],
    properties: [String],
    name: {type: String, required: true, trim: true},
    associationName: {type: String, required: true, trim: true},
    target: {type: String, enum: ['activitySpace', 'workProduct', 'alpha']},
    icon: String,
    briefDescription: String,
    description: {type: String, trim: true},
    areaOfConcern: {type: mongoose.ObjectId, ref: 'AreaOfConcern'},
    activitySpaceElement: {type: mongoose.ObjectId, ref: 'ActivitySpace'},
    workProductElements: [{type: mongoose.ObjectId, ref: 'WorkProduct'}],
    alphaElement: {type: mongoose.ObjectId, ref: 'Alpha'}
});

module.exports = mongoose.model('Pattern', patternSchema);