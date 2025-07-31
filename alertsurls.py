from django.urls import path
from . import views

urlpatterns = [
    path('send-alert/', views.send_alert, name='send_alert'),
]
