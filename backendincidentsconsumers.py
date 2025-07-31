import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Incident

class IncidentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'incidents'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json['type']

        if message_type == 'incident_update':
            incident_id = text_data_json['incident_id']
            incident = await self.get_incident(incident_id)
            
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'incident_message',
                    'incident': incident
                }
            )

    # Receive message from room group
    async def incident_message(self, event):
        incident = event['incident']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'incident_update',
            'incident': incident
        }))

    @database_sync_to_async
    def get_incident(self, incident_id):
        incident = Incident.objects.get(id=incident_id)
        from .serializers import IncidentSerializer
        serializer = IncidentSerializer(incident)
        return serializer.data
