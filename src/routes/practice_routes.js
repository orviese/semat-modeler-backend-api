const express = require('express');
const router = express.Router();
const practiceControl = require('../controllers/practice_controller');
const auth = require('../middlewares/auth');
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
        body('id', 'Id is required update your practice')
            .not().isEmpty(),
        body('name', 'A name is necessary to identify your practice')
            .not().isEmpty(),
        body('objective', 'Objective is required for your practice')
            .not().isEmpty(),
    ], practiceControl.updatePractice
);

module.exports = router;