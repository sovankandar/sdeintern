const express = require('express');
const router = express.Router();
const { getLinkAnalytics } = require('../controllers/analyticsController');


router.get('/:linkId', getLinkAnalytics);

module.exports = router;