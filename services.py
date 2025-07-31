import os
from twilio.rest import Client

def send_sms_alert(to_phone_number, message):
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    client = Client(account_sid, auth_token)

    message = client.messages.create(
        body=message,
        from_=os.environ.get('TWILIO_PHONE_NUMBER'),
        to=to_phone_number
    )

    return message.sid

def send_email_alert(to_email, subject, message):
    # Implementation for sending email (e.g., using Django's send_mail)
    # This is a placeholder
    pass
