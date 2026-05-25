from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Sticker, PointTransaction, StickerCashIn

admin.site.register(Sticker)