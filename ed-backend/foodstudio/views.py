"""
food_studio/views.py

Three endpoints:
- POST/GET /explorer-attempts/  — log + list Food Explorer "I tried it" entries
- POST/GET /built-meals/        — save + list meals from the Create flow
- GET      /nudge/               — a single, gentle, behaviorally-driven
  suggestion for the Home screen banner

The nudge endpoint is the ML hook you described: it should read from your
existing personalized dashboard / clustering system rather than duplicate
logic here. Plug your real signal source into `get_recent_signals()` below.
"""

from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import ExplorerAttempt, BuiltMeal
from .serializers import ExplorerAttemptSerializer, BuiltMealSerializer, NudgeSerializer


class ExplorerAttemptViewSet(viewsets.ModelViewSet):
    """
    list:   GET  /api/food-studio/explorer-attempts/
    create: POST /api/food-studio/explorer-attempts/
    """

    serializer_class = ExplorerAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "head"]  # no update/delete needed for now

    def get_queryset(self):
        return ExplorerAttempt.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BuiltMealViewSet(viewsets.ModelViewSet):
    """
    list:   GET  /api/food-studio/built-meals/
    create: POST /api/food-studio/built-meals/
    """

    serializer_class = BuiltMealSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "head"]

    def get_queryset(self):
        return BuiltMeal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ---------------------------------------------------------------------------
# Nudge logic
# ---------------------------------------------------------------------------
#
# IMPORTANT: this should only ever read *behavioral* signals — things like
# reported energy, stress, meal-prep difficulty, or lack of variety in what
# a user has explored lately. It must never be derived from weight, calorie
# intake, or any restriction/compensation-adjacent metric. If your existing
# dashboard/clustering system exposes those alongside legitimate behavioral
# signals, filter at the source, not here — this endpoint should not even
# receive fields it shouldn't use.


def get_recent_signals(user):
    """
    Replace this with a real call into your existing personalization /
    clustering system, e.g.:

        from dashboard.services import get_latest_cluster_signals
        return get_latest_cluster_signals(user, days=7)

    Expected shape (example):
        {
            "low_energy": bool,
            "high_stress": bool,
            "meal_prep_difficulty": bool,
            "explorer_variety_last_14_days": int,  # distinct prompt_ids tried
        }
    """
    recent_attempts = ExplorerAttempt.objects.filter(user=user).order_by("-tried_at")[
        :14
    ]
    variety = len({a.prompt_id for a in recent_attempts})

    return {
        "low_energy": False,
        "high_stress": False,
        "meal_prep_difficulty": False,
        "explorer_variety_last_14_days": variety,
    }


def build_nudge(signals):
    """Pure function: signals in, nudge dict out. Kept separate from the
    view so it's easy to unit test and easy to swap for a model-driven
    version later without touching request/response handling."""

    if (
        signals.get("low_energy")
        or signals.get("high_stress")
        or signals.get("meal_prep_difficulty")
    ):
        return {
            "type": "simple_dinner",
            "message": "Let's keep dinner simple tonight — here are a few meals that take about ten minutes.",
            "cta": "See quick meals",
            "recipe_mood": "quick",
        }

    if signals.get("explorer_variety_last_14_days", 0) == 0:
        return {
            "type": "variety",
            "message": "Want to try adding one different color to a familiar meal?",
            "cta": "Open Food Explorer",
            "recipe_mood": "",
        }

    return {"type": "none", "message": "", "cta": "", "recipe_mood": ""}


class NudgeView(APIView):
    """GET /api/food-studio/nudge/"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        signals = get_recent_signals(request.user)
        nudge = build_nudge(signals)
        serializer = NudgeSerializer(nudge)
        return Response(serializer.data, status=status.HTTP_200_OK)
