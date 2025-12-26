from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Assessment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    answers = models.JSONField(null=True, blank=True)
    score = models.FloatField(null=True, blank=True)
    submitted = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f'{self.user}, {self.score}, {self.submitted}'