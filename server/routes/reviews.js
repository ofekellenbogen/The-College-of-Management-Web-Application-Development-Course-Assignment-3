const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/reviews - Get all reviews (optional filter ?productId=1)
router.get('/', (req, res) => {
  const reviews = db.getReviews(req.query);
  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// GET /api/reviews/:id - Get single review by ID
router.get('/:id', (req, res) => {
  const review = db.getReviewById(req.params.id);
  if (!review) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Review with ID ${req.params.id} was not found`
    });
  }
  res.status(200).json({
    success: true,
    data: review
  });
});

// DELETE /api/reviews/:id - Delete single review
router.delete('/:id', (req, res) => {
  const deleted = db.deleteReview(req.params.id);
  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Review with ID ${req.params.id} was not found`
    });
  }
  res.status(200).json({
    success: true,
    message: `Review ${req.params.id} deleted successfully`,
    data: deleted
  });
});

module.exports = router;
