from rest_framework.routers import DefaultRouter
from django.urls import path, include

from .views import ExplorerAttemptViewSet, BuiltMealViewSet, NudgeView

router = DefaultRouter()
router.register(
    r"explorer-attempts", ExplorerAttemptViewSet, basename="explorer-attempt"
)
router.register(r"built-meals", BuiltMealViewSet, basename="built-meal")

urlpatterns = [
    path("", include(router.urls)),
    path("nudge/", NudgeView.as_view(), name="food-studio-nudge"),
]
