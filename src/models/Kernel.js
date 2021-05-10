const mongoose = require('mongoose');

const kernelSchema = mongoose.Schema({
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

module.exports = mongoose.model('Kernel', kernelSchema);