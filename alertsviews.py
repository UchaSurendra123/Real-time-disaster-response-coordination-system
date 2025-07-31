from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .services import send_sms_alert, send_email_alert

@csrf_exempt
@require_POST
def send_alert(request):
    alert_type = request.POST.get('type')
    recipient = request.POST.get('recipient')
    message = request.POST.get('message')
    
    if alert_type == 'sms':
        try:
            sid = send_sms_alert(recipient, message)
            return JsonResponse({'status': 'success', 'sid': sid})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    elif alert_type == 'email':
        subject = request.POST.get('subject', 'Disaster Alert')
        try:
            # Placeholder for email sending
            # send_email_alert(recipient, subject, message)
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    
    return JsonResponse({'status': 'error', 'message': 'Invalid alert type'})
