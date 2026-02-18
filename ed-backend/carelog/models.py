from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class CareLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    urge_intensity = models.IntegerField(default=5, blank=True)
    binge_urge = models.IntegerField(default=5, blank=True)
    restriction = models.IntegerField(default=5, blank=True)
    emotional_distress = models.IntegerField(default=5, blank=True)
    stress_level = models.IntegerField(default=5, blank=True)
    energy_level = models.IntegerField(default=5, blank=True)
    sleep_hours = models.IntegerField(default=7, blank=True)
    num_meals = models.IntegerField(default=3, blank=True)
    exercise_minutes = models.IntegerField(default=30, blank=True)
    notes = models.CharField(max_length=100, blank=True)
    cluster = models.IntegerField(blank=True, null=True)
    state_name = models.CharField(max_length=100, blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return (f"Care Log Entry: {self.user}, {self.date_created}")