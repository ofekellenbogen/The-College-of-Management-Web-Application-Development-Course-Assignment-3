const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/products - Get all products (supports query params: category, inStock, maxPrice, q, sortBy, order)
router.get('/', (req, res) => {
  const products = db.getProducts(req.query);
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// GET /api/products/:id - Get single product by ID
router.get('/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Product with ID ${req.params.id} was not found`
    });
  }
  res.status(200).json({
    success: true,
    data: product
  });
});

// POST /api/products - Create a new product
router.post('/', (req, res) => {
  const { name, category, price, inStock, rating } = req.body;
  if (!name || !category || price === undefined) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Missing required fields: name, category, and price are required'
    });
  }

  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice < 0) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Price must be a valid positive number'
    });
  }

  const created = db.createProduct({ name, category, price: numPrice, inStock, rating });
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: created
  });
});

// PUT /api/products/:id - Full update of a product
router.put('/:id', (req, res) => {
  const { name, category, price, inStock, rating } = req.body;
  if (!name || !category || price === undefined) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'PUT requires all required fields: name, category, and price'
    });
  }

  const updated = db.updateProduct(req.params.id, req.body, false);
  if (!updated) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Product with ID ${req.params.id} was not found`
    });
  }

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: updated
  });
});

// PATCH /api/products/:id - Partial update of a product
router.patch('/:id', (req, res) => {
  const existing = db.getProductById(req.params.id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Product with ID ${req.params.id} was not found`
    });
  }

  const updated = db.updateProduct(req.params.id, req.body, true);
  res.status(200).json({
    success: true,
    message: 'Product partially updated successfully',
    data: updated
  });
});

// DELETE /api/products/:id - Delete product by ID
router.delete('/:id', (req, res) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Product with ID ${req.params.id} was not found`
    });
  }

  res.status(200).json({
    success: true,
    message: `Product ${req.params.id} ('${deleted.name}') deleted successfully`,
    data: deleted
  });
});

// GET /api/products/:id/reviews - Nested route: Get all reviews for a product
router.get('/:id/reviews', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Product with ID ${req.params.id} was not found`
    });
  }

  const reviews = db.getReviewsByProductId(req.params.id);
  res.status(200).json({
    success: true,
    productId: product.id,
    productName: product.name,
    count: reviews.length,
    data: reviews
  });
});

// POST /api/products/:id/reviews - Nested route: Add review to a product
router.post('/:id/reviews', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Product with ID ${req.params.id} was not found`
    });
  }

  const { author, rating, comment } = req.body;
  if (!author || rating === undefined || !comment) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Author, rating (1-5), and comment are required fields'
    });
  }

  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Rating must be a number between 1 and 5'
    });
  }

  const review = db.createReview(req.params.id, { author, rating: numRating, comment });
  res.status(201).json({
    success: true,
    message: 'Review created successfully for product',
    data: review
  });
});

module.exports = router;
