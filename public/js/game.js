/**
 * Pure Vanilla JavaScript Client-Side Controller
 * Educational Interactive Game for Learning HTTP & REST API
 * 
 * Note: All stage solutions and validation algorithms are strictly verified
 * on the server side! The client code contains NO solutions.
 */

(function () {
  'use strict';

  // Read stages passed securely from SSR EJS template
  let stages = [];
  try {
    const rawStages = document.getElementById('stages-data').textContent;
    stages = JSON.parse(rawStages);
  } catch (err) {
    console.error('Failed to parse stages data:', err);
    stages = [];
  }

  // Storage Key for LocalStorage Persistence
  const STORAGE_KEY = 'rest_learning_game_progress_v1';

  // Game State
  let currentStageIndex = 0;
  let attemptsCount = 0;
  let score = 0;
  const completedStages = new Set();

  // DOM Elements
  const stageIndicator = document.getElementById('current-stage-indicator');
  const stageTitle = document.getElementById('stage-title');
  const stageConcepts = document.getElementById('stage-concepts');
  const stageDesc = document.getElementById('stage-desc');
  const stageInstruction = document.getElementById('stage-instruction');
  const hintBox = document.getElementById('hint-box');
  const btnToggleHint = document.getElementById('btn-toggle-hint');
  const stageStepper = document.getElementById('stage-stepper');
  const progressBarFill = document.getElementById('progress-bar-fill');

  const attemptsCounter = document.getElementById('attempts-counter');
  const scoreCounter = document.getElementById('score-counter');
  const completedCounter = document.getElementById('completed-counter');

  const methodSelect = document.getElementById('http-method');
  const pathInput = document.getElementById('http-path');
  const queryParamsList = document.getElementById('query-params-list');
  const btnAddQueryParam = document.getElementById('btn-add-query-param');
  const requestBodySection = document.getElementById('request-body-container');
  const requestBodyInput = document.getElementById('request-body-input');
  const btnFormatJson = document.getElementById('btn-format-json');
  const jsonErrorMsg = document.getElementById('json-error-msg');
  const btnSendRequest = document.getElementById('btn-send-request');

  const verificationBanner = document.getElementById('verification-banner');
  const bannerIcon = document.getElementById('banner-icon');
  const bannerTitle = document.getElementById('banner-title');
  const bannerFeedback = document.getElementById('banner-feedback');
  const btnNextStage = document.getElementById('btn-next-stage');

  const responseStatusBadge = document.getElementById('response-status-badge');
  const responseMethod = document.getElementById('response-method');
  const responseEndpoint = document.getElementById('response-endpoint');
  const responseTime = document.getElementById('response-time');
  const responseBodyDisplay = document.getElementById('response-body-display');
  const btnCopyResponse = document.getElementById('btn-copy-response');

  const btnResetData = document.getElementById('btn-reset-data');
  const btnResetProgress = document.getElementById('btn-reset-progress');
  const btnRefreshPreview = document.getElementById('btn-refresh-preview');
  const productsTableContainer = document.getElementById('products-table-container');
  const reviewsTableContainer = document.getElementById('reviews-table-container');
  const productsCount = document.getElementById('products-count');
  const reviewsCount = document.getElementById('reviews-count');

  // Initialization
  function init() {
    loadProgress();
    setupEventListeners();
    loadStage(currentStageIndex);
    updateProgressUI();
    refreshServerDataPreview();
  }

  // LocalStorage Persistence Helpers
  function saveProgress() {
    try {
      const data = {
        completedStages: Array.from(completedStages),
        score: score,
        attemptsCount: attemptsCount,
        lastStageIndex: currentStageIndex
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save progress to localStorage:', e);
    }
  }

  // Check if a stage is unlocked (Stage 1 is always unlocked; Stage N unlocks only after Stage N-1 is completed)
  function isStageUnlocked(index) {
    if (index === 0) return true;
    if (index < 0 || index >= stages.length) return false;
    const stage = stages[index];
    if (completedStages.has(stage.id)) return true; // Already completed stages can be revisited
    const prevStage = stages[index - 1];
    return Boolean(prevStage && completedStages.has(prevStage.id));
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data.completedStages)) {
          data.completedStages.forEach((id) => completedStages.add(id));
        }
        if (typeof data.score === 'number') score = data.score;
        if (typeof data.attemptsCount === 'number') attemptsCount = data.attemptsCount;
        if (typeof data.lastStageIndex === 'number' && data.lastStageIndex >= 0 && data.lastStageIndex < stages.length) {
          if (isStageUnlocked(data.lastStageIndex)) {
            currentStageIndex = data.lastStageIndex;
          } else {
            let highest = 0;
            for (let i = 0; i < stages.length; i++) {
              if (isStageUnlocked(i)) highest = i;
              else break;
            }
            currentStageIndex = highest;
          }
        }
      }
    } catch (e) {
      console.warn('Could not load progress from localStorage:', e);
    }
  }

  function resetGameProgress() {
    if (confirm('האם לאפס את כל התקדמות המשחק, הניקוד והשלבים שהושלמו?')) {
      completedStages.clear();
      score = 0;
      attemptsCount = 0;
      currentStageIndex = 0;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}

      updateProgressUI();
      loadStage(0);
      alert('התקדמות המשחק אופסה בהצלחה!');
    }
  }

  function updateProgressUI() {
    if (scoreCounter) scoreCounter.textContent = score;
    if (attemptsCounter) attemptsCounter.textContent = attemptsCount;
    if (completedCounter) completedCounter.textContent = `${completedStages.size} / ${stages.length}`;

    if (progressBarFill) {
      const pct = stages.length > 0 ? Math.round((completedStages.size / stages.length) * 100) : 0;
      progressBarFill.style.width = `${pct}%`;
    }

    // Update stepper completed icons and lock states
    stages.forEach((stage, idx) => {
      const btn = document.getElementById(`stage-step-${stage.id}`);
      if (btn) {
        const isCompleted = completedStages.has(stage.id);
        const isUnlocked = isStageUnlocked(idx);

        btn.classList.toggle('completed', isCompleted);
        btn.classList.toggle('locked', !isUnlocked);
        btn.disabled = !isUnlocked;

        if (!isUnlocked) {
          btn.setAttribute('title', `🔒 שלב ${stage.id} נעול (יש להשלים קודם את שלב ${stages[idx - 1].id})`);
        } else if (isCompleted) {
          btn.setAttribute('title', `✅ שלב ${stage.id} (הושלם)`);
        } else {
          btn.setAttribute('title', `שלב ${stage.id}`);
        }
      }
    });
  }

  function setupEventListeners() {
    // Stage navigation stepper (allows clicking only unlocked stages)
    if (stageStepper) {
      stageStepper.addEventListener('click', (e) => {
        const btn = e.target.closest('.stage-step-btn');
        if (btn) {
          const stageId = parseInt(btn.dataset.stage, 10);
          const idx = stages.findIndex((s) => s.id === stageId);
          if (idx !== -1) {
            if (!isStageUnlocked(idx)) {
              alert(`🔒 שלב ${stageId} נעול! עליך להשלים בהצלחה את שלב ${stages[idx - 1].id} כדי להתקדם.`);
              return;
            }
            loadStage(idx);
          }
        }
      });
    }

    // Toggle Hint
    if (btnToggleHint) {
      btnToggleHint.addEventListener('click', () => {
        if (hintBox) hintBox.classList.toggle('hidden');
      });
    }

    // Add Query Param Row
    if (btnAddQueryParam) {
      btnAddQueryParam.addEventListener('click', () => {
        addQueryParamRow('', '');
      });
    }

    // Remove Query Param Row
    if (queryParamsList) {
      queryParamsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove-param')) {
          e.target.closest('.param-row').remove();
        }
      });
    }

    // Format JSON
    if (btnFormatJson) {
      btnFormatJson.addEventListener('click', () => {
        try {
          const text = requestBodyInput.value.trim();
          if (text) {
            const parsed = JSON.parse(text);
            requestBodyInput.value = JSON.stringify(parsed, null, 2);
            if (jsonErrorMsg) jsonErrorMsg.classList.add('hidden');
          }
        } catch (e) {
          if (jsonErrorMsg) jsonErrorMsg.classList.remove('hidden');
        }
      });
    }

    // Send HTTP Request (AJAX)
    if (btnSendRequest) {
      btnSendRequest.addEventListener('click', handleSendRequest);
    }

    // Next Stage
    if (btnNextStage) {
      btnNextStage.addEventListener('click', () => {
        if (currentStageIndex + 1 < stages.length) {
          loadStage(currentStageIndex + 1);
        } else {
          alert('🎉 כל הכבוד! השלמת את כל שלבי המשחק בהצלחה!');
        }
      });
    }

    // Reset Data (Database reset to initial JSON)
    if (btnResetData) {
      btnResetData.addEventListener('click', async () => {
        if (confirm('האם לאפס את נתוני השרת למצבם ההתחלתי?')) {
          try {
            const res = await fetch('/api/game/reset', { method: 'POST' });
            const json = await res.json();
            alert(json.message);
            refreshServerDataPreview();
          } catch (err) {
            alert('שגיאה באיפוס הנתונים: ' + err.message);
          }
        }
      });
    }

    // Reset Game Progress
    if (btnResetProgress) {
      btnResetProgress.addEventListener('click', resetGameProgress);
    }

    // Refresh Server Preview
    if (btnRefreshPreview) {
      btnRefreshPreview.addEventListener('click', refreshServerDataPreview);
    }

    // Copy Response JSON
    if (btnCopyResponse) {
      btnCopyResponse.addEventListener('click', () => {
        const code = responseBodyDisplay.textContent;
        navigator.clipboard.writeText(code).then(() => {
          btnCopyResponse.textContent = '✅ הועתק!';
          setTimeout(() => {
            btnCopyResponse.textContent = '📋 העתק';
          }, 2000);
        });
      });
    }

    // Dynamic method switch styling
    if (methodSelect) {
      methodSelect.addEventListener('change', updateMethodColor);
    }
  }

  // Load a stage
  function loadStage(index) {
    if (index < 0 || index >= stages.length) return;
    if (!isStageUnlocked(index)) {
      console.warn(`Stage ${stages[index].id} is locked.`);
      return;
    }
    currentStageIndex = index;
    const stage = stages[index];

    // Update Stage mission info
    if (stageIndicator) stageIndicator.textContent = `שלב ${stage.id} מתוך ${stages.length}`;
    if (stageTitle) stageTitle.textContent = stage.title;
    if (stageDesc) stageDesc.textContent = stage.description;
    if (stageInstruction) stageInstruction.textContent = stage.instruction;

    if (hintBox) {
      const hintSpan = hintBox.querySelector('span');
      if (hintSpan) hintSpan.textContent = stage.hint;
      hintBox.classList.add('hidden');
    }

    // Update Concepts tags
    if (stageConcepts) {
      stageConcepts.innerHTML = '';
      (stage.concepts || []).forEach((c) => {
        const span = document.createElement('span');
        span.className = 'concept-tag';
        span.textContent = c;
        stageConcepts.appendChild(span);
      });
    }

    // Update Stepper Active State
    document.querySelectorAll('.stage-step-btn').forEach((btn) => {
      const id = parseInt(btn.dataset.stage, 10);
      btn.classList.toggle('active', id === stage.id);
      btn.classList.toggle('completed', completedStages.has(id));
    });

    // Reset Banner to Pending
    resetBanner();

    // Prepare clean form for user assembly (NO solutions pre-filled!)
    resetFormForStage(stage);

    // Save active stage index to persistence
    saveProgress();
  }

  /**
   * Reset the Request Builder to a clean state for the user to assemble.
   * Note: The client NEVER contains stage solutions! The user constructs the request.
   */
  function resetFormForStage(stage) {
    if (queryParamsList) queryParamsList.innerHTML = '';
    if (jsonErrorMsg) jsonErrorMsg.classList.add('hidden');

    // Default method to GET
    if (methodSelect) methodSelect.value = 'GET';

    // Standard baseline REST path
    if (pathInput) pathInput.value = '/api/products';

    // Empty Request Body with helpful placeholder
    if (requestBodyInput) {
      requestBodyInput.value = '';
      if (stage.requiresBody) {
        requestBodyInput.placeholder = '{\n  // הקלד כאן את גוף הבקשה בפורמט JSON\n}';
      } else {
        requestBodyInput.placeholder = '(בשלב זה אין צורך ב-Request Body)';
      }
    }

    updateMethodColor();
  }

  function addQueryParamRow(key = '', value = '') {
    if (!queryParamsList) return;
    const row = document.createElement('div');
    row.className = 'param-row';
    row.innerHTML = `
      <input type="text" class="input-text code-font param-key" placeholder="Key (למשל category)" value="${escapeHtml(key)}">
      <input type="text" class="input-text code-font param-value" placeholder="Value (למשל Books)" value="${escapeHtml(value)}">
      <button type="button" class="btn-remove-param" title="הסר פרמטר">✕</button>
    `;
    queryParamsList.appendChild(row);
  }

  function updateMethodColor() {
    if (!methodSelect) return;
    const method = methodSelect.value;
    const colors = {
      GET: '#388bfd',
      POST: '#3fb950',
      PUT: '#d29922',
      PATCH: '#a371f7',
      DELETE: '#f85149'
    };
    methodSelect.style.color = colors[method] || '#fff';
  }

  function resetBanner() {
    if (!verificationBanner) return;
    verificationBanner.className = 'verification-banner pending';
    if (bannerIcon) bannerIcon.textContent = 'ℹ️';
    if (bannerTitle) bannerTitle.textContent = 'ממתין לשליחת בקשה';
    if (bannerFeedback) {
      bannerFeedback.textContent =
        'הרכב את הבקשה המתאימה לשלב הנוכחי ולחץ על "שלח בקשת HTTP לשרת".';
    }
    if (btnNextStage) btnNextStage.classList.add('hidden');
  }

  // Main AJAX Action: Send Real HTTP Request & Verify against Server
  async function handleSendRequest() {
    const currentStage = stages[currentStageIndex];
    if (!currentStage) return;

    const method = methodSelect.value;
    let path = pathInput.value.trim();
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    // Parse Query Params from UI
    const queryParams = {};
    const paramRows = queryParamsList ? queryParamsList.querySelectorAll('.param-row') : [];
    const urlParams = new URLSearchParams();

    paramRows.forEach((row) => {
      const k = row.querySelector('.param-key').value.trim();
      const v = row.querySelector('.param-value').value.trim();
      if (k) {
        queryParams[k] = v;
        urlParams.append(k, v);
      }
    });

    // Construct full URL path with query params
    let queryString = urlParams.toString();
    let fullRequestUrl = path;
    if (queryString) {
      fullRequestUrl += (path.includes('?') ? '&' : '?') + queryString;
    }

    // Parse Request Body (if any)
    let parsedBody = null;
    const bodyText = requestBodyInput.value.trim();
    if (bodyText && method !== 'GET' && method !== 'DELETE') {
      try {
        parsedBody = JSON.parse(bodyText);
        if (jsonErrorMsg) jsonErrorMsg.classList.add('hidden');
      } catch (err) {
        if (jsonErrorMsg) jsonErrorMsg.classList.remove('hidden');
        alert('שגיאת תחביר JSON בגוף הבקשה (Request Body). תקן את ה-JSON ונסה שוב.');
        return;
      }
    }

    // Track attempt
    attemptsCount++;
    if (attemptsCounter) attemptsCounter.textContent = attemptsCount;

    // Send Actual Real HTTP Request to REST API
    // CRITICAL REQUIREMENT: "בכל בקשה במסגרת המשחק יישלח לשרת גם מזהה השלב הנוכחי"
    const startTime = performance.now();
    let responseObj = null;
    let responseStatus = 0;

    try {
      const fetchOptions = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Stage-Id': String(currentStage.id) // Pass current stage ID directly in request headers!
        }
      };
      if (parsedBody) {
        fetchOptions.body = JSON.stringify(parsedBody);
      }

      const rawResponse = await fetch(fullRequestUrl, fetchOptions);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      responseStatus = rawResponse.status;
      try {
        responseObj = await rawResponse.json();
      } catch (e) {
        responseObj = { raw: await rawResponse.text() };
      }

      // Update Response Meta & Body in UI
      renderResponse(method, fullRequestUrl, responseStatus, duration, responseObj);

      // Server verification evaluation
      let verifyData = null;
      const stageValidHeader = rawResponse.headers.get('X-Stage-Valid');
      const stageFeedbackHeader = rawResponse.headers.get('X-Stage-Feedback');

      if (stageValidHeader !== null && stageFeedbackHeader !== null) {
        // Verification result received directly from request headers evaluated by server middleware!
        verifyData = {
          stageId: currentStage.id,
          isCorrect: stageValidHeader === 'true',
          feedback: decodeURIComponent(stageFeedbackHeader)
        };
      } else {
        // Fallback: dedicated verification endpoint
        const verifyRes = await fetch('/api/game/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stageId: currentStage.id,
            method: method,
            path: fullRequestUrl,
            query: queryParams,
            body: parsedBody
          })
        });
        verifyData = await verifyRes.json();
      }

      handleVerificationResult(verifyData, currentStage);
      saveProgress();

      // Refresh Live Server Preview data (reflect live changes)
      refreshServerDataPreview();
    } catch (err) {
      const endTime = performance.now();
      renderResponse(method, fullRequestUrl, 500, Math.round(endTime - startTime), {
        error: err.message
      });
      if (verificationBanner) verificationBanner.className = 'verification-banner error';
      if (bannerIcon) bannerIcon.textContent = '❌';
      if (bannerTitle) bannerTitle.textContent = 'שגיאת תקשורת';
      if (bannerFeedback) {
        bannerFeedback.textContent =
          'אירעה שגיאה בביצוע בקשת ה-HTTP לשרת: ' + err.message;
      }
    }
  }

  function renderResponse(method, endpoint, status, duration, data) {
    if (responseMethod) responseMethod.textContent = method;
    if (responseEndpoint) responseEndpoint.textContent = endpoint;
    if (responseTime) responseTime.textContent = `${duration} ms`;

    // Status Badge
    if (responseStatusBadge) {
      responseStatusBadge.textContent = `${status} ${getStatusText(status)}`;
      responseStatusBadge.className = 'status-badge';
      if (status >= 200 && status < 300) {
        responseStatusBadge.classList.add('status-2xx');
      } else if (status >= 400 && status < 500) {
        responseStatusBadge.classList.add('status-4xx');
      } else {
        responseStatusBadge.classList.add('status-5xx');
      }
    }

    // Body
    if (responseBodyDisplay) {
      responseBodyDisplay.textContent = JSON.stringify(data, null, 2);
    }
  }

  function getStatusText(code) {
    const map = {
      200: 'OK',
      201: 'Created',
      204: 'No Content',
      400: 'Bad Request',
      404: 'Not Found',
      500: 'Internal Server Error'
    };
    return map[code] || '';
  }

  function handleVerificationResult(verifyData, currentStage) {
    if (!verificationBanner) return;

    if (verifyData.isCorrect) {
      // SUCCESS
      verificationBanner.className = 'verification-banner success';
      if (bannerIcon) bannerIcon.textContent = '🎉';
      if (bannerTitle) bannerTitle.textContent = 'פתרון נכון!';
      if (bannerFeedback) bannerFeedback.textContent = verifyData.feedback;

      if (!completedStages.has(currentStage.id)) {
        completedStages.add(currentStage.id);
        score += 100;
      }

      updateProgressUI();

      if (btnNextStage) {
        if (currentStageIndex + 1 < stages.length) {
          btnNextStage.classList.remove('hidden');
          btnNextStage.textContent = `עבור לשלב ${stages[currentStageIndex + 1].id} ⬅️`;
        } else {
          btnNextStage.classList.remove('hidden');
          btnNextStage.textContent = '🏆 סיום המשחק! כל הכבוד!';
        }
      }
    } else {
      // ERROR / WRONG ATTEMPT
      verificationBanner.className = 'verification-banner error';
      if (bannerIcon) bannerIcon.textContent = '⚠️';
      if (bannerTitle) bannerTitle.textContent = 'פתרון שגוי, נסה שוב!';
      if (bannerFeedback) bannerFeedback.textContent = verifyData.feedback;
      if (btnNextStage) btnNextStage.classList.add('hidden');
    }
  }

  // Synchronize Live Server Data Preview
  async function refreshServerDataPreview() {
    try {
      const [prodRes, revRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/reviews')
      ]);

      const prods = await prodRes.json();
      const revs = await revRes.json();

      const prodList = prods.data || [];
      const revList = revs.data || [];

      if (productsCount) productsCount.textContent = prodList.length;
      if (reviewsCount) reviewsCount.textContent = revList.length;

      // Render Products Table
      if (productsTableContainer) {
        if (prodList.length === 0) {
          productsTableContainer.innerHTML =
            '<p style="padding: 1rem; color: var(--text-muted);">אין מוצרים בשרת כרגע.</p>';
        } else {
          let pHtml = `
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>שם מוצר</th>
                  <th>קטגוריה</th>
                  <th>מחיר</th>
                  <th>מלאי</th>
                </tr>
              </thead>
              <tbody>
          `;
          prodList.forEach((p) => {
            pHtml += `
              <tr>
                <td class="code-font font-bold">#${p.id}</td>
                <td>${escapeHtml(p.name)}</td>
                <td><span class="type-pill string">${escapeHtml(p.category)}</span></td>
                <td class="code-font">$${Number(p.price).toFixed(2)}</td>
                <td>${p.inStock ? '✅ במלאי' : '❌ אזל'}</td>
              </tr>
            `;
          });
          pHtml += '</tbody></table>';
          productsTableContainer.innerHTML = pHtml;
        }
      }

      // Render Reviews Table
      if (reviewsTableContainer) {
        if (revList.length === 0) {
          reviewsTableContainer.innerHTML =
            '<p style="padding: 1rem; color: var(--text-muted);">אין ביקורות בשרת כרגע.</p>';
        } else {
          let rHtml = `
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>מוצר</th>
                  <th>כותב/ת</th>
                  <th>דירוג</th>
                  <th>תגובה</th>
                </tr>
              </thead>
              <tbody>
          `;
          revList.forEach((r) => {
            const stars = '⭐'.repeat(Math.max(1, Math.min(5, r.rating || 5)));
            rHtml += `
              <tr>
                <td class="code-font font-bold">#${r.id}</td>
                <td class="code-font">מוצר #${r.productId}</td>
                <td>${escapeHtml(r.author)}</td>
                <td>${stars} (${r.rating}/5)</td>
                <td style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${escapeHtml(r.comment)}
                </td>
              </tr>
            `;
          });
          rHtml += '</tbody></table>';
          reviewsTableContainer.innerHTML = rHtml;
        }
      }
    } catch (e) {
      console.error('Error refreshing server data preview:', e);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Start app on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', init);
})();
