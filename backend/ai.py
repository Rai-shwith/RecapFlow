"""
AI Module for RecapFlow
Handles OpenRouter API calls for text summarization and processing with model fallback arrays and auto-routing.
"""

import os
import json
import logging
from typing import Optional, List, Dict, Any, Tuple
import httpx
from dotenv import load_dotenv

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path=dotenv_path)
else:
    load_dotenv()

# Configure logger
logger = logging.getLogger("RecapFlow.AI")

DEFAULT_MODELS = [
    "openrouter/free",
    "google/gemma-4-26b-a4b-it:free",
    "qwen/qwen3.8-27b:free",
]

class RecapFlowAI:
    """
    Handles AI operations using OpenRouter API with resilient fallback model arrays and auto-routing.
    """
    
    def __init__(self):
        """Initialize OpenRouter AI configuration from environment"""
        logger.info("🤖 Initializing OpenRouter AI client...")
        self.api_key = os.getenv("OPEN_ROUTER_API_KEY")
        if not self.api_key:
            logger.error("❌ OPEN_ROUTER_API_KEY is not set in environment!")
            raise ValueError("OPEN_ROUTER_API_KEY environment variable is required")
            
        self.api_url = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1/chat/completions")
        self.site_url = os.getenv("APP_SITE_URL", "https://recapflow.com")
        self.app_name = os.getenv("APP_TITLE", "RecapFlow")
        self.timeout = float(os.getenv("OPENROUTER_TIMEOUT", "45.0"))
        self.sort_by = os.getenv("OPENROUTER_SORT_BY", "throughput")
        self.partition = os.getenv("OPENROUTER_PARTITION", "none")
        
        # Parse default models list from env (comma-separated or JSON list)
        env_models = os.getenv("OPENROUTER_MODELS")
        if env_models:
            try:
                if env_models.strip().startswith("["):
                    self.default_models = json.loads(env_models)
                else:
                    self.default_models = [m.strip() for m in env_models.split(",") if m.strip()]
            except Exception as e:
                logger.warning(f"⚠️ Failed to parse OPENROUTER_MODELS ({e}), using default fallback list.")
                self.default_models = DEFAULT_MODELS
        else:
            self.default_models = DEFAULT_MODELS
            
        logger.info(f"✅ OpenRouter AI client initialized with fallback models: {self.default_models}")
        logger.info(f"⚡ Routing configuration: sort_by={self.sort_by}, partition={self.partition}")

    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": self.site_url,
            "X-Title": self.app_name,
            "Content-Type": "application/json",
        }

    async def invoke(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        models: Optional[List[str]] = None,
        temperature: float = 0.3,
    ) -> Tuple[str, str]:
        """
        Invokes OpenRouter chat completions with fallback model array.
        
        Args:
            prompt (str): User prompt content
            system_prompt (str, optional): System message instruction
            models (List[str], optional): Override fallback models array
            temperature (float): Sampling temperature
            
        Returns:
            Tuple[str, str]: (generated_text, model_used)
        """
        raw_models = models if models and len(models) > 0 else self.default_models
        # OpenRouter requires 'models' array to have 3 items or fewer
        candidate_models = list(raw_models)[:3]
        if len(raw_models) > 3:
            logger.info(f"ℹ️ OpenRouter limits models array to 3 items; using top 3: {candidate_models}")
            
        logger.debug(f"🔄 Sending request to OpenRouter - prompt length: {len(prompt)} chars, candidate models: {candidate_models}")
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        payload: Dict[str, Any] = {
            "models": candidate_models,
            "messages": messages,
            "temperature": temperature,
            "provider": {
                "sort": {
                    "by": self.sort_by,
                    "partition": self.partition
                }
            }
        }
        
        headers = self._get_headers()
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(self.api_url, headers=headers, json=payload)
                
                if response.status_code != 200:
                    logger.error(f"❌ OpenRouter API returned error {response.status_code}: {response.text}")
                    raise Exception(f"OpenRouter API error {response.status_code}: {response.text}")
                    
                data = response.json()
                served_model = data.get("model", "unknown")
                choices = data.get("choices", [])
                
                if not choices or not choices[0].get("message", {}).get("content"):
                    logger.error(f"❌ OpenRouter returned empty response: {data}")
                    raise Exception("OpenRouter returned an empty response")
                    
                content = choices[0]["message"]["content"].strip()
                logger.info(f"✅ OpenRouter request satisfied by model: {served_model} (response length: {len(content)} chars)")
                return content, served_model
                
            except httpx.TimeoutException as e:
                logger.error(f"⏱️ OpenRouter request timed out after {self.timeout}s: {e}")
                raise Exception(f"OpenRouter request timed out after {self.timeout}s")
            except Exception as e:
                logger.error(f"❌ OpenRouter API call failed: {str(e)}")
                raise e

    async def summarize_transcript(
        self,
        transcript: str,
        custom_prompt: Optional[str] = None,
        models: Optional[List[str]] = None,
    ) -> Tuple[str, str]:
        """
        Summarize a transcript using OpenRouter with fallback array
        
        Args:
            transcript (str): The input transcript text
            custom_prompt (str, optional): Custom instruction for summarization
            models (List[str], optional): Custom fallback models array
            
        Returns:
            Tuple[str, str]: (Summarized text, model used)
        """
        logger.info(f"📝 Starting transcript summarization - length: {len(transcript)} chars, custom_prompt: {bool(custom_prompt)}")
        
        if custom_prompt:
            prompt = f"{custom_prompt}\n\nContent to analyze:\n{transcript}"
            logger.debug("Using custom prompt for summarization")
        else:
            prompt = f"""Create a clear, professional summary with the following structure:
- Use bullet points for key topics and decisions
- Highlight action items with specific owners and deadlines
- Include important dates (only if given), numbers, and commitments
- Format for business communication
- Start directly with the content, no introductory phrases

Content:
{transcript}"""
            logger.debug("Using default prompt for summarization")
            
        system_instruction = "You are an expert executive meeting assistant. Produce structured, concise, and highly accurate meeting notes and summaries."
        return await self.invoke(prompt=prompt, system_prompt=system_instruction, models=models)

    async def rephrase_summary(
        self,
        summary: str,
        style: str = "professional",
        models: Optional[List[str]] = None,
    ) -> Tuple[str, str]:
        """
        Rephrase a summary in different styles using OpenRouter with fallback array
        
        Args:
            summary (str): The summary to rephrase
            style (str): Style preference (professional, casual, technical, executive)
            models (List[str], optional): Custom fallback models array
            
        Returns:
            Tuple[str, str]: (Rephrased summary, model used)
        """
        logger.info(f"✏️ Starting summary rephrasing - style: {style}, length: {len(summary)} chars")
        
        style_prompts = {
            "professional": "Transform the following content into a professional, business-appropriate format:",
            "casual": "Rewrite the following content in a casual, friendly tone:",
            "technical": "Restructure the following content with technical detail and precision:",
            "executive": "Convert the following content into an executive briefing highlighting key decisions:"
        }
        
        selected_prompt = style_prompts.get(style, style_prompts["professional"])
        prompt = f"{selected_prompt}\n\n{summary}"
        
        system_instruction = "You are a communication and writing specialist. Rewrite and rephrase text cleanly according to requested tone."
        return await self.invoke(prompt=prompt, system_prompt=system_instruction, models=models)
