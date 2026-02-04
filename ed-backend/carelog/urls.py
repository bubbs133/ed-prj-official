from django.urls import path
from . import views

care_log_app = "carelog"

urlpatterns = [
    path("care-log/", views.care_log_list, name="care_log"),
]