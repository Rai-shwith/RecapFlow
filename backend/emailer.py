"""
Email Module for RecapFlow
Handles sending summarized transcripts via SMTP (Gmail)
"""

import os
import smtplib
import logging
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
from dotenv import load_dotenv

# Configure logger for email service
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class RecapFlowEmailer:
    """
    Handles email operations using Gmail SMTP
    """
    
    def __init__(self):
        """Initialize email configuration from environment variables"""
        logger.info("📧 Initializing RecapFlow emailer service")
        
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.email_address = os.getenv("EMAIL_ADDRESS")
        self.email_password = os.getenv("EMAIL_PASSWORD")
        
        logger.debug(f"SMTP configuration - server: {self.smtp_server}:{self.smtp_port}")
        
        if not self.email_address or not self.email_password:
            logger.error("❌ Email credentials missing from environment variables")
            raise ValueError("EMAIL_ADDRESS and EMAIL_PASSWORD must be set in environment variables")
        
        logger.info(f"✅ Email service initialized - sender: {self.email_address}")
    
    async def send_summary_email(
        self, 
        recipients: List[str], 
        summary: str, 
        subject: str = "Meeting Summary - RecapFlow",
        original_transcript: str = None
    ) -> bool:
        """
        Send the summarized transcript via email
        
        Args:
            recipients (List[str]): List of recipient email addresses
            summary (str): The AI-generated summary
            subject (str): Email subject line
            original_transcript (str, optional): Original transcript for reference
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        start_time = time.time()
        recipient_count = len(recipients)
        summary_length = len(summary)
        
        logger.info(f"📤 Starting email send - recipients: {recipient_count}, subject: '{subject}', summary length: {summary_length} chars")
        logger.debug(f"Recipients: {', '.join(recipients)}")
        
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.email_address
            msg['To'] = ', '.join(recipients)
            msg['Subject'] = subject
            
            logger.debug("Email headers configured successfully")
            
            # Email body
            body = self._create_email_body(summary, original_transcript)
            msg.attach(MIMEText(body, 'html'))
            
            body_size = len(body)
            logger.debug(f"Email body created - size: {body_size} chars, format: HTML")
            
            # Send email
            logger.debug(f"Connecting to SMTP server: {self.smtp_server}:{self.smtp_port}")
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()  # Enable security
                logger.debug("SMTP TLS connection established")
                
                server.login(self.email_address, self.email_password)
                logger.debug("SMTP authentication successful")
                
                server.send_message(msg)
                
            duration = time.time() - start_time
            logger.info(f"✅ Email sent successfully - duration: {duration:.2f}s, recipients: {recipient_count}, body size: {body_size} chars")
            return True
            
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"❌ SMTP authentication failed: {str(e)}")
            return False
        except smtplib.SMTPRecipientsRefused as e:
            logger.error(f"❌ SMTP recipients refused: {str(e)}")
            return False
        except smtplib.SMTPException as e:
            logger.error(f"❌ SMTP error occurred: {str(e)}")
            return False
        except Exception as e:
            duration = time.time() - start_time
            logger.error(f"❌ Email sending failed after {duration:.2f}s: {str(e)}")
            return False
    
    def _create_email_body(self, summary: str, original_transcript: str = None) -> str:
        """
        Create HTML email body with summary and optional transcript
        
        Args:
            summary (str): The AI-generated summary
            original_transcript (str, optional): Original transcript
            
        Returns:
            str: HTML email body
        """
        logger.debug(f"Creating email body - summary: {len(summary)} chars, transcript: {'included' if original_transcript else 'not included'}")
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .header {{ background-color: #4F46E5; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; }}
                .summary {{ background-color: #F3F4F6; padding: 15px; border-radius: 5px; margin: 15px 0; }}
                .footer {{ background-color: #E5E7EB; padding: 10px; text-align: center; font-size: 12px; }}
                .transcript {{ background-color: #F9FAFB; padding: 15px; border-radius: 5px; margin-top: 20px; max-height: 300px; overflow-y: auto; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🔄 RecapFlow</h1>
                <p>AI-Generated Meeting Summary</p>
            </div>
            
            <div class="content">
                <h2>Summary</h2>
                <div class="summary">
                    {summary.replace(chr(10), '<br>')}
                </div>
                
                {self._add_transcript_section(original_transcript) if original_transcript else ''}
            </div>
            
            <div class="footer">
                <p>Generated by RecapFlow </p>
                <p>This is an automated email. Please do not reply.</p>
            </div>
        </body>
        </html>
        """
        
        body_length = len(html)
        logger.debug(f"Email body created successfully - total size: {body_length} chars")
        return html
    
    def _add_transcript_section(self, transcript: str) -> str:
        """Add original transcript section to email"""
        logger.debug(f"Adding transcript section - length: {len(transcript)} chars")
        return f"""
        <h3>Original Transcript</h3>
        <div class="transcript">
            <small>{transcript.replace(chr(10), '<br>')}</small>
        </div>
        """
    
    async def test_email_connection(self) -> bool:
        """
        Test SMTP connection without sending an email
        
        Returns:
            bool: True if connection successful, False otherwise
        """
        logger.info("🔧 Testing email connection to SMTP server")
        start_time = time.time()
        
        try:
            logger.debug(f"Attempting connection to {self.smtp_server}:{self.smtp_port}")
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                logger.debug("TLS connection established")
                
                server.login(self.email_address, self.email_password)
                logger.debug("Authentication successful")
                
            duration = time.time() - start_time
            logger.info(f"✅ Email connection test successful - duration: {duration:.2f}s")
            return True
            
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"❌ Email connection test failed - authentication error: {str(e)}")
            return False
        except smtplib.SMTPException as e:
            logger.error(f"❌ Email connection test failed - SMTP error: {str(e)}")
            return False
        except Exception as e:
            duration = time.time() - start_time
            logger.error(f"❌ Email connection test failed after {duration:.2f}s: {str(e)}")
            return False
