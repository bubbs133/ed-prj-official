from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.conf import settings

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "username", "password"]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"]
        )
        user.is_active = False
        user.save(update_fields=["is_active"])
        return user

    def validate_email(self, value):
        domain = value.rsplit("@", 1)[-1].lower()
        allowed_domains = settings.ALLOWED_EMAIL_DOMAINS
        if allowed_domains and domain not in allowed_domains:
            raise serializers.ValidationError(
                "Please use an email from an allowed domain."
            )
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already in use.")
        return value
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError("Incorrect username or password")
        else:
            raise serializers.ValidationError("Username and password required")
        
        data["user"] = user
        return data