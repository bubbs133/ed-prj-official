from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
    user_name = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user', null=True, blank=True)
    entry = models.TextField(max_length=200)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.entry_author}, {self.date_created}'