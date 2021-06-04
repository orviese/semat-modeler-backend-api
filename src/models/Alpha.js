const mongoose = require('mongoose');

const AlphaSchema = mongoose.Schema({

    isSuppressible: {type: Boolean, default: true},
    isKernel: {type: Boolean, default: false},
    areaOfConcern: {String},
    owner: {type: String, default: ''},
    tags: [{id: String}],
    resources: [{id: String}],
    properties: [{id: String}],
    name: {type: String, required: true, trim: true},
    icon: {type: String},
    briefDescription: {type: String},
    description: {type: String, trim: true},
    states: [String]
});

module.exports = mongoose.model('Alpha', AlphaSchema);