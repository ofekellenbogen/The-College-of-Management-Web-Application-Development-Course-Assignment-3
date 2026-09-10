const express = require('express');
const path = require('path');
const { getClientStages, resourceSchemas, validateStageRequest } = require('./server/gameConfig');
const db = require('./server/db');
const productsRouter = require('./server/routes/products');
const reviewsRouter = require('./server/routes/reviews');
const gameRouter = require('./server/routes/game');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Game Stage Validation Middleware:
// Every game request sends the current stage ID (via X-Stage-Id header or stageId query param).
// The server verifies the request against the stage requirements and returns validation headers.
app.use((req, res, next) => {
  const stageHeader = req.headers['x-stage-id'] || req.headers['stage-id'] || req.query.stageId;
  if (stageHeader) {
    const stageId = parseInt(stageHeader, 10);
    if (!isNaN(stageId)) {
      const validation = validateStageRequest(stageId, {
        method: req.method,
        path: req.originalUrl || req.url,
        query: req.query,
        body: req.body
      }, db);

      res.set('X-Stage-Id', String(stageId));
      res.set('X-Stage-Valid', validation.isCorrect ? 'true' : 'false');
      res.set('X-Stage-Feedback', encodeURIComponent(validation.feedback));
      res.set('Access-Control-Expose-Headers', 'X-Stage-Id, X-Stage-Valid, X-Stage-Feedback');
    }
  }
  next();
});

// Static files middleware (CSS & Client JS)
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// SSR Route: Main Game Page
app.get('/', (req, res) => {
  const stages = getClientStages();
  res.render('index', {
    title: 'משחק ללימוד HTTP ו-REST API',
    stages: stages,
    totalStages: stages.length
  });
});

// SSR Route: Schemas Page
app.get('/schemas', (req, res) => {
  res.render('schemas', {
    title: 'סכמות משאבי המערכת (Schemas)',
    schemas: resourceSchemas
  });
});

// REST API Routes
app.use('/api/products', productsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/game', gameRouter);

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `API endpoint '${req.originalUrl}' does not exist.`
  });
});

// 404 handler for HTML pages
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 - עמוד לא נמצא'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  if (req.path.startsWith('/api/')) {
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: err.message
    });
  }
  res.status(500).send('שגיאת שרת פנימית (500)');
});

// Start listening
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 REST Game Server is running on: http://localhost:${PORT}`);
    console.log(`📄 Schemas SSR Page: http://localhost:${PORT}/schemas`);
  });
}

module.exports = app;
