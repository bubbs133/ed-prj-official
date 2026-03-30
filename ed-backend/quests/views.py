from django.http import JsonResponse
from .models import Quest
from .serializers import QuestSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

# Create your views here.
@api_view(["GET"])
def quest_list(request):
    if request.method == "GET":
        quest_entry = Quest.objects.all()
        serializer = QuestSerializer(quest_entry, many=True)
        quest_data = serializer.data
        return Response(quest_data)
    return Response(quest_data.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def quest_submission(request):
    if request.method == "POST":
        serializer = QuestSerializer(data=request.data)
        if serializer.is_valid():
            val_data = serializer.validated_data

            quest_input = val_data.save()

            return Response(
                {
                    "entry": QuestSerializer(
                        quest_input
                    ).data
                },
                status=status.HTTP_201_CREATED,
            )
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)