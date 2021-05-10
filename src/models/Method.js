const mongoose = require('mongoose');
const Practice = require('../schemas/PracticeSchema');

const methodSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    practices: [Practice]
});

module.exports = mongoose.model('Method', methodSchema);