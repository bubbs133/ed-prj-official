"""
food_studio/models.py

Two small models:
- ExplorerAttempt: logs when a user tries a Food Explorer prompt, with an
  optional journal note. Feeds your existing Care Log / journaling system.
- BuiltMeal: optionally saves a meal a user assembled in the Create flow.

Neither model stores calories, weight, or macro targets — intentionally.
If you want to surface "variety" signals for the nudge logic later, derive
them from prompt_id / mood tags rather than adding numeric fields here.
"""

from django.conf import settings
from django.db import models


class ExplorerAttempt(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="explorer_attempts",
    )
    prompt_id = models.CharField(
        max_length=64
    )  # matches EXPLORER_PROMPTS ids on the client
    note = models.TextField(blank=True, default="")
    tried_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-tried_at"]

    def __str__(self):
        return f"{self.user_id} tried {self.prompt_id} at {self.tried_at:%Y-%m-%d}"


class BuiltMeal(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="built_meals",
    )
    name = models.CharField(max_length=120)
    base = models.CharField(max_length=32, blank=True, default="")
    protein = models.CharField(max_length=32, blank=True, default="")
    colorful = models.CharField(max_length=32, blank=True, default="")
    sauce = models.CharField(max_length=32, blank=True, default="")
    extra = models.CharField(max_length=32, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.user_id})"
