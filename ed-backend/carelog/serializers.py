from rest_framework import serializers
from .models import CareLog


class CareLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareLog
        fields = "__all__"  # automatic serializer fields related to model
        # cluster/state_name/sentiment fields are all computed server-side
        # (in the view, via ML clustering + the NLP analyzer) and then
        # passed into serializer.save() as overrides — read_only here just
        # makes that explicit and stops a client from spoofing them.
        read_only_fields = [
            "cluster",
            "state_name",
            "sentiment",
            "sentiment_score",
            "distortion_tags",
            "is_flagged",
        ]
