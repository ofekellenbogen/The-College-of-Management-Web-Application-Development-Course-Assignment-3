const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/initialData.json');

// In-memory data store
let dataStore = {
  products: [],
  reviews: []
};

// Initialize or reload data from JSON file
function resetDataStore() {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(rawData);
    dataStore.products = JSON.parse(JSON.stringify(parsed.products || []));
    dataStore.reviews = JSON.parse(JSON.stringify(parsed.reviews || []));
    console.log(`[DB] Data store reset successfully: ${dataStore.products.length} products, ${dataStore.reviews.length} reviews.`);
  } catch (err) {
    console.error('[DB] Error loading initial data:', err);
    dataStore.products = [];
    dataStore.reviews = [];
  }
}

// Initial load
resetDataStore();

const db = {
  // PRODUCTS
  getProducts: (query = {}) => {
    let result = [...dataStore.products];

    // Filter by category
    if (query.category) {
      result = result.filter(p => p.category.toLowerCase() === query.category.toLowerCase());
    }

    // Filter by inStock
    if (query.inStock !== undefined) {
      const isStock = query.inStock === 'true' || query.inStock === true;
      result = result.filter(p => p.inStock === isStock);
    }

    // Filter by maxPrice
    if (query.maxPrice !== undefined) {
      const max = parseFloat(query.maxPrice);
      if (!isNaN(max)) {
        result = result.filter(p => p.price <= max);
      }
    }

    // Search by name
    if (query.q) {
      const search = query.q.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(search));
    }

    // Sort
    if (query.sortBy) {
      const field = query.sortBy;
      const order = (query.order && query.order.toLowerCase() === 'desc') ? -1 : 1;
      result.sort((a, b) => {
        if (a[field] < b[field]) return -1 * order;
        if (a[field] > b[field]) return 1 * order;
        return 0;
      });
    }

    return result;
  },

  getProductById: (id) => {
    const numId = parseInt(id, 10);
    return dataStore.products.find(p => p.id === numId) || null;
  },

  createProduct: (productData) => {
    const newId = dataStore.products.length > 0 
      ? Math.max(...dataStore.products.map(p => p.id)) + 1 
      : 1;

    const newProduct = {
      id: newId,
      name: String(productData.name).trim(),
      category: String(productData.category).trim(),
      price: Number(productData.price) || 0,
      inStock: productData.inStock !== undefined ? Boolean(productData.inStock) : true,
      rating: productData.rating !== undefined ? Number(productData.rating) : 5.0
    };

    dataStore.products.push(newProduct);
    return newProduct;
  },

  updateProduct: (id, updateData, isPatch = true) => {
    const numId = parseInt(id, 10);
    const index = dataStore.products.findIndex(p => p.id === numId);
    if (index === -1) return null;

    if (isPatch) {
      // Partial update (PATCH)
      const existing = dataStore.products[index];
      const updated = {
        ...existing,
        ...updateData,
        id: numId // Prevent ID modification
      };
      if (updateData.price !== undefined) updated.price = Number(updateData.price);
      if (updateData.inStock !== undefined) updated.inStock = Boolean(updateData.inStock);
      if (updateData.rating !== undefined) updated.rating = Number(updateData.rating);

      dataStore.products[index] = updated;
      return updated;
    } else {
      // Full update (PUT)
      const replaced = {
        id: numId,
        name: updateData.name ? String(updateData.name).trim() : dataStore.products[index].name,
        category: updateData.category ? String(updateData.category).trim() : dataStore.products[index].category,
        price: updateData.price !== undefined ? Number(updateData.price) : dataStore.products[index].price,
        inStock: updateData.inStock !== undefined ? Boolean(updateData.inStock) : true,
        rating: updateData.rating !== undefined ? Number(updateData.rating) : 5.0
      };
      dataStore.products[index] = replaced;
      return replaced;
    }
  },

  deleteProduct: (id) => {
    const numId = parseInt(id, 10);
    const index = dataStore.products.findIndex(p => p.id === numId);
    if (index === -1) return false;

    // Remove product
    const deleted = dataStore.products.splice(index, 1)[0];

    // Cascade delete associated reviews
    dataStore.reviews = dataStore.reviews.filter(r => r.productId !== numId);

    return deleted;
  },

  // REVIEWS
  getReviews: (query = {}) => {
    let result = [...dataStore.reviews];
    if (query.productId) {
      const pid = parseInt(query.productId, 10);
      result = result.filter(r => r.productId === pid);
    }
    return result;
  },

  getReviewsByProductId: (productId) => {
    const numId = parseInt(productId, 10);
    return dataStore.reviews.filter(r => r.productId === numId);
  },

  getReviewById: (id) => {
    const numId = parseInt(id, 10);
    return dataStore.reviews.find(r => r.id === numId) || null;
  },

  createReview: (productId, reviewData) => {
    const pId = parseInt(productId, 10);
    const product = dataStore.products.find(p => p.id === pId);
    if (!product) return null;

    const newId = dataStore.reviews.length > 0
      ? Math.max(...dataStore.reviews.map(r => r.id)) + 1
      : 101;

    const newReview = {
      id: newId,
      productId: pId,
      author: String(reviewData.author).trim(),
      rating: Math.min(5, Math.max(1, Number(reviewData.rating) || 5)),
      comment: String(reviewData.comment).trim()
    };

    dataStore.reviews.push(newReview);
    return newReview;
  },

  deleteReview: (id) => {
    const numId = parseInt(id, 10);
    const index = dataStore.reviews.findIndex(r => r.id === numId);
    if (index === -1) return false;
    return dataStore.reviews.splice(index, 1)[0];
  },

  reset: resetDataStore,
  getSnapshot: () => ({ products: [...dataStore.products], reviews: [...dataStore.reviews] })
};

module.exports = db;
