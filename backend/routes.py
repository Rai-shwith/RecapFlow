"""
API routes for RecapFlow backend
"""

from fastapi import APIRouter, File, UploadFile, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from contextlib import asynccontextmanager
import logging
from datetime import datetime

# Import our custom modules
from ai import RecapFlowAI
from emailer import RecapFlowEmailer

# Configure logger
logger = logging.getLogger("RecapFlow.Routes")

# Global services
ai_service = None
email_service = None

@asynccontextmanager
async def lifespan(app):
    """Lifespan context manager for startup and shutdown events"""
    # Startup
    global ai_service, email_service
    logger.info("🚀 Initializing RecapFlow services...")
    try:
        ai_service = RecapFlowAI()
        email_service = RecapFlowEmailer()
        logger.info("✅ AI and Email services initialized successfully")
    except Exception as e:
        logger.error(f"❌ Failed to initialize services: {e}")
        raise e
    
    yield
    
    # Shutdown (cleanup if needed)
    logger.info("🔄 Shutting down RecapFlow services...")

router = APIRouter()

# Pydantic models for request/response
class SummarizeRequest(BaseModel):
    transcript: str
    custom_prompt: Optional[str] = None
    models: Optional[List[str]] = None

class EmailRequest(BaseModel):
    recipients: List[str]
    summary: str
    subject: Optional[str] = "Meeting Summary - RecapFlow"
    include_transcript: Optional[bool] = False
    original_transcript: Optional[str] = None
    sender_details: Optional[dict] = None

class RephraseRequest(BaseModel):
    summary: str
    style: str = "professional"
    models: Optional[List[str]] = None

def get_ai_service() -> RecapFlowAI:
    global ai_service
    if ai_service is None:
        try:
            ai_service = RecapFlowAI()
        except Exception as e:
            logger.error(f"❌ Failed to initialize AI service: {e}")
            raise HTTPException(status_code=500, detail=f"AI service initialization failed: {str(e)}")
    return ai_service

def get_email_service() -> RecapFlowEmailer:
    global email_service
    if email_service is None:
        try:
            email_service = RecapFlowEmailer()
        except Exception as e:
            logger.error(f"❌ Failed to initialize Email service: {e}")
            raise HTTPException(status_code=500, detail=f"Email service initialization failed: {str(e)}")
    return email_service

@router.post("/summarize")
async def summarize_transcript(request: SummarizeRequest):
    """
    Generate AI summary of transcript using OpenRouter fallback models
    """
    logger.info(f"🤖 Summarization request received - transcript length: {len(request.transcript)} chars")
    service = get_ai_service()
    
    try:
        start_time = datetime.now()
        summary, model_used = await service.summarize_transcript(
            transcript=request.transcript,
            custom_prompt=request.custom_prompt,
            models=request.models
        )
        end_time = datetime.now()
        processing_time = (end_time - start_time).total_seconds()
        
        logger.info(f"✅ Summarization completed in {processing_time:.2f}s by {model_used} - summary length: {len(summary)} chars")
        
        return {
            "success": True,
            "summary": summary,
            "model_used": model_used,
            "original_length": len(request.transcript),
            "summary_length": len(summary),
            "processing_time": processing_time
        }
    except Exception as e:
        logger.error(f"❌ Summarization failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")

@router.post("/rephrase")
async def rephrase_summary(request: RephraseRequest):
    """Rephrase summary in different style using OpenRouter fallback models"""
    logger.info(f"✏️ Rephrase request received - style: {request.style}, text length: {len(request.summary)} chars")
    service = get_ai_service()
    
    try:
        start_time = datetime.now()
        rephrased, model_used = await service.rephrase_summary(
            summary=request.summary,
            style=request.style,
            models=request.models
        )
        end_time = datetime.now()
        processing_time = (end_time - start_time).total_seconds()
        
        logger.info(f"✅ Rephrasing completed in {processing_time:.2f}s by {model_used} - new length: {len(rephrased)} chars")
        
        return {
            "success": True,
            "rephrased_summary": rephrased,
            "model_used": model_used,
            "style": request.style,
            "processing_time": processing_time
        }
    except Exception as e:
        logger.error(f"❌ Rephrasing failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Rephrasing failed: {str(e)}")

@router.post("/send-email")
async def send_summary_email(request: EmailRequest):
    """
    Send summary via email to recipients
    """
    logger.info(f"📧 Email request received - recipients: {len(request.recipients)}, subject: {request.subject}")
    service = get_email_service()
    
    try:
        start_time = datetime.now()
        success = await service.send_summary_email(
            recipients=request.recipients,
            summary=request.summary,
            subject=request.subject,
            original_transcript=request.original_transcript if request.include_transcript else None,
            sender_details=request.sender_details
        )
        end_time = datetime.now()
        processing_time = (end_time - start_time).total_seconds()
        
        if success:
            logger.info(f"✅ Email sent successfully in {processing_time:.2f}s to {len(request.recipients)} recipients: {request.recipients}")
            return {
                "success": True,
                "message": f"Email sent successfully to {len(request.recipients)} recipients",
                "recipients": request.recipients,
                "processing_time": processing_time
            }
        else:
            logger.error("❌ Email sending failed - service returned False")
            raise HTTPException(status_code=500, detail="Failed to send email")
            
    except Exception as e:
        logger.error(f"❌ Email sending failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")

@router.post("/upload")
async def upload_transcript(file: UploadFile = File(...)):
    """
    Upload transcript file and return text content
    """
    logger.info(f"📁 File upload request - filename: {file.filename}, content_type: {file.content_type}")
    
    try:
        # Check file type
        if not file.filename.endswith(('.txt', '.md')):
            logger.warning(f"❌ Invalid file type: {file.filename}")
            raise HTTPException(status_code=400, detail="Only .txt and .md files are supported")
        
        # Read file content
        content = await file.read()
        transcript_text = content.decode('utf-8')
        
        logger.info(f"✅ File uploaded successfully - {file.filename} ({len(transcript_text)} chars)")
        
        return {
            "success": True,
            "filename": file.filename,
            "transcript": transcript_text,
            "length": len(transcript_text)
        }
        
    except Exception as e:
        logger.error(f"❌ File upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
