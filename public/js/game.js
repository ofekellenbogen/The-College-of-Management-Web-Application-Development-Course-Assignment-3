/**
 * Pure Vanilla JavaScript Client-Side Controller
 * Handles AJAX requests, UI updates, query params builder, and server state synchronizer
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

  // State
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
  const btnRefreshPreview = document.getElementById('btn-refresh-preview');
  const productsTableContainer = document.getElementById('products-table-container');
  const reviewsTableContainer = document.getElementById('reviews-table-container');
  const productsCount = document.getElementById('products-count');
  const reviewsCount = document.getElementById('reviews-count');

  // Initialization
  function init() {
    setupEventListeners();
    loadStage(0);
    refreshServerDataPreview();
  }

  function setupEventListeners() {
    // Stage navigation stepper
    stageStepper.addEventListener('click', (e) => {
      const btn = e.target.closest('.stage-step-btn');
      if (btn) {
        const stageId = parseInt(btn.dataset.stage, 10);
        const idx = stages.findIndex((s) => s.id === stageId);
        if (idx !== -1) {
          loadStage(idx);
        }
      }
    });

    // Toggle Hint
    btnToggleHint.addEventListener('click', () => {
      hintBox.classList.toggle('hidden');
    });

    // Add Query Param Row
    btnAddQueryParam.addEventListener('click', () => {
      addQueryParamRow('', '');
    });

    // Remove Query Param Row
    queryParamsList.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-remove-param')) {
        e.target.closest('.param-row').remove();
      }
    });

    // Format JSON
    btnFormatJson.addEventListener('click', () => {
      try {
        const text = requestBodyInput.value.trim();
        if (text) {
          const parsed = JSON.parse(text);
          requestBodyInput.value = JSON.stringify(parsed, null, 2);
          jsonErrorMsg.classList.add('hidden');
        }
      } catch (e) {
        jsonErrorMsg.classList.remove('hidden');
      }
    });

    // Send HTTP Request (AJAX)
    btnSendRequest.addEventListener('click', handleSendRequest);

    // Next Stage
    btnNextStage.addEventListener('click', () => {
      if (currentStageIndex + 1 < stages.length) {
        loadStage(currentStageIndex + 1);
      } else {
        alert('🎉 כל הכבוד! השלמת את כל שלבי המשחק בהצלחה!');
      }
    });

    // Reset Data
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

    // Refresh Server Preview
    btnRefreshPreview.addEventListener('click', refreshServerDataPreview);

    // Copy Response JSON
    btnCopyResponse.addEventListener('click', () => {
      const code = responseBodyDisplay.textContent;
      navigator.clipboard.writeText(code).then(() => {
        btnCopyResponse.textContent = '✅ הועתק!';
        setTimeout(() => {
          btnCopyResponse.textContent = '📋 העתק';
        }, 2000);
      });
    });

    // Dynamic method switch styling
    methodSelect.addEventListener('change', updateMethodColor);
  }

  // Load a stage
  function loadStage(index) {
    if (index < 0 || index >= stages.length) return;
    currentStageIndex = index;
    const stage = stages[index];

    // Update Stage mission info
    stageIndicator.textContent = `שלב ${stage.id} מתוך ${stages.length}`;
    stageTitle.textContent = stage.title;
    stageDesc.textContent = stage.description;
    stageInstruction.textContent = stage.instruction;
    hintBox.querySelector('span').textContent = stage.hint;
    hintBox.classList.add('hidden');

    // Update Concepts tags
    stageConcepts.innerHTML = '';
    (stage.concepts || []).forEach((c) => {
      const span = document.createElement('span');
      span.className = 'concept-tag';
      span.textContent = c;
      stageConcepts.appendChild(span);
    });

    // Update Stepper Active State
    document.querySelectorAll('.stage-step-btn').forEach((btn) => {
      const id = parseInt(btn.dataset.stage, 10);
      btn.classList.toggle('active', id === stage.id);
      btn.classList.toggle('completed', completedStages.has(id));
    });

    // Reset Banner to Pending
    resetBanner();

    // Smart Preset for Request Builder to be user friendly
    presetFormForStage(stage);
  }

  function presetFormForStage(stage) {
    // Clear query params list
    queryParamsList.innerHTML = '';
    jsonErrorMsg.classList.add('hidden');

    if (stage.id === 1) {
      methodSelect.value = 'GET';
      pathInput.value = '/api/products';
      requestBodyInput.value = '';
    } else if (stage.id === 2) {
      methodSelect.value = 'GET';
      pathInput.value = '/api/products/1';
      requestBodyInput.value = '';
    } else if (stage.id === 3) {
      methodSelect.value = 'GET';
      pathInput.value = '/api/products/999';
      requestBodyInput.value = '';
    } else if (stage.id === 4) {
      methodSelect.value = 'GET';
      pathInput.value = '/api/products';
      addQueryParamRow('category', 'Electronics');
      requestBodyInput.value = '';
    } else if (stage.id === 5) {
      methodSelect.value = 'GET';
      pathInput.value = '/api/products';
      addQueryParamRow('category', 'Books');
      addQueryParamRow('sortBy', 'price');
      addQueryParamRow('order', 'asc');
      requestBodyInput.value = '';
    } else if (stage.id === 6) {
      methodSelect.value = 'POST';
      pathInput.value = '/api/products';
      requestBodyInput.value = JSON.stringify(
        {
          name: 'Node.js in Action',
          category: 'Books',
          price: 34.0,
          inStock: true
        },
        null,
        2
      );
    } else if (stage.id === 7) {
      methodSelect.value = 'PATCH';
      pathInput.value = '/api/products/4';
      requestBodyInput.value = JSON.stringify(
        {
          price: 69.99
        },
        null,
        2
      );
    } else if (stage.id === 8) {
      methodSelect.value = 'DELETE';
      pathInput.value = '/api/products/7';
      requestBodyInput.value = '';
    } else if (stage.id === 9) {
      methodSelect.value = 'GET';
      pathInput.value = '/api/products/1/reviews';
      requestBodyInput.value = '';
    } else if (stage.id === 10) {
      methodSelect.value = 'POST';
      pathInput.value = '/api/products/2/reviews';
      requestBodyInput.value = JSON.stringify(
        {
          author: 'Dana Ron',
          rating: 5,
          comment: 'Must have for developers!'
        },
        null,
        2
      );
    }

    updateMethodColor();
  }

  function addQueryParamRow(key = '', value = '') {
    const row = document.createElement('div');
    row.className = 'param-row';
    row.innerHTML = `
      <input type="text" class="input-text code-font param-key" placeholder="Key (למשל category)" value="${key}">
      <input type="text" class="input-text code-font param-value" placeholder="Value (למשל Books)" value="${value}">
      <button type="button" class="btn-remove-param" title="הסר פרמטר">✕</button>
    `;
    queryParamsList.appendChild(row);
  }

  function updateMethodColor() {
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
    verificationBanner.className = 'verification-banner pending';
    bannerIcon.textContent = 'ℹ️';
    bannerTitle.textContent = 'ממתין לשליחת בקשה';
    bannerFeedback.textContent =
      'הרכב את הבקשה המתאימה לשלב הנוכחי ולחץ על "שלח בקשת HTTP לשרת".';
    btnNextStage.classList.add('hidden');
  }

  // Main AJAX Action: Send Request & Verify against Server
  async function handleSendRequest() {
    const method = methodSelect.value;
    let path = pathInput.value.trim();
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    // Parse Query Params from UI
    const queryParams = {};
    const paramRows = queryParamsList.querySelectorAll('.param-row');
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
        jsonErrorMsg.classList.add('hidden');
      } catch (err) {
        jsonErrorMsg.classList.remove('hidden');
        alert('שגיאת תחביר JSON בגוף הבקשה (Request Body). תקן את ה-JSON ונסה שוב.');
        return;
      }
    }

    // Track attempt
    attemptsCount++;
    attemptsCounter.textContent = attemptsCount;

    // Send Actual Real HTTP Request to REST API
    const startTime = performance.now();
    let responseObj = null;
    let responseStatus = 0;

    try {
      const fetchOptions = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
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

      // Now send Verification Request to Server
      const currentStage = stages[currentStageIndex];
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

      const verifyData = await verifyRes.json();
      handleVerificationResult(verifyData, currentStage);

      // Refresh Live Server Preview data (reflect live changes)
      refreshServerDataPreview();
    } catch (err) {
      const endTime = performance.now();
      renderResponse(method, fullRequestUrl, 500, Math.round(endTime - startTime), {
        error: err.message
      });
      verificationBanner.className = 'verification-banner error';
      bannerIcon.textContent = '❌';
      bannerTitle.textContent = 'שגיאת תקשורת';
      bannerFeedback.textContent =
        'אירעה שגיאה בביצוע בקשת ה-HTTP לשרת: ' + err.message;
    }
  }

  function renderResponse(method, endpoint, status, duration, data) {
    responseMethod.textContent = method;
    responseEndpoint.textContent = endpoint;
    responseTime.textContent = `${duration} ms`;

    // Status Badge
    responseStatusBadge.textContent = `${status} ${getStatusText(status)}`;
    responseStatusBadge.className = 'status-badge';
    if (status >= 200 && status < 300) {
      responseStatusBadge.classList.add('status-2xx');
    } else if (status >= 400 && status < 500) {
      responseStatusBadge.classList.add('status-4xx');
    } else {
      responseStatusBadge.classList.add('status-5xx');
    }

    // Body
    responseBodyDisplay.textContent = JSON.stringify(data, null, 2);
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
    if (verifyData.isCorrect) {
      // SUCCESS
      verificationBanner.className = 'verification-banner success';
      bannerIcon.textContent = '🎉';
      bannerTitle.textContent = 'פתרון נכון!';
      bannerFeedback.textContent = verifyData.feedback;

      if (!completedStages.has(currentStage.id)) {
        completedStages.add(currentStage.id);
        score += 100;
        scoreCounter.textContent = score;
        completedCounter.textContent = `${completedStages.size} / ${stages.length}`;
        const pct = Math.round((completedStages.size / stages.length) * 100);
        progressBarFill.style.width = `${pct}%`;

        // Update stepper icon
        const btn = document.getElementById(`stage-step-${currentStage.id}`);
        if (btn) btn.classList.add('completed');
      }

      if (currentStageIndex + 1 < stages.length) {
        btnNextStage.classList.remove('hidden');
        btnNextStage.textContent = `עבור לשלב ${stages[currentStageIndex + 1].id} ⬅️`;
      } else {
        btnNextStage.classList.remove('hidden');
        btnNextStage.textContent = '🏆 סיום המשחק!';
      }
    } else {
      // ERROR / WRONG ATTEMPT
      verificationBanner.className = 'verification-banner error';
      bannerIcon.textContent = '⚠️';
      bannerTitle.textContent = 'פתרון שגוי, נסה שוב!';
      bannerFeedback.textContent = verifyData.feedback;
      btnNextStage.classList.add('hidden');
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

      productsCount.textContent = prodList.length;
      reviewsCount.textContent = revList.length;

      // Render Products Table
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
              <td class="code-font">$${p.price.toFixed(2)}</td>
              <td>${p.inStock ? '✅ במלאי' : '❌ אזל'}</td>
            </tr>
          `;
        });
        pHtml += '</tbody></table>';
        productsTableContainer.innerHTML = pHtml;
      }

      // Render Reviews Table
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
          rHtml += `
            <tr>
              <td class="code-font font-bold">#${r.id}</td>
              <td class="code-font">מוצר #${r.productId}</td>
              <td>${escapeHtml(r.author)}</td>
              <td>${'⭐'.repeat(r.rating)} (${r.rating}/5)</td>
              <td style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${escapeHtml(r.comment)}
              </td>
            </tr>
          `;
        });
        rHtml += '</tbody></table>';
        reviewsTableContainer.innerHTML = rHtml;
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

  // Start app
  document.addEventListener('DOMContentLoaded', init);
})();
