"""API endpoint for retrieving the profile of the currently authenticated user."""

from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response


class OutputSerializer(serializers.Serializer):
    """Serializer for the output of the get_current_user_info endpoint."""

    id = serializers.IntegerField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_current_user_info(request: Request) -> Response:
    """Retrieve the profile of the currently authenticated user."""
    output_serializer = OutputSerializer(request.user)
    return Response(output_serializer.data)
