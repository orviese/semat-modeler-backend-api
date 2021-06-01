const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
    isSuppressible: {type: Boolean, default: true},
    owner: {type: String, default: ''},
    tags: [String],
    resources: [String],
    properties: [String],
    name: {type: String, required: true, trim: true},
    icon: String,
    briefDescription: String,
    description: {type: String, trim: true},
    criterion: [String],
    requiredCompetencyLevel: [String],
    actions: [String],
    approach: [String]
});

module.exports = mongoose.model('Activity', activitySchema);