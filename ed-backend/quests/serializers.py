from rest_framework import serializers
from .models import Quest, QuestImages

class QuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quest
        fields = '__all__' #automatic serializer fields related to model

class QuestImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestImages
        fields = '__all__'