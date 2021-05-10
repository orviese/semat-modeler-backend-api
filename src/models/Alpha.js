const mongoose = require('mongoose');

const AlphaSchema = mongoose.Schema({
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
    aoc: {
        type: String,
        enum: ['CUSTOMER', 'SOLUTION', 'ENDEAVOR'],
        required: true
    },
    states: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        checkList: [String]
    }]
});

module.exports = mongoose.model('Alpha', AlphaSchema);