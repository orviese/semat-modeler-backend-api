const mongoose = require('mongoose');

const methodSchema = mongoose.Schema({
    isSuppressible: {type: Boolean, default: true},
    owner: {type: String, default: '', required: false},
    tags: [String],
    resources: [String],
    properties: [String],
    name: {type: String, required: true, trim: true},
    icon: String,
    briefDescription: String,
    description: {type: String, trim: true},
    baseKernel: {type: String, default: ''}
});

module.exports = mongoose.model('Method', methodSchema);