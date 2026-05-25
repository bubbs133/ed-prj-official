from django.db import models
from django.contrib.auth.models import User
from stickers.models import Sticker

# Create your models here.
class Profile(models.Model):
    user_name = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user', null=True, blank=True)
    entry = models.TextField(max_length=200)
    points = models.IntegerField(default=0)
    lifetime_points = models.IntegerField(default=0)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user_name}, {self.date_created}'
    
class UserSticker(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sticker = models.ForeignKey(Sticker, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user}, {self.sticker}, {self.unlocked_at}'