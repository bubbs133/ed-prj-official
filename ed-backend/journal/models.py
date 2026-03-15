from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class JournalEntry(models.Model):
    entry_author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entry_author', null=True, blank=True)
    entry = models.TextField(max_length=200)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.entry_author}, {self.date_created}'