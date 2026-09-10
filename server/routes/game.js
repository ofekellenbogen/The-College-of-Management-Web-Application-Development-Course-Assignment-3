const express = require('express');
const router = express.Router();
const { gameStages, getClientStages, validateStageRequest } = require('../gameConfig');
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

  const result = validateStageRequest(stageId, {
    method,
    path: reqPath,
    query,
    body
  }, db);

  if (!result.found) {
    return res.status(404).json({
      success: false,
      message: result.feedback
    });
  }

  res.status(200).json({
    stageId: result.stageId,
    isCorrect: result.isCorrect,
    feedback: result.feedback,
    expectedStatus: result.expectedStatus
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
