const mongoose = require('mongoose');

const approachSchema = mongoose.Schema({
    isSuppressible: {type: Boolean, default: true},
    owner: {type: String, default: ''},
    tags: [String],
    resources: [String],
    properties: [String],
    name: {type: String, required: true, trim: true},
    description: {type: String, trim: true},
});

module.exports = mongoose.model('Approach', approachSchema);