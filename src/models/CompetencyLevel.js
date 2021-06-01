const mongoose = require('mongoose');

const competencyLevelSchema = mongoose.Schema({
    isSuppressible: {type: Boolean, default: true},
    owner: {type: String, default: ''},
    tags: [String],
    resources: [String],
    properties: [String],
    name: {type: String, required: true, trim: true},
    briefDescription: String,
    level: Number,
    checkListItem: [String]
});

module.exports = mongoose.model('CompetencyLevel', competencyLevelSchema);