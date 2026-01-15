from django.urls import path
from . import views

tracking_app = "tracking"

urlpatterns = [
    path("tracking/", views.tracking_list, name="tracking_list"),
    #path("logout/", views.logout_user, name='logout_user'),
    #path("home/", views.home, name="home"),
    #path("edit-records/<int:record_id>/", views.edit_records, name="edit_records"),

]