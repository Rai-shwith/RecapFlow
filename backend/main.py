import logging
import os
import sys
from datetime import datetime

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routes and lifespan
from routes import lifespan, router

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path=dotenv_path)
else:
    load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("recapflow.log"), logging.StreamHandler(sys.stdout)],
)

logger = logging.getLogger("RecapFlow")

app = FastAPI(title="RecapFlow API", version="1.0.0", lifespan=lifespan)

logger.info("🚀 Starting RecapFlow API server...")

# Configure CORS for frontend integration
frontend_env = os.getenv("FRONTEND_URL", "http://localhost:3000")
configured_origins = [
    url.strip().rstrip("/") for url in frontend_env.split(",") if url.strip()
]
dev_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
all_allowed_origins = list(set(configured_origins + dev_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=all_allowed_origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
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
        "timestamp": datetime.now().isoformat(),
    }


if __name__ == "__main__":
    import uvicorn

    logger.info("🔥 Starting uvicorn server")
    uvicorn.run(
        app, host=os.getenv("HOST", "0.0.0.0"), port=int(os.getenv("PORT", 8000))
    )
