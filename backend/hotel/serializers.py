from rest_framework import serializers
from hotel.models import HotelInformation, Service, GalleryImage, Promotion


class HotelInformationSerializer(serializers.ModelSerializer):
    """
    Public serializer for hotel details, branding, contact and location.
    """
    class Meta:
        model = HotelInformation
        fields = [
            'name',
            'hero_title',
            'hero_subtitle',
            'about_title',
            'about_text',
            'phone',
            'secondary_phone',
            'email',
            'address',
            'map_url',
            'latitude',
            'longitude',
            'check_in_time',
            'check_out_time',
        ]


class ServiceSerializer(serializers.ModelSerializer):
    """
    Public serializer for hotel services.
    """
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'icon', 'sort_order']


class GalleryImageSerializer(serializers.ModelSerializer):
    """
    Public serializer for gallery showcase images.
    """
    image = serializers.SerializerMethodField()

    class Meta:
        model = GalleryImage
        fields = ['id', 'image', 'title', 'alt_text', 'sort_order']

    def get_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class PromotionListSerializer(serializers.ModelSerializer):
    """
    Public list serializer for special offers and promotions.
    """
    image = serializers.SerializerMethodField()

    class Meta:
        model = Promotion
        fields = [
            'id',
            'title',
            'slug',
            'short_description',
            'image',
            'valid_from',
            'valid_until',
        ]

    def get_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class PromotionDetailSerializer(serializers.ModelSerializer):
    """
    Public detail serializer for promotion view.
    """
    image = serializers.SerializerMethodField()

    class Meta:
        model = Promotion
        fields = [
            'id',
            'title',
            'slug',
            'short_description',
            'description',
            'image',
            'valid_from',
            'valid_until',
            'created_at',
            'updated_at',
        ]

    def get_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url
