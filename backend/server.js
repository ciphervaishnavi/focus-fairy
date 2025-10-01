const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
// Allow overriding model via env; default to a widely available chat model
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

// Base API host and dynamic API version detection (some keys only support v1beta)
const BASE_URL = 'https://generativelanguage.googleapis.com';
let API_VERSION = null; // 'v1' or 'v1beta'
let RESOLVED_MODEL = null; // cache selected model for session

async function detectApiVersion() {
  if (API_VERSION) return API_VERSION;
  const tryVersions = ['v1', 'v1beta'];
  for (const ver of tryVersions) {
    try {
      const r = await fetch(`${BASE_URL}/${ver}/models?key=${process.env.GEMINI_API_KEY}`);
      const data = await r.json();
      if (r.ok && data.models) {
        API_VERSION = ver;
        return API_VERSION;
      }
    } catch (_) {
      // ignore and try next
    }
  }
  // default to v1 if detection failed (network?), code will still handle errors
  API_VERSION = 'v1';
  return API_VERSION;
}

async function listAvailableModels() {
  const ver = await detectApiVersion();
  const r = await fetch(`${BASE_URL}/${ver}/models?key=${process.env.GEMINI_API_KEY}`);
  return r.json();
}

async function resolveModel(forceRefresh = false) {
  // If user pinned a model, use it as-is
  if (process.env.GEMINI_MODEL && !forceRefresh) return process.env.GEMINI_MODEL;
  if (RESOLVED_MODEL && !forceRefresh) return RESOLVED_MODEL;

  const data = await listAvailableModels();
  const models = data.models || [];
  // Prefer models in this order, suffix 'latest' often required on v1
  const preferred = [
    // Prefer latest stable, fast chat models first
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-001',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash-lite-001',
    // Older family names as fallbacks
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro',
    'gemini-pro',
  ];

  // Filter by supported methods when present
  function supportsGenerate(m) {
    return !m.supportedGenerationMethods || m.supportedGenerationMethods.includes('generateContent');
  }

  // Try preferred names first
  for (const name of preferred) {
    const found = models.find(m => m.name === `models/${name}` && supportsGenerate(m));
    if (found) {
      RESOLVED_MODEL = name;
      return RESOLVED_MODEL;
    }
  }

  // Otherwise pick the first model that supports generateContent
  const anyGen = models.find(m => supportsGenerate(m));
  if (anyGen) {
    RESOLVED_MODEL = anyGen.name.replace(/^models\//, '');
    return RESOLVED_MODEL;
  }

  // Last resort: return default (may still 404 but we'll error clearly)
  RESOLVED_MODEL = MODEL_NAME;
  return RESOLVED_MODEL;
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Focus Fairy Backend is running! 🧚‍♀️✨',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    fairy: '🧚‍♀️',
    message: 'All fairy magic systems operational!'
  });
});

// Status endpoint to report detected API version and chosen model
app.get('/status', async (req, res) => {
  try {
    const ver = await detectApiVersion();
    const model = await resolveModel(false);
    res.json({ apiVersion: ver, model });
  } catch (e) {
    res.status(500).json({ error: 'Failed to resolve status' });
  }
});

// List available models for this API key (useful for debugging 404 model errors)
app.get('/models', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    const r = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    console.error('List models error:', e);
    res.status(500).json({ error: 'Failed to list models' });
  }
});

// System prompt for the fairy personality
const FAIRY_SYSTEM_PROMPT = "You are a cute, magical focus fairy 🧚 who helps the user stay productive with gentle encouragement, sparkles, and emojis. Your responses should be:\n1. Brief and cheerful (1-2 sentences)\n2. Include at least one emoji\n3. Encouraging and supportive\n4. Playful but not distracting\n5. Focus on productivity and well-being";

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required',
        response: "I didn't hear anything! Can you try again? 🧚‍♀️" 
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'API key not configured',
        response: "My fairy magic needs to be configured first! 🔮" 
      });
    }
    
    // Detect API version and select a working model
    const apiVer = await detectApiVersion();
    let modelTried = await resolveModel(false);
    let endpoint = `${BASE_URL}/${apiVer}/models/${modelTried}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    let response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: `${FAIRY_SYSTEM_PROMPT}\n\nUser: ${message}\n\nFairy:` }]
        }]
      })
    });

    // If model not found (404), try a lightweight fallback model
    let data = await response.json();
    if (!response.ok && response.status === 404) {
      // Refresh discovery one time and retry with discovered best match
      console.warn(`Model ${modelTried} not found for ${apiVer}. Refreshing model list and retrying...`);
      const refreshed = await resolveModel(true);
      if (refreshed && refreshed !== modelTried) {
        modelTried = refreshed;
        endpoint = `${BASE_URL}/${apiVer}/models/${modelTried}:generateContent?key=${process.env.GEMINI_API_KEY}`;
        response = await fetch(endpoint, {
        method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: `${FAIRY_SYSTEM_PROMPT}\n\nUser: ${message}\n\nFairy:` }] }]
          })
        });
        data = await response.json();
      }
    }
    
    if (!response.ok) {
      console.error('API Error:', response.status, data);
      throw new Error(`API request failed: ${response.status} - ${data.error?.message || 'Unknown error'} (model: ${modelTried}, endpoint: ${endpoint})`);
    }

    // Extract the fairy's response from Gemini's output
    let fairyResponse = "Something magical happened, but I couldn't understand it! ✨";
    
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      fairyResponse = data.candidates[0].content.parts[0].text.trim();
    } else if (data.error) {
      console.error('Gemini API Error:', data.error);
      throw new Error(`Gemini API Error: ${data.error.message}`);
    }
    
    res.json({ response: fairyResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Something went wrong',
      response: "Oh no! My fairy magic isn't working right now! Try asking me something simple! 🎭" 
    });
  }
});

app.listen(port, () => {
  console.log("✨ Focus Fairy backend is listening on port " + port);
});