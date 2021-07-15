const mongoose = require('mongoose');

const areaOfConcernSchema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    description: {type: String, trim: true},
    colorConvention: String,
    deleted: {type: Boolean, default: false},
    order: {type: Number, required: true}
});

module.exports = mongoose.model('AreaOfConcern', areaOfConcernSchema);