from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class TrackingEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    num_meals = models.IntegerField(default=3, blank=True)
    meal_description = models.CharField(max_length=50, blank=True)
    avg_mood = models.IntegerField(default=5)
    satiation_level = models.IntegerField(default=5)
    exercise_amount_hr = models.IntegerField(default=5, blank=True)
    post_meal_notes = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return (f"{self.user}, {self.num_meals}")