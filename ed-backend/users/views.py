from datetime import timedelta

from django.contrib.auth.models import User
from django.http import JsonResponse
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated

from carelog.models import CareLog
from journal.models import JournalEntry
from quests.models import Quest

from .serializers import SignUpSerializer, LoginSerializer
from .models import EmailVerificationCode
from .utils import send_verification_code


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_list(request):
    # Never expose the full user table. Return only the caller's own record.
    serializer = SignUpSerializer(request.user)
    return JsonResponse(serializer.data, safe=False)


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
                "preview": (
                    journal.entry[:100] + "..."
                    if len(journal.entry) > 100
                    else journal.entry
                ),
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
            "activity": activity,
            "weekly_activity": weekly_activity,
        }
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def signup_user(request):
    serializer = SignUpSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        send_verification_code(user, purpose="signup")
        return Response(
            {"detail": "Verification code sent to your email.", "email": user.email},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(
            {"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST
        )

    if not user.check_password(password):
        return Response(
            {"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST
        )

    send_verification_code(user, purpose="login")
    return Response(
        {"detail": "Verification code sent to your email.", "email": user.email},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_code(request):
    email = request.data.get("email")
    code = request.data.get("code")
    purpose = request.data.get("purpose")  # "signup" or "login"

    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        return Response(
            {"detail": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST
        )

    code_obj = (
        EmailVerificationCode.objects.filter(user=user, purpose=purpose, code=code)
        .order_by("-created_at")
        .first()
    )

    if not code_obj or not code_obj.is_valid():
        return Response(
            {"detail": "Invalid or expired code."}, status=status.HTTP_400_BAD_REQUEST
        )

    code_obj.is_used = True
    code_obj.save()

    if purpose == "signup":
        user.is_active = True
        user.save()

    token, _ = Token.objects.get_or_create(user=user)
    return Response(
        {"token": token.key, "username": user.username, "email": user.email}
    )
