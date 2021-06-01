const mongoose = require('mongoose');

const practiceSchema = mongoose.Schema({
    isSuppressible: {type: Boolean, default: true},
    owner: {type: String, default: ''},
    tags: [{id: String}],
    resources: [{id: String}],
    properties: [{id: String}],
    name: {type: String, required: true, trim: true},
    icon: {type: String},
    briefDescription: {type: String},
    description: {type: String, trim: true},
    consistencyRules: String,
    objective: String,
    measures: [{id: String}],
    entry: [{id: String}],
    result: [{id: String}]
});

module.exports = mongoose.model('Practice', practiceSchema);