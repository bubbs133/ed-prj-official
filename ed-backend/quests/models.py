from django.db import models
from django.contrib.auth.models import User


class Quest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    quest_summary = models.CharField(max_length=100, blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Quest Entry: {self.user}"


class QuestImage(models.Model):
    quest = models.ForeignKey(Quest, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="uploads/quest_images/")

    def __str__(self):
        return f"Image for Quest {self.quest.id}"
