from django.urls import path
from . import views

urlpatterns = [
    path("quest/", views.quest_list, name="quest_list"),
    path("quest/submit/", views.quest_submission, name="quest_submission"),
]
