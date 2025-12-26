from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class MealEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    meal_description = models.CharField(max_length=10, blank=True)
    meal_type = models.CharField(max_length=10, blank=True)
    time = models.DateTimeField(auto_now=True)
    mood_before = models.JSONField(default=list, blank=True)
    mood_after = models.JSONField(default=list, blank=True)
    hunger_level = models.IntegerField(default=3)
    post_meal_notes = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return (f"{self.user}, {self.meal_type}")