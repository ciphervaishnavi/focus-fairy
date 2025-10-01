# Focus Fairy Chrome Extension

A cute and productive Chrome extension featuring an AI fairy companion that helps you stay focused and productive!

## Features

- 🧚‍♀️ Cute AI Fairy Companion
- 💬 Interactive Chat with AI
- ⏰ Pomodoro Timer
- ✨ Distraction Site Warnings
- 🎨 Beautiful Pastel UI

## Quick Setup

### Option 1: Automated Setup (Windows)
1. Double-click `setup.bat` to install dependencies
2. Edit `backend\.env` and add your Gemini API key
3. Double-click `start-backend.bat` to start the server
4. Load the extension in Chrome (see Extension Setup below)

### Option 2: Manual Setup

#### Backend Setup

1. **Get a Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

2. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Configure API key:**
   - Edit `backend\.env`
   - Replace `your_gemini_api_key_here` with your actual API key

4. **Start the backend server:**
   ```bash
   npm start
   ```
   The server will run on http://localhost:3000

#### Extension Setup

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension` folder
5. The Focus Fairy should now appear in your extensions!

## Usage

- Click the extension icon to open the popup with chat and timer
- The fairy will appear on distracting websites with gentle reminders
- Use the chat to get productivity tips and encouragement
- Set focus timers to stay on track
- Even without the backend, the fairy provides helpful fallback responses!

## Troubleshooting

### Backend Issues
- **"npm is not recognized"**: Install [Node.js](https://nodejs.org/)
- **API errors**: Make sure your Gemini API key is correct in `.env`
- **Port 3000 in use**: Change PORT in `.env` file

### Extension Issues
- **Extension won't load**: Make sure you selected the `extension` folder, not the whole project
- **No fairy appearing**: Check if content scripts are blocked by the website
- **Chat not working**: The extension works offline with fallback responses

### Getting a Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in `backend\.env`

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- AI: Gemini API
- Chrome Extensions API

## Contributing

Feel free to submit issues and pull requests!

## License

MIT License