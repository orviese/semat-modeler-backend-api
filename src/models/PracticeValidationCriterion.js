const mongoose = require('mongoose');

const practiceValidationSchema = mongoose.Schema({
    owner: {type: mongoose.ObjectId, ref: 'Practice'},
    name: {type: String, required: true, trim: true},
    description: {type: String, trim: true},
    variables: [{
        symbol: String,
        meaning: String,
        value: {type: Number, default: 1}
    }],
    expression: {type: String, trim: true},
    result: {type: Number, default: 0},
    validations: [{
        creationDate: {type: Date, default: Date.now()},
        variables: [{
            symbol: String,
            meaning: String,
            value: Number
        }],
        formulaResult: Number
    }]
});

module.exports = mongoose.model('PracticeValidation', practiceValidationSchema);