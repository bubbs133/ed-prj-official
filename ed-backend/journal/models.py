from django.db import models
from django.contrib.auth.models import User

# Create your models here.

ENTRY_TYPE_CHOICES = [
    ("prompted", "Prompted"),
    ("free_write", "Free Write"),
]

SENTIMENT_CHOICES = [
    ("positive", "Positive"),
    ("neutral", "Neutral"),
    ("negative", "Negative"),
]


class JournalEntry(models.Model):
    entry_author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="entry_author",
        null=True,
        blank=True,
    )
    entry = models.TextField(max_length=1000)
    entry_type = models.CharField(
        max_length=20, choices=ENTRY_TYPE_CHOICES, default="prompted"
    )
    date_created = models.DateTimeField(auto_now_add=True)

    # --- NLP analysis, computed automatically in the view on save ---
    # Kept as real columns (not recomputed on every read) so you can query
    # trends over time, e.g. JournalEntry.objects.filter(is_flagged=True)
    # or track a rolling spike in negative sentiment per user.
    sentiment = models.CharField(
        max_length=10, choices=SENTIMENT_CHOICES, default="neutral"
    )
    sentiment_score = models.FloatField(default=0.0)
    distortion_tags = models.JSONField(default=list, blank=True)
    is_flagged = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.entry_author}, {self.date_created}"
