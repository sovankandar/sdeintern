const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    createShortLink, 
    getLinks, 
    redirectToOriginal,
    trackClick 
} = require('../controllers/linkController');

// Public routes
router.get('/:shortUrl', redirectToOriginal);
router.post('/:shortUrl/click', trackClick);

// Protected routes
router.use(protect);
router.post('/', createShortLink);
router.get('/', getLinks);

module.exports = router;