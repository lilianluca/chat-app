"""API endpoint for user registration."""

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import generics, serializers
from rest_framework.exceptions import ErrorDetail
from rest_framework.permissions import AllowAny

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
    )

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "password",
            "confirm_password",
            "first_name",
            "last_name",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        """Validate that the password and confirm_password fields match."""
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password": [
                        ErrorDetail(
                            "Password fields didn't match.", code="password_mismatch"
                        )
                    ]
                }
            )
        return attrs

    def create(self, validated_data):
        """Create a new user with the validated data."""
        validated_data.pop("confirm_password")
        return User.objects.create_user(**validated_data)


class UserRegistrationApiView(generics.CreateAPIView):
    """API view for user registration."""

    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    authentication_classes = ()
    permission_classes = (AllowAny,)
