const express = require('express');
const router = express.Router();
const alphaController = require('../controllers/alpha_controller');
const auth = require('../middlewares/auth');
const {body, check} = require("express-validator");

router.post('/',
    [
        auth,
        body('name', 'A name is necessary').not().isEmpty(),
        body('description', 'Description is required').not().isEmpty()
    ], alphaController.addAlpha);

/*
router.put('/', [
        auth,
        body('id', 'Invalid id').not().isEmpty(),
        body('name', 'A name is necessary').not().isEmpty(),
        body('description', '').not().isEmpty(),
        body('colorConvention', 'Color convention required').not().isEmpty()
    ],
    areaOfConcernController.updateAreaOfConcern);
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