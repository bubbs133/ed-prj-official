from rest_framework import serializers
from .models import JournalEntry


class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = [
            "id",
            "entry_author",
            "entry",
            "entry_type",
            "date_created",
            "sentiment",
            "sentiment_score",
            "distortion_tags",
            "is_flagged",
        ]
        # These are computed server-side by the NLP analyzer — the client
        # should never set them directly.
        read_only_fields = [
            "sentiment",
            "sentiment_score",
            "distortion_tags",
            "is_flagged",
        ]
