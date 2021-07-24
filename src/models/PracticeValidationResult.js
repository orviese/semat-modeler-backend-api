const mongoose = require('mongoose');
const practiceValidationResultSchema = mongoose.Schema({
    practice: {type: mongoose.ObjectId, ref: 'Practice'},
    personName: {type: String, default: '', trim: true},
    email: {type: String, default: '',trim: true},
    creationDate: {type: Date, default: Date.now()},
    responseDate: {type: Date},
    finished: {type: Boolean, default: false},
    comment: {type: String, default: '',trim: true},
    criteria: [
        {
            name: String,
            objective: String,
            expression: {type: String, trim: true},
            result: {type: Number, default: 0},
            variables: [{
                symbol: String,
                meaning: String,
                value: {type: Number}
            }]
        }
    ]
});
module.exports = mongoose.model('PracticeValidationResult', practiceValidationResultSchema);