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
    }
    
    .ff-fairy {
      width: 60px;
      height: 60px;
      cursor: pointer;
      animation: floatAnimation 3s ease-in-out infinite;
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
  
  fairyContainer.appendChild(message);
  fairyContainer.appendChild(fairy);
  document.body.appendChild(fairyContainer);
  
  // Fairy interaction
  fairy.addEventListener('mouseenter', () => {
    message.textContent = "Click me for focus mode! ✨";
    message.classList.add('show');
  });
  
  fairy.addEventListener('mouseleave', () => {
    message.classList.remove('show');
  });
  
  fairy.addEventListener('click', () => {
    // Create sparkle effect before fairy disappears
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
    
    // Show goodbye message
    message.textContent = "Opening Focus Fairy! See you later! 👋";
    message.classList.add('show');
    
    // Animate fairy disappearing
    fairyContainer.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    fairyContainer.style.opacity = '0';
    fairyContainer.style.transform = 'scale(0.5) translateY(-20px)';
    
    // Remove fairy after animation
    setTimeout(() => {
      fairyContainer.remove();
    }, 500);
    
    // Open popup on same page
    try {
      chrome.runtime.sendMessage({ action: 'openInlinePopup' });
    } catch (_) {
      // Fallback: create inline popup directly
      createInlinePopup();
    }
  });

  // Function to create inline popup on the same page
  function createInlinePopup() {
    // Remove any existing popup
    const existingPopup = document.getElementById('ff-inline-popup');
    if (existingPopup) {
      existingPopup.remove();
    }

    // Create popup container
    const popup = document.createElement('div');
    popup.id = 'ff-inline-popup';
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 350px;
      min-height: 400px;
      background: linear-gradient(135deg, #fff8ff 0%, #ffb7eb 100%);
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 10000;
      font-family: Arial, sans-serif;
      padding: 15px;
      animation: popupSlideIn 0.3s ease-out forwards;
    `;

    // Add popup content
    popup.innerHTML = `
      <style>
        @keyframes popupSlideIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .ff-popup-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
          padding: 10px;
          background: rgba(255,255,255,0.3);
          border-radius: 10px;
        }
        .ff-popup-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: bold;
          color: #4a4a4a;
        }
        .ff-close-btn {
          background: #ff6b6b;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          color: white;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ff-popup-content {
          background: white;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 15px;
          min-height: 200px;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
        }
        .ff-timer-section {
          text-align: center;
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
        }
        .ff-timer {
          font-size: 2em;
          font-weight: bold;
          color: #4a4a4a;
          margin: 15px 0;
        }
        .ff-btn {
          background: #ffb7eb;
          border: none;
          border-radius: 20px;
          padding: 8px 15px;
          margin: 5px;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.2s;
        }
        .ff-btn:hover { transform: scale(1.05); }
        .ff-chat-input {
          width: calc(100% - 60px);
          padding: 8px;
          border: 2px solid #ffb7eb;
          border-radius: 20px;
          outline: none;
          margin-right: 10px;
        }
        .ff-send-btn {
          background: #ffb7eb;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          cursor: pointer;
        }
      </style>
      
      <div class="ff-popup-header">
        <div class="ff-popup-title">
          <span>🧚‍♀️</span>
          <span>Focus Fairy</span>
        </div>
        <button class="ff-close-btn" onclick="document.getElementById('ff-inline-popup').remove()">×</button>
      </div>
      
      <div class="ff-popup-content">
        <p><strong>Hi! I'm your Focus Fairy! 🌟</strong></p>
        <p>Ready to help you stay focused and productive!</p>
        <div style="margin-top: 15px;">
          <input type="text" class="ff-chat-input" placeholder="Ask your fairy for help..." />
          <button class="ff-send-btn">✨</button>
        </div>
      </div>
      
      <div class="ff-timer-section">
        <div class="ff-timer">25:00</div>
        <button class="ff-btn" onclick="startFairyTimer()">Start Focus Time</button>
        <button class="ff-btn">Pause</button>
        <button class="ff-btn">Reset</button>
      </div>
    `;

    document.body.appendChild(popup);

    // Add click outside to close
    setTimeout(() => {
      document.addEventListener('click', function closeOnOutside(e) {
        if (!popup.contains(e.target)) {
          popup.remove();
          document.removeEventListener('click', closeOnOutside);
        }
      });
    }, 100);
  }

  // Make timer function available globally for the inline popup
  window.startFairyTimer = function() {
    alert('Timer started! Focus time begins now! 🧚‍♀️');
  };

})();