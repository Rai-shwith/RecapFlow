# RecapFlow

🔄 **AI-powered transcript summarization and sharing platform**

![Home Page](./homepage.png)
## Overview

RecapFlow is a full-stack application that helps users upload meeting transcripts, generate AI-powered summaries with custom prompts, and share them via email. Built with React frontend, FastAPI backend, and powered by LangChain + Gemini AI.

## 🏗️ Project Structure

```
RecapFlow/
├── frontend/              # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── config/        # Environment configuration
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main application component
│   ├── .env.example       # Frontend environment template
│   ├── .env               # Frontend environment variables (git-ignored)
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/               # FastAPI + Python
│   ├── main.py           # FastAPI app entrypoint
│   ├── routes.py         # API route definitions
│   ├── ai.py             # Handles Gemini AI calls
│   ├── email_service.py  # Handles sending results via SMTP
│   ├── emailer.py        # Email service wrapper
│   ├── .env.example      # Backend environment template
│   ├── .env              # Backend environment variables (git-ignored)
│   └── requirements.txt
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Backend Setup

1. **Create virtual environment:**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   pip freeze > requirements.txt  # Lock versions
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and credentials
   ```

4. **Run the server:**
   ```bash
   python main.py
   # OR
   uvicorn main:app --reload
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your frontend configuration (API URL, etc.)
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

### Backend Configuration

Copy `backend/.env.example` to `backend/.env` and fill in your credentials:

- `GOOGLE_API_KEY` - Your Gemini API key
- `EMAIL_ADDRESS` - Gmail account for sending summaries
- `EMAIL_PASSWORD` - App password for Gmail SMTP
- `API_HOST` - Backend server host (default: 0.0.0.0)
- `API_PORT` - Backend server port (default: 8000)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

### Frontend Configuration

Copy `frontend/.env.example` to `frontend/.env` and configure:

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:8000)
- `VITE_APP_NAME` - Application name (default: RecapFlow)
- `VITE_APP_VERSION` - Application version
- `VITE_NODE_ENV` - Environment mode (development/production)

## 📋 Development Roadmap

- [x] **Phase 1**: Project scaffolding and basic setup
- [x] **Phase 2**: Backend FastAPI server with health checks
- [x] **Phase 3**: Frontend React app with backend integration
- [x] **Phase 4**: SMTP email sending implementation
- [x] **Phase 5**: AI integration (LangChain + Gemini API)
- [x] **Phase 6**: Backend routes for AI summarization
- [x] **Phase 7**: Complete frontend UI for transcript upload and sharing
- [x] **Phase 8**: Toast notifications and enhanced UX
- [x] **Phase 9**: Modular component architecture
- [x] **Phase 10**: Environment configuration and deployment prep

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Hooks and Context
- Vite for fast development and building
- Tailwind CSS for responsive styling
- React Icons for consistent iconography
- React Hot Toast for notifications
- Axios for API communication
- Modular component architecture
- Environment-based configuration

**Backend:**
- FastAPI for high-performance API
- Google Gemini AI API for summarization
- Python SMTP for email delivery
- CORS middleware for cross-origin requests
- Structured logging and error handling
- Environment-based configuration

**Development:**
- Hot reloading (Vite + FastAPI)
- Environment-based configuration
- Modular AI workflows

## 📦 API Endpoints

- `GET /` - API welcome message
- `GET /health` - Service status and connection tests
- `POST /upload` - Upload transcript files (.txt, .md, .docx)
- `POST /summarize` - Generate AI summary from transcript
- `POST /send-email` - Send summary via email to recipients

## ✨ Features

- **📁 File Upload**: Support for .txt, .md, and .docx files
- **🤖 AI Summarization**: Powered by Google Gemini AI
- **✏️ Custom Prompts**: Personalize AI output with custom instructions
- **📝 Summary Editing**: Live editing with markdown support
- **📧 Email Sharing**: Send summaries with professional formatting
- **👤 Sender Details**: Customizable email signatures with localStorage
- **🔄 Step-by-Step Wizard**: Intuitive 4-step process
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🎨 Modern UI**: Beautiful interface with icons and animations
- **🍞 Toast Notifications**: Real-time feedback for all operations
- **💾 Local Storage**: Automatic saving of preferences and data

## 🤝 Contributing

This is a development project. Follow the development order outlined in the roadmap for systematic implementation.

---

**Current Status:** ✅ **Production Ready** - Full-featured application with comprehensive UI/UX