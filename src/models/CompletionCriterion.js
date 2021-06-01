const mongoose = require('mongoose');

const completionCriterionSchema = mongoose.Schema({
    isSuppressible: {type: Boolean, default: true},
    owner: {type: String, required: true},
    tags: [String],
    resources: [String],
    properties: [String],
    description: {type: String, trim: true},
    alphaState: String,
    workProductLevelOfDetail: String
});

module.exports = mongoose.model('CompletionCriterion', completionCriterionSchema);