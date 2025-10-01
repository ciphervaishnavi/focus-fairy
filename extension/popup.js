let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;

// Fallback fairy responses when API is not available
const fallbackResponses = [
  "I believe in you! You've got this! 💪✨",
  "Take a deep breath and focus on one task at a time! 🌿",
  "Remember why you started - you're doing amazing! 🌟",
  "Small steps lead to big achievements! Keep going! 💕",
  "You're stronger than any distraction! Stay focused! ✨",
  "Break time? Make sure to rest those beautiful eyes! 😌",
  "Hydrate and celebrate small wins! You deserve it! 💧🎉",
  "Focus is like a muscle - the more you use it, the stronger it gets! 💪"
];

function getRandomFallbackResponse() {
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

// Chat functionality
document.addEventListener('DOMContentLoaded', () => {
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-message');
  const chatMessages = document.getElementById('chat-messages');
  const startTimer = document.getElementById('start-timer');
  const pauseTimer = document.getElementById('pause-timer');
  const resetTimer = document.getElementById('reset-timer');
  const timerDisplay = document.getElementById('timer');

  // Initialize with a welcome message and check backend status
  addMessage("Hi! I'm your Focus Fairy! 🧚‍♀️✨ How can I help you stay focused today?", 'fairy');
  
  // Check if backend is available
  fetch('http://localhost:3000/health')
    .then(response => response.json())
    .then(data => {
      addMessage("Great news! I'm connected to my full magical powers! ✨", 'fairy');
    })
    .catch(error => {
      addMessage("I'm working in offline mode - I can still help you focus! 💫", 'fairy');
    });

  // Chat handlers
  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Timer handlers
  startTimer.addEventListener('click', toggleTimer);
  pauseTimer.addEventListener('click', pausePomodoro);
  resetTimer.addEventListener('click', resetPomodoro);

  function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
      addMessage(message, 'user');
      chatInput.value = '';
      
      // Send message to backend
      fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      })
      .then(response => response.json())
      .then(data => {
        addMessage(data.response, 'fairy');
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
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
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
        addMessage("Great work! Time for a break! 🌟", 'fairy');
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
});