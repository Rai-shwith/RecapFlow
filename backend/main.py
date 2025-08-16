from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import logging
import sys
from datetime import datetime

# Import routes and lifespan
from routes import router, lifespan

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('recapflow.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger("RecapFlow")

app = FastAPI(title="RecapFlow API", version="1.0.0", lifespan=lifespan)

logger.info("🚀 Starting RecapFlow API server...")

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)

@app.get("/")
async def root():
    logger.info("📍 Root endpoint accessed")
    return {"message": "Hello World from RecapFlow API!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    logger.info("🏥 Health check endpoint accessed")
    return {
        "status": "healthy",
        "service": "RecapFlow Backend",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    logger.info("🔥 Starting uvicorn server on http://0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
