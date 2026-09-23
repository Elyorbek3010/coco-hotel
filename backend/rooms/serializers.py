from rest_framework import serializers
from rooms.models import Amenity, Room, RoomImage


class AmenitySerializer(serializers.ModelSerializer):
    """
    Public serializer for room amenities.
    """
    class Meta:
        model = Amenity
        fields = ['id', 'name', 'icon']


class RoomImageSerializer(serializers.ModelSerializer):
    """
    Public serializer for room gallery and primary images.
    """
    image = serializers.SerializerMethodField()

    class Meta:
        model = RoomImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'sort_order']

    def get_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class RoomListSerializer(serializers.ModelSerializer):
    """
    Concise public serializer for room catalogue listings.
    """
    amenities = AmenitySerializer(many=True, read_only=True)
    primary_image = RoomImageSerializer(read_only=True)

    class Meta:
        model = Room
        fields = [
            'id',
            'name',
            'slug',
            'short_description',
            'price_per_night',
            'max_adults',
            'max_children',
            'bed_type',
            'room_size',
            'is_featured',
            'amenities',
            'primary_image',
        ]


class RoomDetailSerializer(serializers.ModelSerializer):
    """
    Comprehensive public serializer for room detail view.
    """
    amenities = AmenitySerializer(many=True, read_only=True)
    images = RoomImageSerializer(many=True, read_only=True)
    primary_image = RoomImageSerializer(read_only=True)

    class Meta:
        model = Room
        fields = [
            'id',
            'name',
            'slug',
            'short_description',
            'description',
            'price_per_night',
            'max_adults',
            'max_children',
            'bed_type',
            'room_size',
            'is_featured',
            'amenities',
            'primary_image',
            'images',
            'created_at',
            'updated_at',
        ]
