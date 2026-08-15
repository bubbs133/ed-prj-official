from django.db import models
from django.contrib.auth.models import User

SENTIMENT_CHOICES = [
    ("positive", "Positive"),
    ("neutral", "Neutral"),
    ("negative", "Negative"),
]


# Create your models here.
class CareLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    urge_intensity = models.FloatField(default=5.0, blank=True)
    binge_urge = models.FloatField(default=5.0, blank=True)
    restriction = models.FloatField(default=5.0, blank=True)
    emotional_distress = models.FloatField(default=5.0, blank=True)
    stress_level = models.FloatField(default=5.0, blank=True)
    energy_level = models.FloatField(default=5.0, blank=True)
    sleep_hours = models.FloatField(default=7.0, blank=True)
    num_meals = models.FloatField(default=3.0, blank=True)
    exercise_minutes = models.FloatField(default=30, blank=True)
    notes = models.CharField(max_length=2000, blank=True)
    cluster = models.IntegerField(blank=True, null=True)
    state_name = models.CharField(max_length=100, blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True, blank=True)

    # --- NLP analysis of `notes` (the end-of-log reflection), computed in
    # the view on save. Same shape as JournalEntry so both feed one
    # consistent "language check-in" signal across the app.
    sentiment = models.CharField(
        max_length=10, choices=SENTIMENT_CHOICES, default="neutral"
    )
    sentiment_score = models.FloatField(default=0.0)
    distortion_tags = models.JSONField(default=list, blank=True)
    is_flagged = models.BooleanField(default=False)

    def __str__(self):
        return f"Care Log Entry: {self.user}, {self.date_created}"
