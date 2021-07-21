const express = require('express');
const router = express.Router();
const practiceValidationControl = require('../controllers/practice_validation_controller');
const auth = require('../middlewares/auth');
const requestValidation = require('../middlewares/request-prevalidation');
const {body, param} = require("express-validator");

router.get('/:owner',
    auth,
    param('owner', 'owner id required').notEmpty().not().contains('undefined'),
    requestValidation,
    practiceValidationControl.fetchAllValidationCriteria
);

router.delete('/:id',
    auth,
    param('id', 'Criterion id required').notEmpty().not().contains('undefined'),
    requestValidation,
    practiceValidationControl.deletePracticeValidationCriterion

);
router.post('/',
    [
        auth,
        body('name', 'A name is necessary for your practice validation').notEmpty(),
        body('owner', 'An owner is necessary').notEmpty(),
        body('description', 'description is required').notEmpty(),
        body('expression', 'The formula expression is required').notEmpty(),
        body('variables', 'Variables are required').notEmpty(),
        requestValidation
    ], practiceValidationControl.addPracticeValidationCriterion);

module.exports = router;