const express = require('express');
const router = express.Router();
const alphaController = require('../controllers/alpha_controller');
const auth = require('../middlewares/auth');
const requestValidation = require('../middlewares/request-prevalidation');
const {body, check} = require("express-validator");

router.post('/',
    [
        auth,
        body('name', 'A name is necessary').not().isEmpty(),
        body('description', 'Description is required').not().isEmpty(),
        body('briefDescription', 'Brief Description is required').not().isEmpty(),
        requestValidation
    ], alphaController.addAlpha);

router.get('/',
    [
        auth
    ], alphaController.fetchAllAlphas
);

router.get('/practice/:id',
    [
        auth,
        check('id', 'Invalid id').not().isEmpty(),
        requestValidation
    ], alphaController.fetchKernelAndPracticeAlphas
);

router.put('/', [
    auth,
    body('_id', 'Invalid id').not().isEmpty(),
    body('name', 'A name is necessary').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('briefDescription', 'Brief Description is required').not().isEmpty(),
    requestValidation
], alphaController.updateAlpha);

/*
router.get('/', [auth], areaOfConcernController.getAllAreaOfConcern);
router.get('/:id', [
            auth,
            check('id','Invalid id').not().isEmpty(),
    ], areaOfConcernController.getAreaOfConcern);

router.delete('/:id', [
    auth,
    check('id','Invalid id').not().isEmpty(),
], areaOfConcernController.deleteAreaOfConcern);
*/
module.exports = router;