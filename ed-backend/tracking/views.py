from django.http import JsonResponse
from .models import TrackingEntry
from .serializers import TrackingEntrySerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


# Create your views here.
@api_view(['GET', 'POST'])
def tracking_list(request):
    if request.method == "GET":
        tracking_entry = TrackingEntry.objects.all()
        serializer = TrackingEntrySerializer(tracking_entry, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        serializer = TrackingEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    """if request.method == "POST":
        serializer = TrackingEntrySerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Prefer saving the authenticated user if available
                if hasattr(request, "user") and request.user and request.user.is_authenticated:
                    serializer.save(user=request.user)
                else:
                    serializer.save()
            except Exception as e:
                return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # Return validation errors as JSON instead of falling through
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)"""