const express = require('express');
const router = express.Router();
const practiceControl = require('../controllers/practice_controller');
const auth = require('../middlewares/auth');
const requestValidation = require('../middlewares/request-prevalidation');
const {body, param} = require("express-validator");

router.post('/',
    [
        auth,
        body('name', 'A name is necessary to identify your practice').not().isEmpty(),
        body('objective', 'Objective is required for your practice').not().isEmpty(),
        requestValidation
    ], practiceControl.addPractice);

router.patch('',
    [
        auth,
        body('_id', 'Id is required update your practice').not().isEmpty(),
        body('name', 'A name is necessary to identify your practice').not().isEmpty(),
        body('objective', 'Objective is required for your practice').not().isEmpty(),
        requestValidation
    ], practiceControl.updatePractice
);

router.get('', [auth], practiceControl.getAllPractices);

router.post('/:practice/owned-element/alpha/:alpha', [auth], practiceControl.addOwnedAlpha);

router.delete('/:practice/owned-element/alpha/:alpha', [auth], practiceControl.removeOwnedAlpha);

router.post('/:id/work-product',
    [auth,
        param('id', 'path param id not present').not().isEmpty(),
        body('name', 'A name is necessary to identify your practice').not().isEmpty(),
        body('description', 'A name is necessary to identify your practice').not().isEmpty(),
        requestValidation
    ],
    practiceControl.addWorkProduct);

router.put('/work-product',
    [auth,
        body(['_id', 'name', 'description'], 'work product fields required').not().isEmpty(),
        requestValidation
    ], practiceControl.updateWorkProduct);

router.post('/:practice/work-product-manifest',
    [auth,
            param('practice', 'Practice id required').not().isEmpty(),
            body(['lowerBound', 'upperBound', 'alpha', 'workProduct'],
                'work product fields required').not().isEmpty(),
            requestValidation
    ], practiceControl.addWorkProductManifest);

router.get('/:practice/work-product-manifest',
    [auth,
        param('practice', 'Practice id required').not().isEmpty(),
        requestValidation
    ], practiceControl.getAllWorkProductManifest);

router.delete('/:practice/work-product-manifest/:id',
    [auth,
            param(['id', 'practice'], 'Ids required').not().isEmpty(),
            requestValidation
    ], practiceControl.deleteWorkProductManifest);

router.post('/:practice/owned-element/activity-space/:activitySpace',
    [auth],
    param('practice', 'Practice id required').not().notEmpty().not().contains('undefined'),
    param('activitySpace', 'ActivitySpace id required').not().notEmpty().not().contains('undefined'),
    requestValidation,
    practiceControl.addOwnedActivitySpace);

router.post('/:practice/activity',
    [auth],
    param('practice', 'Practice id required').not().notEmpty().not().contains('undefined'),
    body('activitySpace', 'ActivitySpace id required').not().notEmpty(),
    body('name', 'Name for activity id required').not().notEmpty(),
    requestValidation,
    practiceControl.addActivityToPractice);

module.exports = router;