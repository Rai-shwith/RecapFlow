"""
Email service for RecapFlow
Handles SMTP email sending functionality
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    """
    Email service for sending RecapFlow summaries
    """
    
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.email_address = os.getenv("EMAIL_ADDRESS")
        self.email_password = os.getenv("EMAIL_PASSWORD")
    
    async def test_email_connection(self) -> bool:
        """
        Test SMTP connection
        
        Returns:
            bool: True if connection successful
        """
        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email_address, self.email_password)
            server.quit()
            return True
        except Exception as e:
            print(f"Email connection test failed: {e}")
            return False
    
    async def send_summary_email(self, recipients: List[str], summary: str, subject: str = "Meeting Summary - RecapFlow", original_transcript: str = None) -> bool:
        """
        Send summarized transcript to recipients
        
        Args:
            recipients (List[str]): List of recipient email addresses
            summary (str): AI-generated summary
            subject (str): Email subject line
            original_transcript (str): Optional original transcript
            
        Returns:
            bool: Success status
        """
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.email_address
            msg['To'] = ', '.join(recipients)
            msg['Subject'] = subject
            
            # Create email body
            body = f"""
Hello,

Here's your AI-generated meeting summary from RecapFlow:

--- SUMMARY ---
{summary}

"""
            
            if original_transcript:
                body += f"""
--- ORIGINAL TRANSCRIPT ---
{original_transcript}

"""
            
            body += """
Best regards,
RecapFlow Team

---
This email was sent automatically by RecapFlow.
"""
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email_address, self.email_password)
            text = msg.as_string()
            server.sendmail(self.email_address, recipients, text)
            server.quit()
            
            print(f"✅ Email sent successfully to {recipients}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send email: {e}")
            return False
