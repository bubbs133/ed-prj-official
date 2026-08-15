from django.http import JsonResponse
from .models import CareLog
from .serializers import CareLogSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .ml.helper_functions import (
    cluster_user,
    get_recommendations,
    get_feature_insights,
    calculate_trend,
    aggregate_weekly_feature_data,
)

# Reused from the journal app — same rule-based distortion/sentiment
# analyzer applied to any reflective text (journal entries, care log
# notes). See journal/nlp.py for the implementation + design notes.
# If this cross-app import ever feels awkward, move nlp.py into a small
# shared app (e.g. core/nlp.py) and update both imports.
from journal.nlp import analyze
from journal.models import JournalEntry

import random

from stickers.rewards.helper_functions import award_points

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from django.contrib.auth.decorators import login_required

from datetime import timedelta
from django.utils import timezone
import datetime


# Create your views here.
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def care_log_list(request):
    # Only return the authenticated user's own care logs.
    care_log_entry = CareLog.objects.filter(user=request.user).order_by("-date_created")
    serializer = CareLogSerializer(care_log_entry, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def care_log_cluster(request):
    if request.method == "POST":
        serializer = CareLogSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data

            cluster, state_name = cluster_user(data)

            # Analyze the end-of-log reflection text the same way journal
            # entries are analyzed, so a spike in distortion language shows
            # up regardless of which part of the app the user wrote it in.
            result = analyze(data.get("notes", ""))

            care_log_input = serializer.save(
                user=request.user,
                cluster=cluster,
                state_name=state_name,
                sentiment=result.sentiment,
                sentiment_score=result.sentiment_score,
                distortion_tags=result.distortion_tags,
                is_flagged=result.is_flagged,
            )

            award_points(request.user, "care_log_submission", 1)

            return Response(
                {
                    "entry": CareLogSerializer(
                        care_log_input
                    ).data,  # converts saved care log entry db obj into JSON so frontend can read it
                    "cluster": cluster,  # splits btwn entry and cluster so ml pred can be easier to access
                    "state_name": state_name,
                    # Not a DB field on its own — a one-time gentle nudge
                    # the client can optionally surface right after this
                    # submission, same UX pattern as the journal screen.
                    "reflection_prompt": result.reflection_prompt,
                },
                status=status.HTTP_201_CREATED,
            )
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_recommendations(request):
    if request.method != "GET":
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    latest_entry = (
        CareLog.objects.filter(user=request.user).order_by("-date_created").first()
    )

    if not latest_entry:
        return Response(
            {"detail": "No care log data for this user."},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = CareLogSerializer(latest_entry)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Gentle, non-alarming copy per distortion tag for the weekly rollup.
# Deliberately softer/more zoomed-out than the per-entry prompts in
# journal/nlp.py, since this is summarizing a pattern across several days
# rather than reacting to one moment.
WEEKLY_LANGUAGE_MESSAGES = {
    "self_criticism": "This week had some entries with tough self-talk. Want to revisit one with the Distortion Breaker?",
    "food_morality": "A few entries this week framed food as good or bad. Want to explore that pattern together?",
    "all_or_nothing": "A few entries leaned all-or-nothing this week. Want to practice reframing one?",
    "catastrophizing": "A few entries this week described things as disasters or unbearable. Want to slow one down together?",
    "should_statements": "There were a lot of 'shoulds' in your entries this week. Want to loosen that up a bit?",
    "default": "A few entries this week had some heavy language in them. Want to take a look together?",
}

# Shown when the week's entries lean positive and nothing was flagged —
# worth surfacing on its own, not just silence when things are going well.
WEEKLY_POSITIVE_MESSAGES = [
    "Your entries this week sounded steady and self-compassionate.",
    "A lot of grounded, hopeful language showed up in your entries this week.",
    "Your reflections this week leaned warm and encouraging — worth noticing.",
]

WEEKLY_NEUTRAL_MESSAGE = (
    "Your entries this week were pretty even-keeled. Keeping up with your "
    "check-ins either way is worth noting."
)


def _build_language_insight(*entry_groups):
    """
    Combine per-entry NLP results from any number of sources (JournalEntry,
    CareLog, ...) into one weekly signal. Each source just needs to carry
    the shared `is_flagged` / `distortion_tags` / `sentiment` fields.

    Unlike the earlier version, this always returns a message when there's
    at least one entry — a week with no distortion flags but a clearly
    positive tone gets its own message rather than staying silent, since a
    good week is signal too, not just the absence of a bad one.
    """
    all_entries = []
    for group in entry_groups:
        all_entries.extend(group)

    total = len(all_entries)

    if total == 0:
        return {
            "total_entries": 0,
            "flagged_count": 0,
            "top_distortion": None,
            "distortion_counts": {},
            "sentiment_counts": {"positive": 0, "neutral": 0, "negative": 0},
            "tone": "no_data",
            "message": None,
        }

    flagged_entries = [e for e in all_entries if e.is_flagged]
    flagged_count = len(flagged_entries)

    tag_counts = {}
    sentiment_counts = {"positive": 0, "neutral": 0, "negative": 0}
    for entry in all_entries:
        for tag in entry.distortion_tags or []:
            tag_counts[tag] = tag_counts.get(tag, 0) + 1
        sentiment_counts[entry.sentiment] = sentiment_counts.get(entry.sentiment, 0) + 1

    top_tag = max(tag_counts, key=tag_counts.get) if tag_counts else None
    positive_ratio = sentiment_counts["positive"] / total

    # Flagged language takes priority even in an otherwise positive week —
    # a self-critical entry sitting next to three good ones is still worth
    # a gentle look.
    if flagged_count > 0:
        tone = "flagged"
        message = WEEKLY_LANGUAGE_MESSAGES.get(
            top_tag, WEEKLY_LANGUAGE_MESSAGES["default"]
        )
    elif positive_ratio >= 0.5:
        tone = "positive"
        message = random.choice(WEEKLY_POSITIVE_MESSAGES)
    else:
        tone = "neutral"
        message = WEEKLY_NEUTRAL_MESSAGE

    return {
        "total_entries": total,
        "flagged_count": flagged_count,
        "top_distortion": top_tag,
        "distortion_counts": tag_counts,
        "sentiment_counts": sentiment_counts,
        "tone": tone,
        "message": message,
    }


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def weekly_insights(request):

    today = timezone.now().date()

    monday = today - timedelta(days=today.weekday())

    sunday = monday + timedelta(days=6)

    weekly_entries = CareLog.objects.filter(
        user=request.user,
        date_created__date__gte=monday,
        date_created__date__lte=sunday,
    ).order_by("date_created")

    count = weekly_entries.count()

    daily_feature_data = aggregate_weekly_feature_data(weekly_entries)

    features = {}

    feature_labels = {
        "urge_intensity": "Urge Intensity",
        "binge_urge": "Binge Urges",
        "restriction": "Restriction",
        "emotional_distress": "Emotional Distress",
        "stress_level": "Stress",
        "energy_level": "Energy",
        "sleep_hours": "Sleep",
        "num_meals": "Meals",
        "exercise_minutes": "Exercise",
    }

    for feature_key, entries in daily_feature_data.items():

        valid_entries = [e for e in entries if e is not None]

        if valid_entries:
            average = round(sum(valid_entries) / len(valid_entries), 2)
        else:
            average = 0

        trend_data = calculate_trend(entries)

        insights = get_feature_insights(
            feature_key,
            average,
            trend_data["trend"],
        )

        features[feature_key] = {
            "label": feature_labels[feature_key],
            "average": average,
            "entries": entries,
            "trend": trend_data["trend"],
            "trend_direction": trend_data["trend_direction"],
            "trend_value": trend_data["trend_value"],
            "insights": insights,
        }

    # Same week window, but pulled from the journal app too — a flagged
    # journal entry should count toward this signal exactly like a flagged
    # care log reflection does.
    weekly_journal_entries = JournalEntry.objects.filter(
        entry_author=request.user,
        date_created__date__gte=monday,
        date_created__date__lte=sunday,
    )

    language_insight = _build_language_insight(weekly_entries, weekly_journal_entries)

    check_in_days = {}

    for i in range(7):
        day = monday + timedelta(days=i)

        check_in_days[day.strftime("%a")] = weekly_entries.filter(
            date_created__date=day
        ).exists()

    return Response(
        {
            "week": {
                "start": monday.isoformat(),
                "end": sunday.isoformat(),
            },
            "entries_count": count,
            "features": features,
            "check_in_days": check_in_days,
            "language_insight": language_insight,
        },
        status=status.HTTP_200_OK,
    )
