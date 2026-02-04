from django.http import JsonResponse
from .models import CareLog
from .serializers import CareLogSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import numpy as np
from .python.loader_gmm_model import gmm_model, gmm_scaler
from .python.latent_states import STATE_NAMES


# Create your views here.
@api_view(['GET', 'POST'])
def care_log_list(request):
    if request.method == "GET":
        care_log_entry = CareLog.objects.all()
        serializer = CareLogSerializer(care_log_entry, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        serializer = CareLogSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data

            x = np.array([[
                data["urge_intensity"],
                data["binge_urge"],
                data["restriction"],
                data["emotional_distress"],
                data["stress_level"],
                data["energy_level"],
            ]])

            scaler = gmm_scaler
            x_scaled = scaler.transform(x)

            cluster = int(gmm_model.predict(x_scaled)[0])
            state_name = STATE_NAMES.get(cluster, "unknown")
            care_log_input = serializer.save(cluster=cluster, state_name=state_name)

            return Response({
                "entry": CareLogSerializer(care_log_input).data, #converts saved care log entry db obj into JSON so frontend can read it
                "cluster": cluster, #splits btwn entry and cluster so ml pred can be easier to access
                "state_name": state_name
            }, status=status.HTTP_201_CREATED)
            #return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)