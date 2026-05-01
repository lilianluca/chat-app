"""User search API view."""

from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated

from users.serializers import UserSearchSerializer

User = get_user_model()


class UserSearchApiView(generics.ListAPIView):
    """Search for users by username or email."""

    serializer_class = UserSearchSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (SearchFilter,)
    search_fields = ("email", "first_name", "last_name")

    def get_queryset(self):
        """Return the queryset of users to search."""
        return User.objects.exclude(id=self.request.user.id).filter(is_active=True)

    def filter_queryset(self, queryset):
        """Filter the queryset based on the search query and limit to 20 results."""
        filtered_queryset = super().filter_queryset(queryset)
        # Limit to 20 results
        return filtered_queryset[:20]
