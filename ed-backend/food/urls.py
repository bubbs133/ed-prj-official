from django.urls import path
from . import views

food_app = "food"

urlpatterns = [
    path("meal/", views.meal_entry, name="meal_entry"),
    #path("logout/", views.logout_user, name='logout_user'),
    #path("home/", views.home, name="home"),
    #path("edit-records/<int:record_id>/", views.edit_records, name="edit_records"),

]