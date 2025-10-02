// Content script for injecting fairy elements into web pages
(() => {
  // Create and inject minimal, prefixed fairy styles (avoid global overrides)
  const style = document.createElement('style');
  style.textContent = `
    .ff-fairy-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
    }
    
    .ff-fairy {
      width: 60px;
      height: 60px;
      cursor: pointer;
      animation: floatAnimation 3s ease-in-out infinite;
    }
    
    .ff-sidebar-btn {
      background: #ffb7eb;
      border: none;
      border-radius: 20px;
      padding: 8px 12px;
      color: #4a4a4a;
      font-family: Arial, sans-serif;
      font-size: 12px;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(10px);
    }
    
    .ff-sidebar-btn:hover {
      background: #ff9fe5;
      transform: translateY(8px) scale(1.05);
    }
    
    .ff-sidebar-btn.show {
      opacity: 1;
      transform: translateY(0);
    }
    
    @keyframes floatAnimation {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    
    .ff-fairy-message {
      position: absolute;
      bottom: 70px;
      right: 0;
      background-color: #ffb7eb;
      color: #4a4a4a;
      padding: 10px 15px;
      border-radius: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
      font-size: 14px;
      max-width: 200px;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.3s, transform 0.3s;
      pointer-events: none;
    }
    
    .ff-fairy-message.show {
      opacity: 1;
      transform: translateY(0);
    }
    
    .ff-sidebar {
      position: fixed;
      top: 0;
      right: -350px;
      width: 350px;
      height: 100vh;
      background: linear-gradient(135deg, #fff8ff 0%, #ffb7eb 100%);
      box-shadow: -5px 0 15px rgba(0,0,0,0.2);
      z-index: 9999;
      font-family: Arial, sans-serif;
      transition: right 0.3s ease-in-out;
      overflow-y: auto;
    }
    
    .ff-sidebar.open {
      right: 0;
    }
    
    .ff-sidebar-header {
      background: rgba(255,255,255,0.95) !important;
      padding: 20px !important;
      border-bottom: 2px solid #ffb7eb !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      position: relative !important;
      z-index: 1 !important;
    }
    
    .ff-sidebar-title {
      font-size: 18px !important;
      font-weight: 900 !important;
      color: #1a1a1a !important;
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      text-shadow: none !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif !important;
      line-height: 1.2 !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    .ff-sidebar-title span {
      color: #1a1a1a !important;
      font-weight: 900 !important;
      text-shadow: none !important;
    }
    
    .ff-close-sidebar {
      background: #ff6b6b !important;
      border: none !important;
      border-radius: 50% !important;
      width: 30px !important;
      height: 30px !important;
      color: white !important;
      cursor: pointer !important;
      font-size: 16px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    
    .ff-dark-mode-toggle {
      background: #4a4a4a !important;
      border: none !important;
      border-radius: 50% !important;
      width: 30px !important;
      height: 30px !important;
      color: white !important;
      cursor: pointer !important;
      font-size: 14px !important;
      margin-right: 10px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.3s ease !important;
    }
    
    .ff-dark-mode-toggle:hover {
      background: #333 !important;
      transform: scale(1.1) !important;
    }
    
    /* Dark Mode Styles */
    .ff-sidebar.dark-mode {
      background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%) !important;
    }
    
    .ff-sidebar.dark-mode .ff-sidebar-header {
      background: rgba(50, 50, 50, 0.95) !important;
      border-bottom: 2px solid #ff6b9d !important;
    }
    
    .ff-sidebar.dark-mode .ff-sidebar-title,
    .ff-sidebar.dark-mode .ff-sidebar-title span {
      color: #ffffff !important;
    }
    
    .ff-sidebar.dark-mode .ff-section {
      background: #333333 !important;
      color: #ffffff !important;
    }
    
    .ff-sidebar.dark-mode .ff-section h3 {
      color: #ffffff !important;
    }
    
    .ff-sidebar.dark-mode .ff-timer-display {
      color: #ffffff !important;
    }
    
    .ff-sidebar.dark-mode .ff-btn {
      background: #ff6b9d !important;
      color: #ffffff !important;
    }
    
    .ff-sidebar.dark-mode .ff-btn:hover {
      background: #ff4081 !important;
    }
    
    .ff-sidebar.dark-mode .ff-btn:disabled {
      background: #555 !important;
      color: #888 !important;
    }
    
    .ff-sidebar.dark-mode .ff-notes-textarea {
      background: #2d2d2d !important;
      color: #ffffff !important;
      border: 2px solid #ff6b9d !important;
    }
    
    .ff-sidebar.dark-mode .ff-notes-textarea::placeholder {
      color: #aaa !important;
    }
    
    .ff-sidebar.dark-mode .ff-save-status {
      color: #ffffff !important;
    }
    
    .ff-fairy-container.dark-mode .ff-sidebar-btn {
      background: #ff6b9d !important;
      color: #ffffff !important;
    }
    
    .ff-fairy-container.dark-mode .ff-sidebar-btn:hover {
      background: #ff4081 !important;
    }
    
    .ff-fairy-container.dark-mode .ff-fairy-message {
      background: #333333 !important;
      color: #ffffff !important;
    }
    
    .ff-hotkey-indicator {
      position: fixed !important;
      bottom: 100px !important;
      right: 20px !important;
      background: rgba(0,0,0,0.8) !important;
      color: white !important;
      padding: 5px 10px !important;
      border-radius: 15px !important;
      font-family: monospace !important;
      font-size: 12px !important;
      z-index: 9998 !important;
      opacity: 0 !important;
      transition: opacity 0.3s ease !important;
      pointer-events: none !important;
    }
    
    .ff-hotkey-indicator.show {
      opacity: 1 !important;
    }
    
    .ff-sidebar-content {
      padding: 20px;
    }
    
    .ff-section {
      background: white;
      border-radius: 15px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .ff-section h3 {
      margin: 0 0 15px 0;
      color: #2d2d2d !important;
      font-size: 16px;
      font-weight: bold;
      text-shadow: none;
    }
    
    .ff-timer-display {
      text-align: center;
      font-size: 2.5em;
      font-weight: bold;
      color: #2d2d2d !important;
      margin: 20px 0;
      text-shadow: none;
    }
    
    .ff-timer-controls {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .ff-btn {
      background: #ffb7eb;
      border: none;
      border-radius: 20px;
      padding: 10px 15px;
      color: #2d2d2d !important;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
      font-size: 14px;
      font-weight: bold;
    }
    
    .ff-btn:hover {
      background: #ff9fe5;
      transform: scale(1.05);
    }
    
    .ff-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
      color: #666 !important;
    }
    
    .ff-notes-textarea {
      width: 100%;
      min-height: 200px;
      border: 2px solid #ffb7eb;
      border-radius: 10px;
      padding: 15px;
      font-family: inherit;
      font-size: 14px;
      resize: vertical;
      outline: none;
      box-sizing: border-box;
      background: #ffffff !important;
      color: #2d2d2d !important;
    }
    
    .ff-notes-textarea::placeholder {
      color: #888 !important;
    }
    
    .ff-notes-controls {
      display: flex;
      gap: 10px;
      margin-top: 10px;
      justify-content: flex-end;
    }
    
    .ff-save-status {
      color: #2d2d2d !important;
      font-size: 12px;
      margin-top: 5px;
      text-align: right;
      font-weight: bold;
    }
    
    @keyframes sparkleAnimation {
      0% {
        transform: scale(0) rotate(0deg);
        opacity: 1;
      }
      50% {
        transform: scale(1) rotate(180deg);
        opacity: 1;
      }
      100% {
        transform: scale(0) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  
  document.head.appendChild(style);
  
  // Create fairy container
  const fairyContainer = document.createElement('div');
  fairyContainer.className = 'ff-fairy-container';
  
  // Create sidebar toggle button
  const sidebarBtn = document.createElement('button');
  sidebarBtn.className = 'ff-sidebar-btn';
  sidebarBtn.textContent = '📋 Sidebar';
  sidebarBtn.title = 'Open Focus Sidebar';
  
  // Create fairy image
  const fairy = document.createElement('div');
  fairy.className = 'ff-fairy';
  fairy.innerHTML = '🧚‍♀️';
  fairy.style.fontSize = '40px';
  fairy.style.cursor = 'pointer';
  fairy.title = 'Focus Fairy - Click me!';
  
  // Create message bubble
  const message = document.createElement('div');
  message.className = 'ff-fairy-message';
  
  // Create sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'ff-sidebar';
  sidebar.innerHTML = `
    <div class="ff-sidebar-header">
      <div class="ff-sidebar-title">
        <span>🧚‍♀️</span>
        <span>Focus Sidebar</span>
      </div>
      <div style="display: flex; align-items: center;">
        <button class="ff-dark-mode-toggle" title="Toggle Dark Mode">🌙</button>
        <button class="ff-close-sidebar">×</button>
      </div>
    </div>
    <div class="ff-sidebar-content">
      <div class="ff-section">
        <h3>🍅 Pomodoro Timer</h3>
        <div class="ff-timer-display" id="ff-timer-display">25:00</div>
        <div class="ff-timer-controls">
          <button class="ff-btn" id="ff-start-timer">Start</button>
          <button class="ff-btn" id="ff-pause-timer" disabled>Pause</button>
          <button class="ff-btn" id="ff-reset-timer">Reset</button>
        </div>
      </div>
      <div class="ff-section">
        <h3>📝 Quick Notes</h3>
        <textarea class="ff-notes-textarea" id="ff-notes-textarea" placeholder="Write your notes here..."></textarea>
        <div class="ff-notes-controls">
          <button class="ff-btn" id="ff-save-notes">💾 Save Notes</button>
          <button class="ff-btn" id="ff-load-notes">📂 Load Notes</button>
        </div>
        <div class="ff-save-status" id="ff-save-status"></div>
      </div>
      <div style="text-align: center; padding: 10px; color: #666; font-size: 12px;">
        Press <kbd>F8</kbd> to toggle sidebar
      </div>
    </div>
  `;
  
  // Create hotkey indicator
  const hotkeyIndicator = document.createElement('div');
  hotkeyIndicator.className = 'ff-hotkey-indicator';
  hotkeyIndicator.textContent = 'Press F8 for Focus Sidebar';
  
  fairyContainer.appendChild(sidebarBtn);
  fairyContainer.appendChild(message);
  fairyContainer.appendChild(fairy);
  document.body.appendChild(fairyContainer);
  document.body.appendChild(sidebar);
  document.body.appendChild(hotkeyIndicator);
  
  // Fairy interaction
  fairy.addEventListener('mouseenter', () => {
    message.textContent = "Click me for focus mode! ✨";
    message.classList.add('show');
    sidebarBtn.classList.add('show');
  });
  
  fairy.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!fairyContainer.matches(':hover')) {
        message.classList.remove('show');
        sidebarBtn.classList.remove('show');
      }
    }, 100);
  });
  
  fairyContainer.addEventListener('mouseleave', () => {
    message.classList.remove('show');
    sidebarBtn.classList.remove('show');
  });
  
  fairy.addEventListener('click', () => {
    // Create sparkle effect when fairy is clicked
    for (let i = 0; i < 5; i++) {
      const sparkle = document.createElement('div');
      sparkle.innerHTML = '✨';
      sparkle.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 10001;
        font-size: 20px;
        animation: sparkleAnimation 1s ease-out forwards;
        left: ${fairy.getBoundingClientRect().left + Math.random() * 60}px;
        top: ${fairy.getBoundingClientRect().top + Math.random() * 60}px;
      `;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1000);
    }
    
    // Show opening message but keep fairy visible
    message.textContent = "Opening Focus Fairy popup! ✨";
    message.classList.add('show');
    
    // Hide message after a short delay
    setTimeout(() => {
      message.classList.remove('show');
    }, 2000);
    
    // Send message to background script to open the native extension popup
    try {
      chrome.runtime.sendMessage({ action: 'openExtensionPopup' });
    } catch (error) {
      console.error('Failed to send message to background script:', error);
      // Fallback: show a message that popup couldn't be opened
      message.textContent = "Please click the Focus Fairy extension icon in your browser toolbar! 🧚‍♀️";
      message.classList.add('show');
      setTimeout(() => {
        message.classList.remove('show');
      }, 4000);
    }
  });

  // Sidebar functionality
  let timerInterval = null;
  let timerSeconds = 25 * 60; // 25 minutes
  let isTimerRunning = false;
  let isDarkMode = false;
  
  // Load dark mode preference
  try {
    chrome.storage.local.get(['focusFairyDarkMode'], (result) => {
      if (result.focusFairyDarkMode) {
        isDarkMode = true;
        toggleDarkMode();
      }
    });
  } catch (error) {
    const savedDarkMode = localStorage.getItem('focusFairyDarkMode');
    if (savedDarkMode === 'true') {
      isDarkMode = true;
      toggleDarkMode();
    }
  }
  
  // Dark mode toggle function
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    const darkModeToggle = sidebar.querySelector('.ff-dark-mode-toggle');
    
    if (isDarkMode) {
      sidebar.classList.add('dark-mode');
      fairyContainer.classList.add('dark-mode');
      darkModeToggle.textContent = '☀️';
      darkModeToggle.title = 'Switch to Light Mode';
    } else {
      sidebar.classList.remove('dark-mode');
      fairyContainer.classList.remove('dark-mode');
      darkModeToggle.textContent = '🌙';
      darkModeToggle.title = 'Switch to Dark Mode';
    }
    
    // Save preference
    try {
      chrome.storage.local.set({ 'focusFairyDarkMode': isDarkMode });
    } catch (error) {
      localStorage.setItem('focusFairyDarkMode', isDarkMode.toString());
    }
  }
  
  // Function to toggle sidebar
  function toggleSidebar() {
    if (sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      hotkeyIndicator.classList.remove('show');
    } else {
      sidebar.classList.add('open');
      loadNotes(); // Load notes when sidebar opens
      // Show hotkey indicator briefly
      setTimeout(() => {
        hotkeyIndicator.classList.add('show');
        setTimeout(() => {
          hotkeyIndicator.classList.remove('show');
        }, 2000);
      }, 500);
    }
  }
  
  // F8 hotkey listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F8') {
      e.preventDefault();
      toggleSidebar();
    }
  });
  
  // Show hotkey indicator on page load
  setTimeout(() => {
    hotkeyIndicator.classList.add('show');
    setTimeout(() => {
      hotkeyIndicator.classList.remove('show');
    }, 3000);
  }, 2000);
  
  // Sidebar toggle
  sidebarBtn.addEventListener('click', toggleSidebar);
  
  // Close sidebar
  sidebar.querySelector('.ff-close-sidebar').addEventListener('click', () => {
    sidebar.classList.remove('open');
  });
  
  // Dark mode toggle
  sidebar.querySelector('.ff-dark-mode-toggle').addEventListener('click', toggleDarkMode);
  
  // Close sidebar when clicking outside
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') && 
        !sidebar.contains(e.target) && 
        !fairyContainer.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
  
  // Timer functionality
  function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    document.getElementById('ff-timer-display').textContent = 
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  function startTimer() {
    if (isTimerRunning) return;
    
    isTimerRunning = true;
    document.getElementById('ff-start-timer').disabled = true;
    document.getElementById('ff-pause-timer').disabled = false;
    
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimerDisplay();
      } else {
        // Timer finished
        clearInterval(timerInterval);
        isTimerRunning = false;
        document.getElementById('ff-start-timer').disabled = false;
        document.getElementById('ff-pause-timer').disabled = true;
        alert('🧚‍♀️ Pomodoro session complete! Time for a break!');
        timerSeconds = 25 * 60; // Reset to 25 minutes
        updateTimerDisplay();
      }
    }, 1000);
  }
  
  function pauseTimer() {
    if (!isTimerRunning) return;
    
    clearInterval(timerInterval);
    isTimerRunning = false;
    document.getElementById('ff-start-timer').disabled = false;
    document.getElementById('ff-pause-timer').disabled = true;
  }
  
  function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerSeconds = 25 * 60;
    updateTimerDisplay();
    document.getElementById('ff-start-timer').disabled = false;
    document.getElementById('ff-pause-timer').disabled = true;
  }
  
  // Timer event listeners
  document.getElementById('ff-start-timer').addEventListener('click', startTimer);
  document.getElementById('ff-pause-timer').addEventListener('click', pauseTimer);
  document.getElementById('ff-reset-timer').addEventListener('click', resetTimer);
  
  // Notes functionality
  function saveNotes() {
    const notes = document.getElementById('ff-notes-textarea').value;
    const timestamp = new Date().toISOString();
    const noteData = {
      content: notes,
      lastSaved: timestamp,
      website: window.location.hostname
    };
    
    try {
      chrome.storage.local.set({ 'focusFairyNotes': noteData }, () => {
        document.getElementById('ff-save-status').textContent = 
          `Saved at ${new Date(timestamp).toLocaleTimeString()}`;
        setTimeout(() => {
          document.getElementById('ff-save-status').textContent = '';
        }, 3000);
      });
    } catch (error) {
      // Fallback to localStorage if chrome.storage is not available
      localStorage.setItem('focusFairyNotes', JSON.stringify(noteData));
      document.getElementById('ff-save-status').textContent = 
        `Saved locally at ${new Date(timestamp).toLocaleTimeString()}`;
      setTimeout(() => {
        document.getElementById('ff-save-status').textContent = '';
      }, 3000);
    }
  }
  
  function loadNotes() {
    try {
      chrome.storage.local.get(['focusFairyNotes'], (result) => {
        if (result.focusFairyNotes) {
          document.getElementById('ff-notes-textarea').value = result.focusFairyNotes.content || '';
          if (result.focusFairyNotes.lastSaved) {
            document.getElementById('ff-save-status').textContent = 
              `Last saved: ${new Date(result.focusFairyNotes.lastSaved).toLocaleString()}`;
          }
        }
      });
    } catch (error) {
      // Fallback to localStorage
      const savedNotes = localStorage.getItem('focusFairyNotes');
      if (savedNotes) {
        const noteData = JSON.parse(savedNotes);
        document.getElementById('ff-notes-textarea').value = noteData.content || '';
        if (noteData.lastSaved) {
          document.getElementById('ff-save-status').textContent = 
            `Last saved: ${new Date(noteData.lastSaved).toLocaleString()}`;
        }
      }
    }
  }
  
  // Notes event listeners
  document.getElementById('ff-save-notes').addEventListener('click', saveNotes);
  document.getElementById('ff-load-notes').addEventListener('click', loadNotes);
  
  // Auto-save notes every 30 seconds if there's content
  setInterval(() => {
    const notesContent = document.getElementById('ff-notes-textarea').value.trim();
    if (notesContent && notesContent.length > 0) {
      saveNotes();
    }
  }, 30000);

})();