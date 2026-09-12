from django.conf import settings
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


def validate_email_domain(value):
    domain = value.split("@")[-1].lower()
    if domain not in [d.lower() for d in settings.ALLOWED_EMAIL_DOMAINS]:
        raise serializers.ValidationError(
            f"Please use an email from one of: {', '.join(settings.ALLOWED_EMAIL_DOMAINS)}"
        )


class SignUpSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[validate_email_domain])

    class Meta:
        model = User
        fields = ["email", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"],
        )
        user.is_active = False  # locked until they verify their email code
        user.save()
        return user


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
