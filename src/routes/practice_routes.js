const express = require('express');
const router = express.Router();
const practiceControl = require('../controllers/practice_controller');
const auth = require('../middlewares/auth');
const requestValidation = require('../middlewares/request-errors');
const {body, check} = require("express-validator");

router.post('/',
    [
        auth,
        body('name', 'A name is necessary to identify your practice')
            .not().isEmpty(),
        body('objective', 'Objective is required for your practice')
            .not().isEmpty(),
    ], practiceControl.addPractice);

router.patch('',
    [
        auth,
        body('_id', 'Id is required update your practice')
            .not().isEmpty(),
        body('name', 'A name is necessary to identify your practice')
            .not().isEmpty(),
        body('objective', 'Objective is required for your practice')
            .not().isEmpty(),
    ], practiceControl.updatePractice
);

router.get('', [auth], practiceControl.getAllPractices);

router.post('/owned-element/alpha', [auth], practiceControl.addOwnedAlpha);

router.delete('/:practice/owned-element/alpha/:alpha', [auth], practiceControl.removeOwnedAlpha);

router.post('/:id/work-product',
    [auth,
        check('id','path param id not present').not().isEmpty(),
        body('name', 'A name is necessary to identify your practice')
            .not().isEmpty(),
        body('description', 'A name is necessary to identify your practice')
            .not().isEmpty(),
    ],
    practiceControl.addWorkProduct);

router.put('/work-product',
    [auth,
        body('_id','work product id not present').not().isEmpty(),
        body('name', 'A name is necessary').not().isEmpty(),
        body('description', 'A description is necessary')
            .not().isEmpty(),
        requestValidation
    ],
    practiceControl.updateWorkProduct);

module.exports = router;