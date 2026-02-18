from django.urls import path
from . import views

care_log_app = "carelog"

urlpatterns = [
    path("care-log/", views.care_log_list, name="care-log"),
    path("care-log-cluster/", views.care_log_cluster, name="care-log-cluster"),
    path("dashboard-recommendations/", views.dashboard_recommendations, name="dashboard-recommendations")
]