const {validationResult} = require('express-validator');

const requestValidation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array().map(e => e.msg)});
    } else {
        next();
    }
}
module.exports = requestValidation;

