const mongoose = require('mongoose');

const AlphaSchema = mongoose.Schema({
    isSuppressible: {type: Boolean, default: true},
    isKernel: {type: Boolean, default: true},
    areaOfConcern: {type: mongoose.ObjectId, ref: 'AreaOfConcern', default: ''},
    superAlpha: {type: mongoose.ObjectId, ref: 'Alpha', default: ''},
    owner: {type: String, default: ''},
    tags: [String],
    resources: [String],
    properties: [String],
    name: {type: String, required: true, trim: true},
    icon: String,
    briefDescription: String,
    description: {type: String, trim: true},
    states: [String]
});

module.exports = mongoose.model('Alpha', AlphaSchema);