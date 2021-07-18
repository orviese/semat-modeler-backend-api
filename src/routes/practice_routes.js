const express = require('express');
const router = express.Router();
const practiceControl = require('../controllers/practice_controller');
const auth = require('../middlewares/auth');
const requestValidation = require('../middlewares/request-prevalidation');
const {body, param} = require("express-validator");

router.post('/',
    [
        auth,
        body('name', 'A name is necessary to identify your practice').notEmpty(),
        body('objective', 'Objective is required for your practice').notEmpty(),
        requestValidation
    ], practiceControl.addPractice);

router.patch('',
    [
        auth,
        body('_id', 'Id is required update your practice').notEmpty(),
        body('name', 'A name is necessary to identify your practice').notEmpty(),
        body('objective', 'Objective is required for your practice').notEmpty(),
        requestValidation
    ], practiceControl.updatePractice
);

router.get('', [auth], practiceControl.getAllPractices);

router.post('/:practice/owned-element/alpha/:alpha', [auth], practiceControl.addOwnedAlpha);

router.delete('/:practice/owned-element/alpha/:alpha', [auth], practiceControl.removeOwnedAlpha);

router.post('/:id/work-product',
    [auth,
        param('id', 'Practice id not present').not().notEmpty().not().contains('undefined'),
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
            param('practice', 'Practice id required').not().notEmpty().not().contains('undefined'),
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

router.delete('/:practice/owned-element/activity-space/:activitySpace',
    [auth],
    param('practice', 'Practice id required').notEmpty().not().contains('undefined'),
    param('activitySpace', 'ActivitySpace id required').notEmpty().not().contains('undefined'),
    requestValidation,
    practiceControl.removeOwnedActivitySpace);

router.post('/:practice/activity',
    [auth],
    param('practice', 'Practice id required').not().notEmpty().not().contains('undefined'),
    body('activitySpace', 'ActivitySpace id required').not().notEmpty(),
    body('name', 'Name for activity id required').not().notEmpty(),
    requestValidation,
    practiceControl.addActivityToPractice);

router.delete('/:practice/activity/:activity',
    [auth],
    param('practice', 'Practice id required').notEmpty().not().contains('undefined'),
    param('activity', 'activity id required').notEmpty().not().contains('undefined'),
    body('activityAssociation', 'activityAssociation id required').notEmpty(),
    requestValidation,
    practiceControl.removeOwnedActivity);

module.exports = router;