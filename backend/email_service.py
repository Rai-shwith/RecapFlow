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
    
    async def send_summary_email(self, recipients: List[str], summary: str, subject: str = "Meeting Summary - RecapFlow", original_transcript: str = None, sender_details: dict = None) -> bool:
        """
        Send summarized transcript to recipients
        
        Args:
            recipients (List[str]): List of recipient email addresses
            summary (str): AI-generated summary
            subject (str): Email subject line
            original_transcript (str): Optional original transcript
            sender_details (dict): Optional sender contact information
            
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
            html_body = f"""
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Hello,</p>
    
    <p>Here's your AI-generated meeting summary from RecapFlow:</p>
    
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">📋 Summary</h3>
        <div style="white-space: pre-wrap;">{summary}</div>
    </div>
"""
            
            if original_transcript:
                html_body += f"""
    <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">📄 Original Transcript</h3>
        <div style="white-space: pre-wrap; font-size: 14px;">{original_transcript}</div>
    </div>
"""
            
            html_body += """
    <p>Best regards,<br>
    RecapFlow Team</p>
    
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;">
    <p style="font-size: 12px; color: #666;">This email was sent automatically by RecapFlow.</p>
</body>
</html>
"""
            
            msg.attach(MIMEText(html_body, 'html'))
            
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
