from django.http import JsonResponse
from .models import JournalEntry
from .serializers import JournalEntrySerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from stickers.rewards.helper_functions import award_points

# Create your views here.
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def journal_list(request):
    if request.method == "GET":
        journal = JournalEntry.objects.all()
        serializer = JournalEntrySerializer(journal, many=True)
        return JsonResponse(serializer.data, safe=False)
    if request.method == "POST":
        serializer = JournalEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            award_points(request.user, "journal_submission", 1)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
