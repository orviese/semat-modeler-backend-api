const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const workProductManifestSchema = Schema({
    isSuppressible: {type: Boolean, default: true},
    owner: {type: String, default: ''},
    tags: [String],
    resources: [String],
    properties: [String],
    lowerBound: String,
    upperBound: String,
    alpha: {type: mongoose.ObjectId, ref: 'Alpha'},
    workProduct: {type: mongoose.ObjectId, ref: 'WorkProduct'},
});

module.exports = mongoose.model('WorkProductManifest', workProductManifestSchema);