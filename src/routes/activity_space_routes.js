const express = require('express');
const router = express.Router();
const activitySpaceController = require('../controllers/activity-space-controller');
const auth = require('../middlewares/auth');
const {body, check} = require("express-validator");

router.post('/',
    [
        auth,
        body('name', 'A name is necessary')
            .trim().not().isEmpty(),
        body('description', 'A description is necessary')
            .trim().not().isEmpty(),
    ],
    activitySpaceController.addActivitySpace);

router.get('/',
    [auth], activitySpaceController.fetchAllActivitySpaces);
router.get('/with-areas-of-concern',
    [auth], activitySpaceController.fetchAllActivitySpacesWithAreas);

router.put('/',
    [
        auth,
        body('_id', 'Invalid id').not().isEmpty(),
        body('name', 'A name is necessary').not().isEmpty(),
        body('description', 'Description is required').not().isEmpty()
    ], activitySpaceController.updateActivitySpace);

module.exports = router