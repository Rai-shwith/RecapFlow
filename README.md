# RecapFlow

🔄 **AI-powered transcript summarization and sharing platform**

## Overview

RecapFlow is a full-stack application that helps users upload meeting transcripts, generate AI-powered summaries with custom prompts, and share them via email. Built with React frontend, FastAPI backend, and powered by LangChain + Gemini AI.

## 🏗️ Project Structure

```
```
RecapFlow/
├── frontend/              # React + Vite + Tailwind CSS
│   ├── src/
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/               # FastAPI + Python
│   ├── main.py           # FastAPI app entrypoint
│   ├── routes.py         # API route definitions
│   ├── ai.py             # Handles Gemini AI calls
│   ├── email_service.py  # Handles sending results via SMTP
│   ├── emailer.py        # Email service wrapper
│   ├── .env              # Store API keys + email creds
│   └── requirements.txt
├── .env.example          # Environment variables template
├── .gitignore
└── README.md
```
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
   cp ../.env.example ../.env
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

2. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

- `GOOGLE_API_KEY` - Your Gemini API key
- `EMAIL_ADDRESS` - Gmail account for sending summaries
- `EMAIL_PASSWORD` - App password for Gmail SMTP

## 📋 Development Roadmap

- [x] **Phase 1**: Project scaffolding and basic setup
- [ ] **Phase 2**: Backend FastAPI server with health checks
- [ ] **Phase 3**: Frontend React app with backend integration test
- [ ] **Phase 4**: SMTP email sending implementation
- [ ] **Phase 5**: AI integration (LangChain + Gemini API)
- [ ] **Phase 6**: Backend routes for AI summarization
- [ ] **Phase 7**: Complete frontend UI for transcript upload and sharing
- [ ] **Phase 8**: Deployment preparation and documentation

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Modern ES modules

**Backend:**
- FastAPI
- Google Gemini AI API
- Python SMTP (built-in)
- CORS middleware

**Development:**
- Hot reloading (Vite + FastAPI)
- Environment-based configuration
- Modular AI workflows

## 📦 API Endpoints

- `GET /` - API welcome message
- `GET /health` - Service status and connection tests
- `POST /summarize` - Generate AI summary from transcript
- `POST /rephrase` - Rephrase summary in different styles
- `POST /send-email` - Send summary via email to recipients
- `POST /upload-transcript` - Upload transcript files (.txt, .md)

## 🤝 Contributing

This is a development project. Follow the development order outlined in the roadmap for systematic implementation.

---

**Current Status:** ✅ Project scaffolding complete - Ready for Phase 2!