import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Resource

class ResourceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'resources'

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

        if message_type == 'resource_update':
            resource_id = text_data_json['resource_id']
            resource = await self.get_resource(resource_id)
            
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'resource_message',
                    'resource': resource
                }
            )

    # Receive message from room group
    async def resource_message(self, event):
        resource = event['resource']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'resource_update',
            'resource': resource
        }))

    @database_sync_to_async
    def get_resource(self, resource_id):
        resource = Resource.objects.get(id=resource_id)
        from .serializers import ResourceSerializer
        serializer = ResourceSerializer(resource)
        return serializer.data
