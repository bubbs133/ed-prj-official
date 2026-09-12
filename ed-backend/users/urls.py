from django.urls import path
from . import views

users_app = "users"

urlpatterns = [
    path("users/", views.signup_user, name="signup_user"),
    path("login/", views.login_user, name="login_user"),
    path("verify-code/", views.verify_code, name="verify_code"),
    path("user-summary/", views.user_profile_summary, name="user_profile_summary"),
]
