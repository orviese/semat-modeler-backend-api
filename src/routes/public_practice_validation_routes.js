const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const practiceValidationControl = require('../controllers/practice_validation_controller');
const requestValidation = require('../middlewares/request-prevalidation');
const {body, param} = require("express-validator");

router.get('/public/:validationId',
    param('validationId', 'Validation id required').notEmpty().not().contains('undefined'),
    requestValidation,
    practiceValidationControl.getPublicPracticeValidation
);

router.patch('/public/:validationId',
    param('validationId', 'Validation id required').notEmpty().not().contains('undefined'),
    //body('criteria', 'criteria is required').trim().notEmpty(),
    body('personName', 'Person who validates is required').trim().notEmpty(),
    body('email', 'Person email is required').trim().notEmpty(),
    requestValidation,
    practiceValidationControl.closePublicPracticeValidation
);

router.get('/report/:practice', [
    auth,
], practiceValidationControl.getPublicPracticeValidationResults);

module.exports = router;