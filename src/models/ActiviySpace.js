const mongoose = require('mongoose');

const activitySpaceSchema = mongoose.Schema({
    isSuppressible: {type: Boolean, default: true},
    isKernel: {type: Boolean, default: false},
    areaOfConcern: {type: mongoose.ObjectId, ref:'AreaOfConcern',default: ''},
    owner: {type: String, default: ''},
    tags: [String],
    resources: [String],
    properties: [String],
    name: {type: String, required: true, trim: true},
    icon: String,
    briefDescription: String,
    description: {type: String, trim: true},
    criterion: [String],
    input: [String]
});

module.exports = mongoose.model('ActivitySpace', activitySpaceSchema);