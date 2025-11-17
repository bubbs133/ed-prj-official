from django.urls import path
from . import views

assessment_app = "assessment"

urlpatterns = [
    path("assessment/", views.assessment, name="assessment"),
    #path("logout/", views.logout_user, name='logout_user'),
    #path("home/", views.home, name="home"),
    #path("edit-records/<int:record_id>/", views.edit_records, name="edit_records"),

]