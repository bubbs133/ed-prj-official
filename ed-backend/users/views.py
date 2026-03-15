from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from .serializers import SignUpSerializer, LoginSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny

# Create your views here.
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def user_list(request):
    if request.method == "GET":
        users = User.objects.all()
        serializer = SignUpSerializer(users, many=True)
        return JsonResponse(serializer.data, safe=False)
    if request.method == "POST":
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    if request.method == "POST":
        print("REQUEST DATA RECEIVED:", request.data)
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "username": user.username,
                "email": user.email
                })
        print("Serializer Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
