from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from django.utils import timezone

class Resource(models.Model):
    RESOURCE_TYPE_CHOICES = [
        ('medical', 'Medical Team'),
        ('fire', 'Fire Department'),
        ('police', 'Police'),
        ('evacuation', 'Evacuation Center'),
        ('supply', 'Supply Drop'),
    ]

    STATUS_CHOICES = [
        ('available', 'Available'),
        ('assigned', 'Assigned'),
        ('unavailable', 'Unavailable'),
    ]

    name = models.CharField(max_length=255)
    type = models.CharField(max_length=15, choices=RESOURCE_TYPE_CHOICES)
    location = models.PointField(srid=4326)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='available')
    capacity = models.PositiveIntegerField(default=1)
    current_load = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
