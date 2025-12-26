from django.urls import path
from . import views

exercise_app = "exercise"

urlpatterns = [
    path("exercises/", views.exercise_entry, name="exercise_entry"),
    #path("logout/", views.logout_user, name='logout_user'),
    #path("home/", views.home, name="home"),
    #path("edit-records/<int:record_id>/", views.edit_records, name="edit_records"),

]