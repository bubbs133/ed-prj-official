from django.urls import path
from . import views

journal_app = "journal"

urlpatterns = [
    path("journal/", views.journal_list, name="journal_list"),
    #path("logout/", views.logout_user, name='logout_user'),
    #path("home/", views.home, name="home"),
    #path("edit-records/<int:record_id>/", views.edit_records, name="edit_records"),

]