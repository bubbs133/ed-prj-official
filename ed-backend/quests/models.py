from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Quest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    images = models.ManyToManyField("QuestImages")
    quest_summary = models.CharField(max_length=100, blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return (f"Quest Entry: {self.user}, {self.date_created}")
    
class QuestImages(models.Model):
    image = models.ImageField(upload_to="uploads/quest_images/", null=True, blank=True)