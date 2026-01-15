from rest_framework import serializers
from .models import TrackingEntry

class TrackingEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackingEntry
        fields = '__all__' #automatic serializer fields related to model