from django.urls import path
from . import views

users_app = "users"

urlpatterns = [
    path("users/", views.user_list, name="user_list"),
    path("login/", views.login_user, name="login_user"),
    path("user-summary/", views.user_profile_summary, name="user_profile_summary"),
    #path('register/', RegisterView.as_view(), name='register'),
    #path("logout/", views.logout_user, name='logout_user'),
    #path("home/", views.home, name="home"),
    #path("edit-records/<int:record_id>/", views.edit_records, name="edit_records"),

]