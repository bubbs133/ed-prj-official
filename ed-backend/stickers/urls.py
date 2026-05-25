from django.urls import path
from . import views

stickers_app = "stickers"

urlpatterns = [
    path("stickers/", views.stickers_list, name="stickers"),
    path("stickers/redeem/<int:sticker_id>/", views.redeem_sticker, name="redeem_sticker"),
]