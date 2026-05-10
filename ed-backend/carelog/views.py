from django.http import JsonResponse
from .models import CareLog
from .serializers import CareLogSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .ml.helper_functions import cluster_user, get_recommendations, get_feature_insights, calculate_trend, aggregate_weekly_feature_data

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from django.contrib.auth.decorators import login_required

from datetime import timedelta
from django.utils import timezone
import datetime


# Create your views here.
@api_view(["GET"])
def care_log_list(request):
    if request.method == "GET":
        care_log_entry = CareLog.objects.all()
        serializer = CareLogSerializer(care_log_entry, many=True)
        care_log_data = serializer.data
        return Response(care_log_data)
    return Response(care_log_data.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def care_log_cluster(request):
    if request.method == "POST":
        serializer = CareLogSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data

            cluster, state_name = cluster_user(data)

            care_log_input = serializer.save(
                user=request.user, cluster=cluster, state_name=state_name
            )

            return Response(
                {
                    "entry": CareLogSerializer(
                        care_log_input
                    ).data,  # converts saved care log entry db obj into JSON so frontend can read it
                    "cluster": cluster,  # splits btwn entry and cluster so ml pred can be easier to access
                    "state_name": state_name,
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
            {"detail": "No care log data for user"}, status=status.HTTP_404_NOT_FOUND
        )

    serializer = CareLogSerializer(latest_entry)
    return Response(serializer.data, status=status.HTTP_200_OK)


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

    if not weekly_entries.exists():

        return Response(
            {"detail": "No care log data for this week"},
            status=status.HTTP_404_NOT_FOUND,
        )

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

    return Response(
        {
            "week": {
                "start": monday.isoformat(),
                "end": sunday.isoformat(),
            },
            "entries_count": count,
            "features": features,
        },
        status=status.HTTP_200_OK,
    )
