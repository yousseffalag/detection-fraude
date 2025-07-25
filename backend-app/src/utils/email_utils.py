import os
from email.message import EmailMessage
import aiosmtplib

async def send_verification_email(to_email: str, username: str, token: str):
    message = EmailMessage()
    message["From"] = f"{os.getenv('EMAIL_FROM_NAME')} <{os.getenv('EMAIL_FROM')}>"
    message["To"] = to_email
    message["Subject"] = "Confirm your email address"

    verification_link = f"http://localhost:8000/auth/verify-email?token={token}"

    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #4CAF50;">Welcome to Fraud Detection Platform</h2>
            <p>Hi <strong>{username}</strong>,</p>
            <p>Thank you for signing up. To complete your registration, please verify your email address by clicking the button below:</p>
            <p style="text-align: center; margin: 20px 0;">
                <a href="{verification_link}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
                    Verify Email
                </a>
            </p>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not sign up, you can ignore this email.</p>
            <hr>
            <p style="font-size: 12px; color: #888;">Fraud Detection Team</p>
        </div>
    </body>
    </html>
    """

    message.set_content(f"Please verify your email using this link: {verification_link}")
    message.add_alternative(html_content, subtype="html")

    await aiosmtplib.send(
        message,
        hostname=os.getenv("EMAIL_HOST"),
        port=int(os.getenv("EMAIL_PORT")),
        username=os.getenv("EMAIL_HOST_USER"),
        password=os.getenv("EMAIL_HOST_PASSWORD"),
        start_tls=True,
    )
