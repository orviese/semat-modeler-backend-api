const mongoose = require('mongoose');

/**
 * This model uses competency directly instead of competency levels
 * take this into account to support competency levels in the future.
 * @type {*}
 */
const activitySchema = mongoose.Schema({
    isSuppressible: {type: Boolean, default: true},
    owner: {type: String, default: ''},
    tags: [String],
    resources: [String],
    properties: [String],
    name: {type: String, required: true, trim: true},
    icon: String,
    briefDescription: String,
    description: {type: String, trim: true, default: ''},
    criterion: [String],
    requiredCompetencyLevel: [{
        type: mongoose.ObjectId, ref: 'Competency'
    }],
    actions: [String],
    approach: [String]
});

module.exports = mongoose.model('Activity', activitySchema);