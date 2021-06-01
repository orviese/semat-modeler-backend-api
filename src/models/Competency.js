const mongoose = require('mongoose');

const competencySchema = mongoose.Schema({
    isSuppressible: {type: Boolean, default: true},
    owner: {type: String, default: ''},
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