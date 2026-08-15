from django.http import JsonResponse
from .models import JournalEntry
from .serializers import JournalEntrySerializer
from .nlp.nlp import analyze, AnalysisResult, ALL_OR_NOTHING
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
        journal = JournalEntry.objects.filter(entry_author=request.user)
        serializer = JournalEntrySerializer(journal, many=True)
        return JsonResponse(serializer.data, safe=False)

    if request.method == "POST":
        serializer = JournalEntrySerializer(data=request.data)
        if serializer.is_valid():
            # Run the NLP analysis on the raw entry text before saving so
            # the flag/sentiment are stored alongside the entry itself.
            result = analyze(serializer.validated_data.get("entry", ""))

            entry = serializer.save(
                entry_author=request.user,
                sentiment=result.sentiment,
                sentiment_score=result.sentiment_score,
                distortion_tags=result.distortion_tags,
                is_flagged=result.is_flagged,
            )
            award_points(request.user, "journal_submission", 1)

            response_data = JournalEntrySerializer(entry).data
            # Not a DB field — just a one-time nudge for the client to
            # optionally surface right after this submission. The client
            # decides how (or whether) to display it.
            response_data["reflection_prompt"] = result.reflection_prompt
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
