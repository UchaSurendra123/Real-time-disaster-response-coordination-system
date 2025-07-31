import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from incidents.routing import websocket_urlpatterns as incident_patterns
from resources.routing import websocket_urlpatterns as resource_patterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'disaster_response.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            incident_patterns + resource_patterns
        )
    ),
})
