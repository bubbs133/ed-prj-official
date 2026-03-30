from django.urls import path
from . import views

quests_app = "quest"

urlpatterns = [
    path("quest/", views.quest_list, name="quest_list"),

]