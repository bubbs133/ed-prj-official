from django.http import JsonResponse
from .models import CareLog
from .serializers import CareLogSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .ml.helper_functions import cluster_user, get_recommendations

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from datetime import timedelta
from django.utils import timezone
import datetime

# Create your views here.
@api_view(['GET'])
def care_log_list(request):
    if request.method == "GET":
        care_log_entry = CareLog.objects.all()
        serializer = CareLogSerializer(care_log_entry, many=True)
        care_log_data = serializer.data
        return Response(care_log_data)
    return Response(care_log_data.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def care_log_cluster(request):
    if request.method == "POST":
        serializer = CareLogSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data

            cluster, state_name = cluster_user(data)

            care_log_input = serializer.save(user=request.user, cluster=cluster, state_name=state_name)

            return Response({
                "entry": CareLogSerializer(care_log_input).data, #converts saved care log entry db obj into JSON so frontend can read it
                "cluster": cluster, #splits btwn entry and cluster so ml pred can be easier to access
                "state_name": state_name
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_recommendations(request):
    if request.method == "GET":
        now = timezone.localtime(timezone=now)
        start_of_week = (now.weekday + 1) % 7

        today_data = CareLog.objects.filter(user=request.user).order_by("date_created").first()

        if not today_data:
            return Response(
                {"message": "No data for today"},
                status=status.HTTP_404_NOT_FOUND
                )
        today_recs = get_recommendations(today_data.cluster)
    return Response(today_recs, status=status.HTTP_400_BAD_REQUEST)



"""    if request.method == "GET":
        serializer = CareLogSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            cluster, _ = cluster_user(data)
            
            get_recoms = get_recommendations(cluster)
            print(get_recoms)
            return get_recoms
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)"""