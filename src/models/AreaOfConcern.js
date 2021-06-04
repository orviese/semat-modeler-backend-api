const mongoose = require('mongoose');

const areaOfConcernSchema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    description: {type: String, trim: true},
    colorConvention: {String}
});

module.exports = mongoose.model('AreaOfConcern', areaOfConcernSchema);