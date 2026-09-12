import random

from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

from stickers.models import Sticker


# Create your models here.
class Profile(models.Model):
    user_name = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user", null=True, blank=True
    )
    entry = models.TextField(max_length=200)
    points = models.IntegerField(default=0)
    lifetime_points = models.IntegerField(default=0)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_name}, {self.date_created}"


class UserSticker(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sticker = models.ForeignKey(Sticker, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user}, {self.sticker}, {self.unlocked_at}"


class EmailVerificationCode(models.Model):
    PURPOSE_CHOICES = [
        ("signup", "Signup"),
        ("login", "Login"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="verification_codes"
    )
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=10, choices=PURPOSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user}, {self.purpose}, {self.code}"

    @staticmethod
    def generate_code():
        return f"{random.randint(0, 999999):06d}"

    def is_expired(self):
        ttl = timezone.timedelta(minutes=settings.VERIFICATION_CODE_TTL_MINUTES)
        return timezone.now() > self.created_at + ttl

    def is_valid(self):
        return not self.is_used and not self.is_expired()
