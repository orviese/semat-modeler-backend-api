const express = require('express');
const router = express.Router();
const areaOfConcernController = require('../controllers/area_of_concern_controller');
const {body, check} = require("express-validator");
const auth = require('../middlewares/auth');
const requestValidation = require('../middlewares/request-errors');

router.post('/',
    [
        auth,
        body('name', 'A name is necessary').not().isEmpty(),
        body('description', 'Description is required').not().isEmpty(),
        body('colorConvention', 'Color convention required').not().isEmpty(),
        body('order', 'Order required').not().isEmpty(),
        requestValidation
    ], areaOfConcernController.addAreaOfConcern);


router.put('/', [
        auth,
        body('_id', 'Invalid id').not().isEmpty(),
        body('name', 'A name is necessary').not().isEmpty(),
        body('description', '').not().isEmpty(),
        body('colorConvention', 'Color convention required').not().isEmpty(),
        body('order', 'Order required').not().isEmpty(),
        requestValidation
    ],
    areaOfConcernController.updateAreaOfConcern);

router.get('/', [auth], areaOfConcernController.getAllAreaOfConcern);

router.get('/:id', [
    auth,
    check('id', 'Invalid id').not().isEmpty(),
    requestValidation
], areaOfConcernController.getAreaOfConcern);

router.delete('/:id', [
    auth,
    check('id', 'Invalid id').not().isEmpty(),
    requestValidation
], areaOfConcernController.deleteAreaOfConcern);

module.exports = router;