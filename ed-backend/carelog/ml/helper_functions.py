import numpy as np
from collections import defaultdict

from .loader_gmm_model import v2_gmm_model, v2_gmm_scaler
from .v2_state_names import STATE_NAMES
from .state_recommedations import RECOMMENDATIONS

WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

FEATURES = [
    "urge_intensity",
    "binge_urge",
    "restriction",
    "emotional_distress",
    "stress_level",
    "energy_level",
    "sleep_hours",
    "num_meals",
    "exercise_minutes",
]


def cluster_user(data):
    x = np.array(
        [
            [
                data["urge_intensity"],
                data["binge_urge"],
                data["restriction"],
                data["emotional_distress"],
                data["stress_level"],
                data["energy_level"],
                data["sleep_hours"],
                data["num_meals"],
                data["exercise_minutes"],
            ]
        ]
    )

    x_scaled = v2_gmm_scaler.transform(x)

    cluster = int(v2_gmm_model.predict(x_scaled)[0])

    state_name = STATE_NAMES.get(cluster, "unknown")

    return cluster, state_name


def aggregate_weekly_feature_data(entries):

    weekly_data = {}

    for feature in FEATURES:

        daily_values = defaultdict(list)

        for entry in entries:

            weekday = entry.date_created.strftime("%a")

            value = getattr(entry, feature)

            daily_values[weekday].append(value)

        daily_averages = []

        for day in WEEKDAYS:

            vals = daily_values.get(day, [])

            if vals:
                avg = round(sum(vals) / len(vals), 2)
            else:
                avg = None

            daily_averages.append(avg)

        weekly_data[feature] = daily_averages

    return weekly_data


def calculate_trend(entries):

    valid_entries = [e for e in entries if e is not None]

    if len(valid_entries) < 2:
        return {
            "trend": "stable",
            "trend_direction": "→",
            "trend_value": 0,
        }

    midpoint = len(valid_entries) // 2

    first_half = valid_entries[:midpoint]
    second_half = valid_entries[midpoint:]

    first_avg = sum(first_half) / len(first_half)
    second_avg = sum(second_half) / len(second_half)

    diff = round(abs(second_avg - first_avg), 2)

    if second_avg > first_avg:
        return {
            "trend": "increasing",
            "trend_direction": "↑",
            "trend_value": diff,
        }

    elif second_avg < first_avg:
        return {
            "trend": "decreasing",
            "trend_direction": "↓",
            "trend_value": diff,
        }

    return {
        "trend": "stable",
        "trend_direction": "→",
        "trend_value": diff,
    }


def get_recommendations(cluster, averages=None):

    recomms = RECOMMENDATIONS

    recommendations = {
        "general_statements": [],
        "condition_specific": [],
    }

    if cluster in recomms:

        cluster_data = recomms[cluster]

        if "general_statements" in cluster_data:
            recommendations["general_statements"] = cluster_data["general_statements"]

    if averages:

        if cluster == 0:

            if averages.get("stress_level", 0) > 6:

                recommendations["condition_specific"].extend(
                    recomms[0]["conditions"]["stress_over_6"]
                )

        elif cluster == 1:

            if averages.get("num_meals", 0) >= 2.5:

                recommendations["condition_specific"].extend(
                    recomms[1]["conditions"]["meals"]
                )

        elif cluster == 2:

            if averages.get("energy_level", 0) < 4:

                recommendations["condition_specific"].append(
                    "Your energy seems low lately. Rest and gentle recovery matter."
                )

        elif cluster == 3:

            recommendations["condition_specific"].extend(
                recomms[3]["conditions"]["meals"]
            )

    return recommendations


def get_feature_insights(feature_key, average, trend):

    insights = {
        "general_insight": "",
        "suggestions": [],
        "trend_message": "",
    }

    if feature_key == "stress_level":

        if average > 7:

            insights["general_insight"] = f"High stress week (avg: {average}/10)."

            insights["suggestions"] = [
                "Try a 10-minute breathing exercise",
                "Take breaks throughout the day",
                "Reach out to someone you trust",
            ]

        elif average > 4:

            insights["general_insight"] = (
                f"Moderate stress this week (avg: {average}/10)."
            )

            insights["suggestions"] = [
                "Continue your current coping strategies",
                "Schedule relaxing activities",
            ]

        else:

            insights["general_insight"] = f"Low stress week (avg: {average}/10)."

            insights["suggestions"] = ["Keep maintaining these healthy habits"]

    elif feature_key == "binge_urge":

        if average > 6:

            insights["general_insight"] = (
                f"Strong binge urges this week (avg: {average}/10)."
            )

            insights["suggestions"] = [
                "Practice urge surfing",
                "Use non-food coping mechanisms",
                "Reach out to your support system",
            ]

        elif average > 3:

            insights["general_insight"] = (
                f"Moderate binge urges this week (avg: {average}/10)."
            )

            insights["suggestions"] = [
                "Continue using coping tools",
                "Track triggers and patterns",
            ]

        else:

            insights["general_insight"] = (
                f"Low binge urges this week (avg: {average}/10)."
            )

            insights["suggestions"] = ["Keep doing what’s helping you"]

    elif feature_key == "sleep_hours":

        if average >= 7:

            insights["general_insight"] = (
                f"Excellent sleep this week (avg: {average}h/night)."
            )

            insights["suggestions"] = ["Maintain this consistent sleep routine"]

        elif average >= 6:

            insights["general_insight"] = (
                f"Good sleep this week (avg: {average}h/night)."
            )

            insights["suggestions"] = ["Keep prioritizing rest"]

        else:

            insights["general_insight"] = (
                f"Low sleep this week (avg: {average}h/night)."
            )

            insights["suggestions"] = [
                "Aim for 7-8 hours nightly",
                "Reduce screen time before bed",
            ]

    if trend == "increasing":

        insights["trend_message"] = "This metric increased this week"

    elif trend == "decreasing":

        insights["trend_message"] = "This metric decreased this week"

    else:

        insights["trend_message"] = "→ This metric stayed stable"

    return insights
