const mongoose = require('mongoose');

const checkpointSchema = mongoose.Schema({
    isSuppressible: {type: Boolean, default: true},
    owner: {type: String, default: ''},
    tags: [String],
    resources: [String],
    properties: [String],
    name: {type: String, required: true, trim: true},
    description: String,
    shortDescription: String
});

module.exports = mongoose.model('Checkpoint', checkpointSchema);