from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class ExerciseEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise_description = models.CharField(max_length=10, blank=True)
    exercise_type = models.CharField(max_length=10, blank=True)
    time = models.DateTimeField(auto_now=True)
    behavior_before = models.JSONField(default=list, blank=True)
    behavior_after = models.JSONField(default=list, blank=True)
    post_exercise_notes = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return (f"{self.user}, {self.exercise_type}")