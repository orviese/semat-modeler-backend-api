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
    consistencyRules: String,
    objective: String,
    measures: [String],
    entry: [String],
    result: [String]
});

module.exports = mongoose.model('Practice', practiceSchema);