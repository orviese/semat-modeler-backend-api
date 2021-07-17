const mongoose = require('mongoose');

/**
 * According to essence specs activity spaces can only be part of other activity spaces
 * so in this case we will handle using parent field and this association model
 * only will relationship activity spaces with activities.
 * **/

const activityAssociationSchema = mongoose.Schema({
    isSuppressible: {type: Boolean, default: true},
    owner: {type: String, default: ''},
    tags: [String],
    resources: [String],
    properties: [String],
    kind: {type: String, required: true, default: 'part-of'},
    end1: {type: mongoose.ObjectId, ref: 'Activity'},
    end2: {type: mongoose.ObjectId, ref: 'ActivitySpace'}
});

module.exports = mongoose.model('ActivityAssociation', activityAssociationSchema);