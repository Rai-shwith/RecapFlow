"""
Email Module for RecapFlow
Handles sending summarized transcripts via SMTP (Gmail)
"""

import os
import smtplib
import logging
import time
import re
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
from dotenv import load_dotenv

# Configure logger for email service
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def markdown_to_html(text):
    """
    Convert basic markdown to HTML for email rendering
    """
    if not text:
        return ""
    
    # Convert markdown to HTML
    html = text
    
    # Headers
    html = re.sub(r'^### (.*$)', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.*$)', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.*$)', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    
    # Bold and italic
    html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)
    
    # Code (inline)
    html = re.sub(r'`(.*?)`', r'<code style="background-color: #f1f1f1; padding: 2px 4px; border-radius: 3px;">\1</code>', html)
    
    # Unordered lists
    lines = html.split('\n')
    in_list = False
    result_lines = []
    
    for line in lines:
        line = line.strip()
        if line.startswith('- ') or line.startswith('* ') or line.startswith('+ '):
            if not in_list:
                result_lines.append('<ul>')
                in_list = True
            result_lines.append(f'<li>{line[2:]}</li>')
        else:
            if in_list:
                result_lines.append('</ul>')
                in_list = False
            if line:  # Only add non-empty lines
                result_lines.append(f'<p>{line}</p>')
    
    if in_list:
        result_lines.append('</ul>')
    
    return '\n'.join(result_lines)

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
        original_transcript: str = None,
        sender_details: dict = None
    ) -> bool:
        """
        Send the summarized transcript via email
        
        Args:
            recipients (List[str]): List of recipient email addresses
            summary (str): The AI-generated summary
            subject (str): Email subject line
            original_transcript (str, optional): Original transcript for reference
            sender_details (dict, optional): Sender contact information
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        start_time = time.time()
        recipient_count = len(recipients)
        summary_length = len(summary)
        
        logger.info(f"📤 Starting email send - recipients: {recipient_count}, subject: '{subject}', summary length: {summary_length} chars")
        logger.debug(f"Recipients: {', '.join(recipients)}")
        logger.info(f'sender_details :{sender_details}')
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.email_address
            msg['To'] = ', '.join(recipients)
            msg['Subject'] = subject
            
            logger.debug("Email headers configured successfully")
            
            # Email body
            body = self._create_email_body(summary, original_transcript, sender_details)
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
    
    def _create_email_body(self, summary: str, original_transcript: str = None, sender_details: dict = None) -> str:
        """
        Create HTML email body with summary and optional transcript
        
        Args:
            summary (str): The AI-generated summary
            original_transcript (str, optional): Original transcript
            sender_details (dict, optional): Sender contact information
            
        Returns:
            str: HTML email body
        """
        logger.debug(f"Creating email body - summary: {len(summary)} chars, transcript: {'included' if original_transcript else 'not included'}, sender details: {'included' if sender_details else 'not included'}")
        
        # Convert markdown summary to HTML
        summary_html = markdown_to_html(summary)
        
        html = f"""
        <span style="display:none">&nbsp;</span>
        <div style="font-family:Arial, sans-serif; font-size:14px; color:#333;">
            <h1>RecapFlow - Meeting Summary</h1>
            <p>AI-Generated Meeting Summary</p>
            
            <h2>Summary</h2>
            {summary_html}
            
            {self._add_sender_details_section(sender_details) if sender_details else ''}
            
            {self._add_transcript_section(original_transcript) if original_transcript else ''}
            
            <div style="border-top:1px solid #ddd; margin:20px 0;"></div>
            <p style="font-size:12px; color:#999;">Sent via RecapFlow</p>
        </div>
        """
        
        body_length = len(html)
        logger.debug(f"Email body created successfully - total size: {body_length} chars")
        return html
    
    def _add_sender_details_section(self, sender_details: dict) -> str:
        """Add sender details section to email"""
        if not sender_details:
            return ""
        
        logger.debug(f"Adding sender details section - details: {sender_details}")
        
        details_html = ""
        if sender_details.get('name'):
            details_html += f"<p><strong>{sender_details['name']}</strong></p>"
        
        if sender_details.get('position') and sender_details.get('company'):
            details_html += f"<p>{sender_details['position']} at {sender_details['company']}</p>"
        elif sender_details.get('position'):
            details_html += f"<p>{sender_details['position']}</p>"
        elif sender_details.get('company'):
            details_html += f"<p>{sender_details['company']}</p>"
        
        if sender_details.get('email'):
            details_html += f"<p>Email: <a href='mailto:{sender_details['email']}'>{sender_details['email']}</a></p>"
        
        if sender_details.get('phone'):
            details_html += f"<p>Phone: {sender_details['phone']}</p>"
        
        if sender_details.get('website'):
            details_html += f"<p>Website: <a href='{sender_details['website']}'>{sender_details['website']}</a></p>"
        
        return f"""
        <h3>Contact Information</h3>
        {details_html}
        """

    def _add_transcript_section(self, transcript: str) -> str:
        """Add original transcript section to email"""
        logger.debug(f"Adding transcript section - length: {len(transcript)} chars")
        return f"""
        <h3>Original Transcript</h3>
        <p>{transcript.replace(chr(10), '<br>')}</p>
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
