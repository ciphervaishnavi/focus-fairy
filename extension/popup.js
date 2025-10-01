let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;

// Fallback fairy responses when API is not available
const fallbackResponses = [
  "I believe in you! You've got this!",
  "Take a deep breath and focus on one task at a time!",
  "Remember why you started - you're doing amazing!",
  "Small steps lead to big achievements! Keep going!",
  "You're stronger than any distraction! Stay focused!",
  "Break time? Make sure to rest those beautiful eyes!",
  "Hydrate and celebrate small wins! You deserve it!",
  "Focus is like a muscle - the more you use it, the stronger it gets!"
];

function getRandomFallbackResponse() {
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

// Chat functionality
function initPopup() {
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-message');
  const chatMessages = document.getElementById('chat-messages');
  const startTimer = document.getElementById('start-timer');
  const pauseTimer = document.getElementById('pause-timer');
  const resetTimer = document.getElementById('reset-timer');
  const timerDisplay = document.getElementById('timer');
  const statusEl = document.getElementById('backend-status');

  // If core elements are missing, build a minimal UI so the user still sees messages
  if (!chatMessages || !chatInput || !sendButton) {
    const container = document.createElement('div');
    container.style.padding = '12px';
    container.innerHTML = `
      <div id="chat-messages" style="height:200px;overflow:auto;border:1px solid #eee;border-radius:8px;padding:8px;margin-bottom:8px"></div>
      <div style="display:flex;gap:6px">
        <input id="chat-input" style="flex:1;padding:8px;border:1px solid #ccc;border-radius:8px" placeholder="Ask your fairy..."/>
        <button id="send-message" style="padding:8px 12px;border:none;border-radius:8px;background:#ffb7eb;cursor:pointer">Send</button>
      </div>`;
    document.body.appendChild(container);
  }

  // Re-query to ensure we have the nodes
  const _chatMessages = document.getElementById('chat-messages');
  const _chatInput = document.getElementById('chat-input');
  const _sendButton = document.getElementById('send-message');
  if (!_chatMessages || !_chatInput || !_sendButton) {
    // Hard fail fallback
    const err = document.createElement('div');
    err.textContent = "I couldn't load our chat UI. Please reload the extension.";
    document.body.appendChild(err);
    return;
  }

  // Initialize dark mode
  initDarkMode();

  // Initialize with a welcome message and check backend status
  addMessage("Hi! I'm your Focus Fairy! How can I help you stay focused today?", 'fairy');

  // Fetch helper with timeout
  const fetchWithTimeout = (url, options = {}, timeoutMs = 6000) => {
    return new Promise((resolve, reject) => {
      const id = setTimeout(() => reject(new Error('timeout')), timeoutMs);
      fetch(url, options).then(
        (res) => { clearTimeout(id); resolve(res); },
        (err) => { clearTimeout(id); reject(err); }
      );
    });
  };

  // Check if backend is available (quick health check)
  fetchWithTimeout('http://localhost:3000/health')
    .then(r => r.json())
    .then(data => {
      if (statusEl) {
        statusEl.textContent = 'Online';
        statusEl.classList.remove('status-offline');
        statusEl.classList.add('status-online');
      }
      addMessage("Great news! I'm connected to my full magical powers!", 'fairy');
    })
    .catch(() => {
      if (statusEl) {
        statusEl.textContent = 'Offline';
        statusEl.classList.remove('status-online');
        statusEl.classList.add('status-offline');
      }
      addMessage("I'm working in offline mode - I can still help you focus!", 'fairy');
    });

  // Chat handlers
  _sendButton.addEventListener('click', sendMessage);
  _chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });

  // Timer handlers
  if (startTimer) startTimer.addEventListener('click', toggleTimer);
  if (pauseTimer) pauseTimer.addEventListener('click', pausePomodoro);
  if (resetTimer) resetTimer.addEventListener('click', resetPomodoro);

  function sendMessage() {
    const message = (document.getElementById('chat-input')?.value || '').trim();
    if (message) {
      addMessage(message, 'user');
      document.getElementById('chat-input').value = '';
      
      // Send message to backend
      fetchWithTimeout('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      })
      .then(response => {
        if (!response.ok) throw new Error('backend_error');
        return response.json();
      })
      .then(data => {
        const text = (data && data.response) ? data.response : getRandomFallbackResponse();
        addMessage(text, 'fairy');
        createSparkles();
      })
      .catch(error => {
        console.error('Error:', error);
        // Use fallback response when API is not available
        addMessage(getRandomFallbackResponse(), 'fairy');
        createSparkles();
      });
    }
  }

  function addMessage(text, sender) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
  }

  function createSparkles() {
    for (let i = 0; i < 5; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.innerHTML = '✨';
      sparkle.style.left = Math.random() * 300 + 'px';
      sparkle.style.top = Math.random() * 400 + 'px';
      document.body.appendChild(sparkle);
      
      setTimeout(() => sparkle.remove(), 1000);
    }
  }

  function toggleTimer() {
    if (!isRunning) {
      startPomodoro();
      startTimer.textContent = 'Stop';
      pauseTimer.disabled = false;
    } else {
      stopPomodoro();
      startTimer.textContent = 'Start Focus Time';
      pauseTimer.disabled = true;
    }
    isRunning = !isRunning;
  }

  function startPomodoro() {
    timer = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      
      if (timeLeft === 0) {
        stopPomodoro();
        addMessage("Great work! Time for a break!", 'fairy');
        createSparkles();
      }
    }, 1000);
  }

  function pausePomodoro() {
    clearInterval(timer);
    isRunning = false;
    startTimer.textContent = 'Resume';
    pauseTimer.disabled = true;
  }

  function stopPomodoro() {
    clearInterval(timer);
    pauseTimer.disabled = true;
  }

  function resetPomodoro() {
    stopPomodoro();
    timeLeft = 25 * 60;
    updateTimerDisplay();
    isRunning = false;
    startTimer.textContent = 'Start Focus Time';
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Dark mode functionality
  function initDarkMode() {
    const darkModeBtn = document.getElementById('dark-mode-toggle');
    if (!darkModeBtn) return;

    // Load saved theme or default to light
    chrome.storage.local.get(['theme'], (result) => {
      const currentTheme = result.theme || 'light';
      document.documentElement.setAttribute('data-theme', currentTheme);
      updateDarkModeButton(currentTheme);
    });

    // Toggle dark mode on button click
    darkModeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      updateDarkModeButton(newTheme);
      
      // Save preference
      chrome.storage.local.set({ theme: newTheme });
      
      addMessage(`Switched to ${newTheme} mode! Looking good!`, 'fairy');
    });
  }

  function updateDarkModeButton(theme) {
    const darkModeBtn = document.getElementById('dark-mode-toggle');
    if (darkModeBtn) {
      darkModeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
      darkModeBtn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }
}

// Initialize when DOM is ready (or immediately if already loaded)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPopup);
} else {
  initPopup();
}