from django.shortcuts import render
from django.http import JsonResponse
from .models import MealEntry
from .serializers import MealEntrySerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
@api_view(['GET'])
def meal_entry(request):
    if request.method == 'GET':
        meals = MealEntry.objects.all()
        serializer = MealEntrySerializer(meals, many=True)
    return JsonResponse(serializer.data, safe=False)