from django.contrib import admin
from .models import BookingRequest


@admin.register(BookingRequest)
class BookingRequestAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'full_name',
        'room',
        'check_in',
        'check_out',
        'adults',
        'children',
        'phone',
        'status',
        'created_at',
    )
    list_filter = (
        'status',
        'room',
        'check_in',
        'check_out',
        'created_at',
    )
    search_fields = (
        'full_name',
        'phone',
        'email',
        'room_name_snapshot',
    )
    ordering = ('-created_at',)
    readonly_fields = (
        'room_name_snapshot',
        'price_per_night_snapshot',
        'created_at',
        'updated_at',
    )
    fieldsets = (
        ('Guest', {
            'fields': (
                'full_name',
                'phone',
                'email',
            )
        }),
        ('Stay', {
            'fields': (
                'room',
                'room_name_snapshot',
                'price_per_night_snapshot',
                'check_in',
                'check_out',
                'adults',
                'children',
            )
        }),
        ('Request', {
            'fields': (
                'special_request',
            )
        }),
        ('Management', {
            'fields': (
                'status',
                'admin_note',
            )
        }),
        ('Metadata', {
            'fields': (
                'created_at',
                'updated_at',
            ),
            'classes': ('collapse',),
        }),
    )
