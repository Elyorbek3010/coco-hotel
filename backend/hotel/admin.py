from django.contrib import admin
from hotel.models import HotelInformation, Service, GalleryImage, Promotion


@admin.register(HotelInformation)
class HotelInformationAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'phone',
        'email',
        'address',
        'check_in_time',
        'check_out_time',
        'updated_at'
    )
    fieldsets = (
        ('Branding & Hero', {
            'fields': ('name', 'hero_title', 'hero_subtitle')
        }),
        ('About Section', {
            'fields': ('about_title', 'about_text')
        }),
        ('Contact Information', {
            'fields': ('phone', 'secondary_phone', 'email', 'address')
        }),
        ('Location & Coordinates', {
            'fields': ('map_url', 'latitude', 'longitude')
        }),
        ('Times & Policies', {
            'fields': ('check_in_time', 'check_out_time')
        }),
    )

    def has_add_permission(self, request):
        if HotelInformation.objects.exists():
            return False
        return super().has_add_permission(request)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon', 'sort_order', 'is_active', 'created_at')
    list_editable = ('sort_order', 'is_active')
    search_fields = ('name', 'description', 'icon')
    list_filter = ('is_active',)
    ordering = ('sort_order', 'name')


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'image', 'alt_text', 'sort_order', 'is_active', 'created_at')
    list_editable = ('sort_order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title', 'alt_text')
    ordering = ('sort_order', 'id')


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ('title', 'valid_from', 'valid_until', 'sort_order', 'is_active', 'created_at')
    list_editable = ('sort_order', 'is_active')
    list_filter = ('is_active', 'valid_from', 'valid_until')
    search_fields = ('title', 'short_description', 'description')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('sort_order', 'id')
