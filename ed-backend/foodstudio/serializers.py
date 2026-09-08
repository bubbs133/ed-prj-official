from rest_framework import serializers
from .models import ExplorerAttempt, BuiltMeal


class ExplorerAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExplorerAttempt
        fields = ["id", "prompt_id", "note", "tried_at"]
        read_only_fields = ["id", "tried_at"]


class BuiltMealSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuiltMeal
        fields = [
            "id",
            "name",
            "base",
            "protein",
            "colorful",
            "sauce",
            "extra",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class NudgeSerializer(serializers.Serializer):
    """Shape of the response from GET /api/food-studio/nudge/ — not a model,
    just documents the contract for the RN client."""

    type = serializers.ChoiceField(choices=["simple_dinner", "variety", "none"])
    message = serializers.CharField()
    cta = serializers.CharField()
    recipe_mood = serializers.CharField(allow_blank=True)
