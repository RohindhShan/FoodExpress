from rest_framework import permissions

class IsRestaurantOwnerOrReadOnly(permissions.BasePermission):
    """
    - Read (GET) permissions: Everyone (including customers)
    - Write (POST, PUT, DELETE): Only Restaurant Owner
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.role == 'restaurant')

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Check if restaurant owner matches
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        if hasattr(obj, 'restaurant'):
            return obj.restaurant.owner == request.user
        return False