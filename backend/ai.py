"""
AI Module for RecapFlow
Handles Gemini API calls for text summarization and processing
"""

import os
from typing import Optional
from google import genai
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logger
logger = logging.getLogger("RecapFlow.AI")

class RecapFlowAI:
    """
    Handles AI operations using Google Gemini API
    """
    
    def __init__(self):
        """Initialize Gemini AI with API key from environment"""
        logger.info("🤖 Initializing Gemini AI client...")
        try:
            self.client = genai.Client()
            self.model="gemini-2.5-flash"
            logger.info(f"✅ Gemini AI client initialized with model: {self.model}")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Gemini AI: {str(e)}")
            raise e
        
    def invoke(self,prompt:str)->str:
        """Returns the result for given prompt"""
        logger.debug(f"🔄 Sending request to Gemini - prompt length: {len(prompt)} chars")
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt
            )
            logger.debug(f"✅ Received response from Gemini - response length: {len(response.text)} chars")
            return response.text
        except Exception as e:
            logger.error(f"❌ Gemini API call failed: {str(e)}")
            raise e
        
    async def summarize_transcript(self, transcript: str, custom_prompt: Optional[str] = None) -> str:
        """
        Summarize a transcript using Gemini API
        
        Args:
            transcript (str): The input transcript text
            custom_prompt (str, optional): Custom instruction for summarization
            
        Returns:
            str: Summarized text
        """
        logger.info(f"📝 Starting transcript summarization - length: {len(transcript)} chars, custom_prompt: {bool(custom_prompt)}")
        
        try:
            # Default prompt if none provided
            if custom_prompt:
                prompt = f"{custom_prompt}\n\nContent to analyze:\n{transcript}"
                logger.debug("Using custom prompt for summarization")
            else:
                prompt = f"""
Create a clear, professional summary with the following structure:
- Use bullet points for key topics and decisions
- Highlight action items with specific owners and deadlines
- Include important dates(only if it is given), numbers, and commitments
- Format for business communication
- Start directly with the content, no introductory phrases

Content:
{transcript}
"""
                logger.debug("Using default prompt for summarization")
            
            result = self.invoke(prompt)
            logger.info(f"✅ Transcript summarization completed - output length: {len(result)} chars")
            return result
            
        except Exception as e:
            logger.error(f"❌ Transcript summarization failed: {str(e)}")
            raise Exception(f"AI summarization failed: {str(e)}")
    
    async def rephrase_summary(self, summary: str, style: str = "professional") -> str:
        """
        Rephrase a summary in different styles
        
        Args:
            summary (str): The summary to rephrase
            style (str): Style preference (professional, casual, technical, executive)
            
        Returns:
            str: Rephrased summary
        """
        logger.info(f"✏️ Starting summary rephrasing - style: {style}, length: {len(summary)} chars")
        
        try:
            style_prompts = {
                "professional": "Transform the following content into a professional, business-appropriate format:",
                "casual": "Rewrite the following content in a casual, friendly tone:",
                "technical": "Restructure the following content with technical detail and precision:",
                "executive": "Convert the following content into an executive briefing highlighting key decisions:"
            }
            
            selected_prompt = style_prompts.get(style, style_prompts['professional'])
            prompt = f"{selected_prompt}\n\n{summary}"
            logger.debug(f"Using style prompt: {style}")
            
            result = self.invoke(prompt)
            logger.info(f"✅ Summary rephrasing completed - output length: {len(result)} chars")
            return result
            
        except Exception as e:
            logger.error(f"❌ Summary rephrasing failed: {str(e)}")
            raise Exception(f"AI rephrasing failed: {str(e)}")
