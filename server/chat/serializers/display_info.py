from rest_framework import serializers


class DisplayInfoSerializer(serializers.Serializer):
    """Serializer for conversation display information, including name and avatar."""

    name = serializers.CharField()
    short_name = serializers.CharField()
    status_emoji = serializers.CharField()
    avatar = serializers.URLField()
