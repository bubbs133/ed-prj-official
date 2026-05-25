from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Sticker(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="media/")
    point_cost = models.IntegerField()
    is_active = models.BooleanField(default=True)

class PointTransaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action_type = models.CharField(max_length=100)
    points = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

class StickerCashIn(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sticker = models.ForeignKey(Sticker, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)
