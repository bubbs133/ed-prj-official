from rest_framework import serializers
from .models import Quest, QuestImage


class QuestImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestImage
        fields = ["id", "image"]


class QuestSerializer(serializers.ModelSerializer):
    images = QuestImageSerializer(many=True, read_only=True)

    class Meta:
        model = Quest
        fields = "__all__"
