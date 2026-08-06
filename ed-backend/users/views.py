from datetime import timedelta

from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.utils import timezone
from .serializers import SignUpSerializer, LoginSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated

from carelog.models import CareLog
from journal.models import JournalEntry
from quests.models import Quest


# Create your views here.
@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def user_list(request):
    if request.method == "GET":
        # Never expose the full user table. Return only the caller's own record.
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication required."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = SignUpSerializer(request.user)
        return JsonResponse(serializer.data, safe=False)
    if request.method == "POST":
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)


def format_activity_date(date):
    """
    Converts Django datetime into frontend-friendly format
    """
    return date.isoformat() if date else None


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile_summary(request):

    user = request.user

    activity = []

    journals = JournalEntry.objects.filter(entry_author=user).order_by("-date_created")

    for journal in journals:

        activity.append(
            {
                "id": journal.id,
                "type": "journal",
                "date": format_activity_date(journal.date_created),
                "title": "Journal Entry",
                # short preview for card
                "preview": (
                    journal.entry[:100] + "..."
                    if len(journal.entry) > 100
                    else journal.entry
                ),
                # full text for modal
                "content": journal.entry,
            }
        )

    carelogs = CareLog.objects.filter(user=user).order_by("-date_created")

    for log in carelogs:

        activity.append(
            {
                "id": log.id,
                "type": "carelog",
                "date": format_activity_date(log.date_created),
                "title": "Care Log",
                "preview": (
                    f"Stress: {log.stress_level}/10 • " f"Energy: {log.energy_level}/10"
                ),
                # modal data
                "details": {
                    "urge_intensity": log.urge_intensity,
                    "binge_urge": log.binge_urge,
                    "restriction": log.restriction,
                    "emotional_distress": log.emotional_distress,
                    "stress_level": log.stress_level,
                    "energy_level": log.energy_level,
                    "sleep_hours": log.sleep_hours,
                    "num_meals": log.num_meals,
                    "exercise_minutes": log.exercise_minutes,
                    "notes": log.notes,
                },
            }
        )

    quests = Quest.objects.filter(user=user).order_by("-date_created")

    for quest in quests:

        activity.append(
            {
                "id": quest.id,
                "type": "quest",
                "date": format_activity_date(quest.date_created),
                "title": "Quest Completed",
                "preview": (
                    quest.quest_summary
                    if quest.quest_summary
                    else "Completed a recovery quest!"
                ),
                "details": {
                    "quest_summary": quest.quest_summary,
                },
            }
        )
    activity.sort(key=lambda x: x["date"], reverse=True)

    active_dates = {item["date"][:10] for item in activity if item["date"]}

    streak = 0

    if active_dates:

        current_day = timezone.now().date()

        while str(current_day) in active_dates:

            streak += 1

            current_day -= timedelta(days=1)
    today = timezone.now()

    week_start = today - timedelta(days=today.weekday())

    weekly_activity = [
        item for item in activity if item["date"] >= week_start.isoformat()
    ]
    journal_count = len([x for x in activity if x["type"] == "journal"])

    carelog_count = len([x for x in activity if x["type"] == "carelog"])

    quest_count = len([x for x in activity if x["type"] == "quest"])

    return Response(
        {
            "username": user.username,
            "email": user.email,
            "member_since": (user.date_joined.strftime("%B %Y")),
            "stats": {
                "journals": journal_count,
                "carelogs": carelog_count,
                "quests": quest_count,
                "streak": streak,
            },
            # full timeline for modal/history
            "activity": activity,
            # useful for dashboard cards
            "weekly_activity": weekly_activity,
        }
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    if request.method == "POST":
        print("REQUEST DATA RECEIVED:", request.data)
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {"token": token.key, "username": user.username, "email": user.email}
            )
        print("Serializer Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
