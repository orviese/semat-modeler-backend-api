const mongoose = require('mongoose');

const competencySchema = mongoose.Schema({
    isSuppressible: {type: Boolean, default: true},
    owner: {type: String, default: ''},
    isKernel: {type: Boolean, default: true},
    //areaOfConcern: {type: String, default: ''},
    areaOfConcern: {type: mongoose.ObjectId, ref: 'AreaOfConcern'},
    tags: [String],
    resources: [String],
    properties: [String],
    name: {type: String, required: true, trim: true},
    icon: String,
    briefDescription: String,
    description: {type: String, trim: true},
    possibleLevel: [String],
    skills: [String]
});

module.exports = mongoose.model('Competency', competencySchema);