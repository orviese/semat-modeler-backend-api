const mongoose = require('mongoose');

const actionSchema = mongoose.Schema({
    isSuppressible: {type: Boolean, default: true},
    owner: {type: String, default: ''},
    tags: [String],
    resources: [String],
    properties: [String],
    kind: {
        type: String,
        enum: ['create','read','update','delete'],
        required: true
    },
    alpha: [String],
    workProduct: [String]
});

module.exports = mongoose.model('Action', actionSchema);