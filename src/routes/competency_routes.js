const express = require('express');
const router = express.Router();
const competencyController = require('../controllers/competency-controller');
const auth = require('../middlewares/auth');
const requestValidation = require('../middlewares/request-prevalidation');
const {body, check} = require("express-validator");

router.post('/',
    [
        auth,
        body('name', 'A name is necessary')
            .trim().not().isEmpty(),
        body('description', 'A description is necessary')
            .trim().not().isEmpty(),
        requestValidation
    ],
    competencyController.addCompetency);

router.get('/',
    [auth], competencyController.fetchAllCompetencies);

router.put('/',
    [
        auth,
        body('_id', 'Invalid id').not().isEmpty(),
        body('name', 'A name is necessary').not().isEmpty(),
        body('description', 'Description is required').not().isEmpty(),
        requestValidation
    ], competencyController.updateCompetency);

module.exports = router