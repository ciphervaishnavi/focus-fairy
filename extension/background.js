// Background script to monitor tabs and handle notifications
const distractingWebsites = [
  'youtube.com',
  'instagram.com',
  'facebook.com',
  'twitter.com',
  'reddit.com'
];

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = new URL(tab.url);
    if (distractingWebsites.some(site => url.hostname.includes(site))) {
      // Inject content script
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: showFairyMessage,
      });
    }
  }
});

function showFairyMessage() {
  // This function will be injected into the page
  const messages = [
    "🧚‍♀️ Remember your goals! Should we set a timer?",
    "✨ Hey there! Need help staying focused?",
    "🌟 Taking a break or getting distracted?",
    "🎯 Let's stay on track together!",
    "💫 I'm here to help you focus!"
  ];
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  // Create and show the fairy message
  const messageContainer = document.createElement('div');
  messageContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #ffb7eb;
    color: #4a4a4a;
    padding: 15px 20px;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 10000;
    font-family: Arial, sans-serif;
    animation: fadeIn 0.5s ease-in-out;
    cursor: pointer;
  `;
  
  messageContainer.textContent = randomMessage;
  
  // Add fade-in animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(messageContainer);
  
  // --- START OF NEW CODE ---

  // Add a click listener to the fairy message
  messageContainer.addEventListener('click', () => {
    // Remove the fairy message when it's clicked
    messageContainer.remove();

    // 1. Create the overlay container
    const popupOverlay = document.createElement('div');
    popupOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 20000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    // 2. Create the iframe to load popup.html
    const popupFrame = document.createElement('iframe');
    popupFrame.src = chrome.runtime.getURL('popup.html');
    popupFrame.style.cssText = `
        width: 300px; /* Adjust size as needed */
        height: 400px; /* Adjust size as needed */
        border: none;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;

    // 3. Add a way to close the popup
    popupOverlay.addEventListener('click', () => {
        popupOverlay.remove();
    });

    // 4. Append the elements to the page
    popupOverlay.appendChild(popupFrame);
    document.body.appendChild(popupOverlay);
  });

  // --- END OF NEW CODE ---
  
  // Remove the message after 5 seconds IF NOT clicked
  setTimeout(() => {
    // Check if the element is still in the DOM before trying to remove it
    if (messageContainer.parentNode) {
      messageContainer.style.animation = 'fadeIn 0.5s ease-in-out reverse';
      setTimeout(() => messageContainer.remove(), 500);
    }
  }, 5000);
}
// Listen for requests from content script to open popup
