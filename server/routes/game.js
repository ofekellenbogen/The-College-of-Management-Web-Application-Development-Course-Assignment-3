const express = require('express');
const router = express.Router();
const { gameStages, getClientStages } = require('../gameConfig');
const db = require('../db');

// GET /api/game/stages - Return client-safe list of stages (without verification algorithms)
router.get('/stages', (req, res) => {
  res.status(200).json({
    success: true,
    totalStages: gameStages.length,
    stages: getClientStages()
  });
});

// POST /api/game/verify - Verify user attempt on current stage
router.post('/verify', (req, res) => {
  const { stageId, method, path: reqPath, query = {}, body = null } = req.body;

  if (!stageId) {
    return res.status(400).json({
      success: false,
      message: 'Stage ID is required for verification'
    });
  }

  const stage = gameStages.find(s => s.id === parseInt(stageId, 10));
  if (!stage) {
    return res.status(404).json({
      success: false,
      message: `Stage with ID ${stageId} not found`
    });
  }

  // Parse path and base path
  const fullPath = (reqPath || '').trim();
  const cleanPath = fullPath.split('?')[0];

  const reqInfo = {
    method: (method || 'GET').toUpperCase(),
    path: cleanPath,
    basePath: cleanPath,
    fullPath: fullPath,
    query: query || {},
    body: body
  };

  // Run server-side stage validation
  const validationResult = stage.validate(reqInfo, db);

  res.status(200).json({
    stageId: stage.id,
    isCorrect: validationResult.success,
    feedback: validationResult.message,
    expectedStatus: stage.expectedStatus
  });
});

// POST /api/game/reset - Reset the in-memory database to initial state
router.post('/reset', (req, res) => {
  db.reset();
  res.status(200).json({
    success: true,
    message: 'Data store has been successfully reset to initial dataset.'
  });
});

module.exports = router;
