// Content script for injecting fairy elements into web pages
(() => {
  // Create and inject fairy styles
  const style = document.createElement('style');
  style.textContent = `
    .focus-fairy-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
    }
    
    .focus-fairy {
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
    
    .fairy-message {
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
    
    .fairy-message.show {
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
  fairyContainer.className = 'focus-fairy-container';
  
  // Create fairy image
  const fairy = document.createElement('div');
  fairy.className = 'focus-fairy';
  fairy.innerHTML = '🧚‍♀️';
  fairy.style.fontSize = '40px';
  fairy.style.cursor = 'pointer';
  fairy.title = 'Focus Fairy - Click me!';
  
  // Create message bubble
  const message = document.createElement('div');
  message.className = 'fairy-message';
  
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
    // Create sparkle effect
    for (let i = 0; i < 3; i++) {
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
    
    message.textContent = "Opening your focus companion! 🌟";
    message.classList.add('show');
    setTimeout(() => message.classList.remove('show'), 2000);
  });
})();