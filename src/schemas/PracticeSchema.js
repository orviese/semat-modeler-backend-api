const mongoose = require('mongoose');

const practiceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    }
});

module.exports = practiceSchema;