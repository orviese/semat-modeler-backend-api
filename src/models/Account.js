const bcrypt = require('bcrypt');
const validator = require('validator');
const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: [true, 'An email is required for you registration account!'],
        lowercase: true,
        trim: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid value');
            }
        }
    },
    password: {
        type: String,
        required: [true,'Why not a secure password?'],
        minLength: 6,
        trim: true
    },
    role: {
        type: String,
        enum: ['administrator', 'modeler', 'validator', 'guest'],
        default: 'guest'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'deleted'],
        default: 'active'
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

accountSchema.pre("save", async function (next){
    const account = this;
    if (account.isModified('password')){
        account.password = await bcrypt.hash(account.password, 10);
    }
    next();
});

module.exports = mongoose.model('Account', accountSchema);