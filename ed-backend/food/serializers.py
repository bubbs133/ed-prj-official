from rest_framework import serializers
from .models import MealEntry

class MealEntrySerializer(serializers.ModelSerializer):
    #emotions = serializers.SerializerMethodField()
    #hunger_levels = serializers.SerializerMethodField()
    #food_types = serializers.SerializerMethodField()

    class Meta:
        model = MealEntry
        #fields = ['meal_description', 'meal_type', 'mood_before', 'mood_after', 'hunger_level', 'post_meal_notes'] #automatic serializer fields related to model
        fields = '__all__'
