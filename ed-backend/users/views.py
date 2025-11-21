from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from .serializers import SignUpSerializer, LoginSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

# Create your views here.
@api_view(['GET', 'POST'])
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
def login_user(request):
    if request.method == "POST":
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "username": user.username,
                "email": user.email
                })
        print("Error")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

"""from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import SignUpSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SignUpSerializer"""