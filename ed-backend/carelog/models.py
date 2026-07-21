from django.db import models
from django.contrib.auth.models import User

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

    def __str__(self):
        return (f"Care Log Entry: {self.user}, {self.date_created}")