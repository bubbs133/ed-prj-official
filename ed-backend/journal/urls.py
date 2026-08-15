from django.urls import path
from . import views

journal_app = "journal"

urlpatterns = [
    path("journal/", views.journal_list, name="journal_list"),

]